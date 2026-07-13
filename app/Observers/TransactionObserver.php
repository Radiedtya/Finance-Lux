<?php

namespace App\Observers;

use App\Models\Transaction;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        // 1. Ambil data dompet yang bersangkutan
        $wallet = $transaction->wallet;

        // 2. Jalankan logika matematika berdasarkan tipe transaksi
        if ($transaction->type === 'income') {
            // Jika pemasukan, tambah saldo dompet
            $wallet->increment('balance', $transaction->amount);
        } elseif ($transaction->type === 'expense') {
            // Jika pengeluaran, kurangi saldo dompet
            $wallet->decrement('balance', $transaction->amount);
        }
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "force deleted" event.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        //
    }
}
