<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ApiController as AdminApis;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\LogController as AdminLogs;
use App\Http\Controllers\Admin\UserController as AdminUsers;
use App\Http\Controllers\User\ApiKeyController;
use App\Http\Controllers\User\DashboardController as UserDashboard;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $user = auth()->user();
    if (! $user) {
        return redirect('/login');
    }
    return redirect($user->isAdmin() ? '/admin' : '/dashboard');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminDashboard::class, 'index']);

    Route::get('/apis', [AdminApis::class, 'index']);
    Route::get('/apis/create', [AdminApis::class, 'create']);
    Route::post('/apis', [AdminApis::class, 'store']);
    Route::get('/apis/{api}/edit', [AdminApis::class, 'edit']);
    Route::put('/apis/{api}', [AdminApis::class, 'update']);
    Route::delete('/apis/{api}', [AdminApis::class, 'destroy']);
    Route::post('/apis/{api}/toggle', [AdminApis::class, 'toggle']);

    Route::get('/users', [AdminUsers::class, 'index']);
    Route::post('/users/{user}/adjust', [AdminUsers::class, 'adjust']);
    Route::post('/users/{user}/toggle', [AdminUsers::class, 'toggle']);

    Route::get('/logs', [AdminLogs::class, 'index']);
});

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/dashboard', [UserDashboard::class, 'index']);
    Route::post('/dashboard/api-key', [ApiKeyController::class, 'generate']);
    Route::delete('/dashboard/api-key', [ApiKeyController::class, 'revoke']);
});
