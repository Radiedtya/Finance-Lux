<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Mengarahkan user ke halaman login GitHub.
     */
    public function redirectToGithub()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Menerima data kembalian (callback) dari GitHub.
     */
    public function handleGithubCallback()
    {
        try {
            // Mengambil data user dari GitHub
            $githubUser = Socialite::driver('github')->user();
            
            // 1. Cari user berdasarkan email. Kalau belum terdaftar, otomatis buat akun baru.
            $user = User::firstOrCreate(
                ['email' => $githubUser->getEmail()],
                [
                    'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                    'github_id' => $githubUser->getId(),
                    'avatar' => $githubUser->getAvatar(),
                    'role' => 'user', // Otomatis diset sebagai user biasa
                    'password' => null, // Dikosongkan karena tidak login pakai password bawaan
                ]
            );

            // 2. Antisipasi: Jika user sudah pernah daftar manual pakai email yang sama,
            // tapi akunnya belum terhubung ke GitHub, kita hubungkan sekarang.
            if (!$user->github_id) {
                $user->update([
                    'github_id' => $githubUser->getId(),
                    'avatar' => $githubUser->getAvatar(),
                ]);
            }

            // 3. Login-kan user ke dalam sistem Laravel
            Auth::login($user);

            // 4. Lempar user ke halaman dashboard khusus user biasa
            return redirect()->route('dashboard');

        } catch (Exception $e) {
            // Jika ada error (misal koneksi timeout atau user batal login), balikkan ke halaman login
            return redirect()->route('login')->with('error', 'Gagal login via GitHub. Silakan coba lagi.');
        }
    }
}