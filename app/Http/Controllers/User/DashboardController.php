<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use Carbon\Carbon;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Get all wallets for the user
        $wallets = Wallet::where('user_id', $user->id)->get();
        $totalWallets = $wallets->count();
        $totalBalance = $wallets->sum('balance');

        // Get all categories
        $totalCategories = Category::where('user_id', $user->id)->count();

        // Get all transactions
        $totalTransactions = Transaction::where('user_id', $user->id)->count();

        // Get transactions for the current month
        $transactions = Transaction::where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        // Get recent transactions (last 5)
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->with(['wallet', 'category'])
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Get expense by category (for bar chart)
        $expenseByCategory = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category->name,
                    'color' => $item->category->color,
                    'total' => (float) $item->total,
                ];
            });

        // Get daily transactions for line chart (last 7 days)
        $dailyData = collect(range(0, 6))->map(function ($day) use ($user) {
            $date = Carbon::now()->subDays($day)->format('Y-m-d');
            $dayTransactions = Transaction::where('user_id', $user->id)
                ->whereDate('date', $date)
                ->get();

            return [
                'date' => $date,
                'income' => (float) $dayTransactions->where('type', 'income')->sum('amount'),
                'expense' => (float) $dayTransactions->where('type', 'expense')->sum('amount'),
            ];
        })->reverse()->values();

        // Get monthly summary for the last 6 months
        $monthlySummary = collect(range(0, 5))->map(function ($month) use ($user) {
            $date = Carbon::now()->subMonths($month);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $monthTransactions = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$start, $end])
                ->get();

            return [
                'month' => $date->format('M Y'),
                'income' => (float) $monthTransactions->where('type', 'income')->sum('amount'),
                'expense' => (float) $monthTransactions->where('type', 'expense')->sum('amount'),
            ];
        })->reverse()->values();

        // Get top expense categories
        $topExpenseCategories = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category->name,
                    'color' => $item->category->color,
                    'total' => (float) $item->total,
                ];
            });

        return inertia('user/dashboard', [
            'stats' => [
                'total_wallets' => $totalWallets,
                'total_balance' => $totalBalance,
                'total_categories' => $totalCategories,
                'total_transactions' => $totalTransactions,
            ],
            'recent_transactions' => $recentTransactions,
            'charts' => [
                'expense_by_category' => $expenseByCategory,
                'daily' => $dailyData,
                'monthly_summary' => $monthlySummary,
                'top_expense_categories' => $topExpenseCategories,
            ],
            'current_month' => Carbon::now()->format('F Y'),
        ]);
    }
}