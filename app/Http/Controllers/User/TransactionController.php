<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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

        $this->assertSufficientBalance(
            $validated['wallet_id'],
            $validated['type'],
            $validated['amount'],
        );

        Transaction::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Transaksi berhasil ditambahkan!');
    }

    public function update(Request $request, Transaction $transaction)
    {
        abort_if($transaction->user_id !== auth()->id(), 403);

        $validated = $this->validated($request);

        $this->assertSufficientBalance(
            $validated['wallet_id'],
            $validated['type'],
            $validated['amount'],
            $transaction,
        );

        $transaction->update($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui!');
    }

    public function destroy(Transaction $transaction)
    {
        abort_if($transaction->user_id !== auth()->id(), 403);

        $transaction->delete();

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
                'required',
                'exists:categories,id,user_id,' . auth()->id(),
            ],
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
        ]);
    }

    /**
     * Pastikan saldo dompet cukup kalau transaksi ini expense.
     * Kalau ini update dan wallet-nya sama dengan transaksi lama,
     * efek transaksi lama di-undo dulu sebelum dicek biar gak salah hitung.
     */
    private function assertSufficientBalance(
        int $walletId,
        string $type,
        float $amount,
        ?Transaction $excluding = null,
    ): void {
        if ($type !== 'expense') {
            return;
        }

        $wallet = Wallet::findOrFail($walletId);
        $availableBalance = $wallet->balance;

        if ($excluding && (int) $excluding->wallet_id === $walletId) {
            $oldSignedAmount = $excluding->type === 'income'
                ? $excluding->amount
                : -$excluding->amount;

            $availableBalance -= $oldSignedAmount;
        }

        if ($availableBalance < $amount) {
            throw ValidationException::withMessages([
                'amount' => 'Saldo dompet tidak mencukupi. Saldo tersedia: Rp '
                    . number_format($availableBalance, 0, ',', '.'),
            ]);
        }
    }
}