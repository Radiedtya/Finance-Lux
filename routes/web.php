<?php

use App\Http\Controllers\Auth\OAuthController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/auth/github', [OAuthController::class, 'redirectToGithub'])->name('auth.github');
Route::get('/auth/github/callback', [OAuthController::class, 'handleGithubCallback']);

Route::any('/register', function () {
    abort(404);
});

Route::middleware(['auth', 'verified', 'is_user'])->group(function () {
    // URL: /dashboard -> Mengarah ke komponen Pages/dashboard.jsx
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::prefix('admin')->middleware(['auth', 'verified', 'is_admin'])->group(function () {
    // URL: /admin/dashboard -> Mengarah ke komponen Pages/Admin/Dashboard.jsx
    Route::inertia('dashboard', 'Admin/Dashboard')->name('admin.dashboard');
});

require __DIR__.'/settings.php';