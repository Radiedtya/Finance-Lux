<?php

namespace App\Console\Commands;

use App\Models\Wallet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecalculateWalletBalances extends Command
{
    protected $signature = 'wallets:recalculate';

    protected $description = 'Hitung ulang saldo semua wallet berdasarkan total transaksi yang tercatat';

    public function handle(): int
    {
        $wallets = Wallet::all();

        $this->info("Menghitung ulang saldo {$wallets->count()} wallet...");

        foreach ($wallets as $wallet) {
            $income = DB::table('transactions')
                ->where('wallet_id', $wallet->id)
                ->where('type', 'income')
                ->sum('amount');

            $expense = DB::table('transactions')
                ->where('wallet_id', $wallet->id)
                ->where('type', 'expense')
                ->sum('amount');

            $correctBalance = $income - $expense;

            if ((float) $wallet->balance !== (float) $correctBalance) {
                $this->line("Wallet #{$wallet->id} ({$wallet->name}): {$wallet->balance} -> {$correctBalance}");
                $wallet->update(['balance' => $correctBalance]);
            }
        }

        $this->info('Selesai.');

        return self::SUCCESS;
    }
}