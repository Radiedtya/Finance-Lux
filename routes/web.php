<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;

use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LandingController;

use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\WalletController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\TransactionController;

use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('home');

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::get('/auth/github', [OAuthController::class, 'redirectToGithub'])->name('auth.github');
Route::get('/auth/github/callback', [OAuthController::class, 'handleGithubCallback']);

Route::any('/register', function () {
    abort(404);
});

Route::middleware(['auth', 'verified', 'is_user'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    Route::resource('wallets', WalletController::class)->names([
        'index' => 'userWallets',
    ]);

    Route::resource('categories', CategoryController::class)->names([
        'index' => 'userCategories',
    ]);

    Route::resource('transactions', TransactionController::class)->names([
        'index' => 'userTransactions',
    ]);
});

Route::prefix('admin')->middleware(['auth', 'verified', 'is_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('adminDashboard');

    Route::resource('users', UserController::class)
        ->only(['index', 'update'])
        ->names([
            'index' => 'adminUsers',
        ]);

    Route::resource('messages', AdminContactController::class)
        ->only(['index', 'destroy'])
        ->names([
            'index' => 'adminMessages',
        ]);
});

require __DIR__.'/settings.php';