<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Wallet::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('user/wallets/index', [
            'wallets' => $wallets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric|min:0',
        ]);

        Wallet::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Dompet berhasil ditambahkan!');
    }

    public function update(Request $request, Wallet $wallet)
    {
        abort_if($wallet->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric|min:0',
        ]);

        $wallet->update($validated);

        return redirect()->back()->with('success', 'Dompet berhasil diperbarui!');
    }

    public function destroy(Wallet $wallet)
    {
        abort_if($wallet->user_id !== auth()->id(), 403);

        if ($wallet->transactions()->exists()) {
            return redirect()->back()->with(
                'error',
                'Dompet tidak bisa dihapus karena masih memiliki riwayat transaksi.'
            );
        }

        $wallet->delete();

        return redirect()->back()->with('success', 'Dompet berhasil dihapus!');
    }
}