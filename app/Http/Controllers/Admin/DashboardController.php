<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Models\ContactMessage;

use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalWallets = Wallet::count();

        $volumeStart = Carbon::now()->subDays(7);
        $previousVolumeStart = Carbon::now()->subDays(14);

        $transactionVolume = Transaction::where('date', '>=', $volumeStart)->sum('amount');
        $previousVolume = Transaction::whereBetween('date', [$previousVolumeStart, $volumeStart])->sum('amount');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'usersGrowth' => $this->monthlyGrowth(User::query()),
                'totalWallets' => $totalWallets,
                'walletsGrowth' => $this->monthlyGrowth(Wallet::query()),
                'transactionVolume' => (float) $transactionVolume,
                'volumeGrowth' => $this->calcGrowth($previousVolume, $transactionVolume),
            ],
            'monthlyData' => $this->monthlyCashFlow(),
            'donutData' => $this->topExpenseCategories(),
            'recentMessages' => ContactMessage::latest()->take(3)->get()->map(fn ($msg) => [
                'name' => $msg->name,
                'message' => $msg->message,
                'created_at' => $msg->created_at->translatedFormat('d M Y'),
            ]),
        ]);
    }

    private function monthlyGrowth($query): float
    {
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();

        $thisMonthCount = (clone $query)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->count();

        $lastMonthCount = (clone $query)
            ->whereYear('created_at', $lastMonth->year)
            ->whereMonth('created_at', $lastMonth->month)
            ->count();

        return $this->calcGrowth($lastMonthCount, $thisMonthCount);
    }

    private function calcGrowth(float|int $previous, float|int $current): float
    {
        if ($previous <= 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function monthlyCashFlow()
    {
        return collect(range(5, 0))->map(function ($monthsAgo) {
            $month = Carbon::now()->subMonths($monthsAgo);

            return [
                'name' => $month->translatedFormat('M'),
                'Pemasukan' => (float) Transaction::where('type', 'income')
                    ->whereYear('date', $month->year)
                    ->whereMonth('date', $month->month)
                    ->sum('amount'),
                'Pengeluaran' => (float) Transaction::where('type', 'expense')
                    ->whereYear('date', $month->year)
                    ->whereMonth('date', $month->month)
                    ->sum('amount'),
            ];
        })->values();
    }

    private function topExpenseCategories()
    {
        $colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6'];

        return Category::query()
            ->select('categories.name')
            ->selectRaw('SUM(transactions.amount) as total')
            ->join('transactions', 'transactions.category_id', '=', 'categories.id')
            ->where('transactions.type', 'expense')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total')
            ->limit(4)
            ->get()
            ->values()
            ->map(fn ($category, $index) => [
                'name' => $category->name,
                'value' => (float) $category->total,
                'color' => $colors[$index] ?? '#a1a1aa',
            ]);
    }
}