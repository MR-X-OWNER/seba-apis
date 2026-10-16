<?php

use App\Http\Controllers\Api\ProxyController;
use Illuminate\Support\Facades\Route;

Route::match(['get', 'post'], '/v1/call/{slug}', [ProxyController::class, 'call'])
    ->middleware('api.key');
