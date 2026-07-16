<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Wallet;

class TransactionObserver
{
    private ?array $originalState = null;

    public function creating(Transaction $transaction): void
    {
        //
    }

    public function created(Transaction $transaction): void
    {
        $this->applyEffect($transaction->wallet_id, $transaction->type, $transaction->amount, 1);
    }

    public function updating(Transaction $transaction): void
    {
        $this->originalState = [
            'wallet_id' => $transaction->getOriginal('wallet_id'),
            'type' => $transaction->getOriginal('type'),
            'amount' => $transaction->getOriginal('amount'),
        ];
    }

    public function updated(Transaction $transaction): void
    {
        if ($this->originalState === null) {
            return;
        }

        $this->applyEffect(
            $this->originalState['wallet_id'],
            $this->originalState['type'],
            $this->originalState['amount'],
            -1,
        );

        $this->applyEffect($transaction->wallet_id, $transaction->type, $transaction->amount, 1);

        $this->originalState = null;
    }

    public function deleted(Transaction $transaction): void
    {
        $this->applyEffect($transaction->wallet_id, $transaction->type, $transaction->amount, -1);
    }

    public function restored(Transaction $transaction): void
    {
        $this->applyEffect($transaction->wallet_id, $transaction->type, $transaction->amount, 1);
    }

    public function forceDeleted(Transaction $transaction): void
    {
        //
    }

    private function applyEffect(int $walletId, string $type, float $amount, int $direction): void
    {
        $signedAmount = $type === 'income' ? $amount * $direction : -$amount * $direction;

        Wallet::where('id', $walletId)->increment('balance', $signedAmount);
    }
}