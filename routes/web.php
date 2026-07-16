<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;

use App\Http\Controllers\Auth\OAuthController;

use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\WalletController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\TransactionController;

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/auth/github', [OAuthController::class, 'redirectToGithub'])->name('auth.github');
Route::get('/auth/github/callback', [OAuthController::class, 'handleGithubCallback']);

Route::any('/register', function () {
    abort(404);
});

Route::middleware(['auth', 'verified', 'is_user'])->group(function () {
    // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');


    Route::resource('wallets', WalletController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('transactions', TransactionController::class);
});

Route::prefix('admin')->middleware(['auth', 'verified', 'is_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::resource('users', UserController::class)->only(['index', 'update']);
});

require __DIR__.'/settings.php';