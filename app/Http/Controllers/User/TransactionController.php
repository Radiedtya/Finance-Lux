<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['wallet', 'category'])
            ->where('user_id', auth()->id())
            ->latest('date')
            ->get();

        $wallets = Wallet::where('user_id', auth()->id())->get(['id', 'name']);
        $categories = Category::where('user_id', auth()->id())->get(['id', 'name', 'type', 'color']);

        return Inertia::render('user/transactions/index', [
            'transactions' => $transactions,
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        DB::transaction(function () use ($validated) {
            $transaction = Transaction::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            $this->applyToWalletBalance($transaction, 1);
        });

        return redirect()->back()->with('success', 'Transaksi berhasil ditambahkan!');
    }

    public function update(Request $request, Transaction $transaction)
    {
        abort_if($transaction->user_id !== auth()->id(), 403);

        $validated = $this->validated($request);

        DB::transaction(function () use ($validated, $transaction) {
            $this->applyToWalletBalance($transaction, -1);
            $transaction->update($validated);
            $this->applyToWalletBalance($transaction->refresh(), 1);
        });

        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui!');
    }

    public function destroy(Transaction $transaction)
    {
        abort_if($transaction->user_id !== auth()->id(), 403);

        DB::transaction(function () use ($transaction) {
            $this->applyToWalletBalance($transaction, -1);
            $transaction->delete();
        });

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus!');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'wallet_id' => [
                'required',
                'exists:wallets,id,user_id,' . auth()->id(),
            ],
            'category_id' => [
                'nullable',
                'exists:categories,id,user_id,' . auth()->id(),
            ],
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
        ]);
    }

    private function applyToWalletBalance(Transaction $transaction, int $direction): void
    {
        $amount = $transaction->amount * $direction;
        $signedAmount = $transaction->type === 'income' ? $amount : -$amount;

        Wallet::where('id', $transaction->wallet_id)->increment('balance', $signedAmount);
    }
}