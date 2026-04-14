<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('menu', MenuItemController::class);
    Route::resource('categories', CategoryController::class);

    Route::get('/kitchen', [App\Http\Controllers\OrderController::class, 'kitchen'])->name('kitchen.index');
    Route::post('/kitchen/{id}/complete', [App\Http\Controllers\OrderController::class, 'markAsCompleted'])->name('kitchen.complete');
});

Route::get('/table/{table_number}', [OrderController::class, 'showMenu'])->name('customer.menu');
Route::post('/table/{table_number}/cart', [OrderController::class, 'addToCart'])->name('customer.cart.add');
Route::post('/table/{table_number}/cart/remove', [OrderController::class, 'removeFromCart'])->name('customer.cart.remove');
Route::post('/table/{table_number}/checkout', [OrderController::class, 'checkout'])->name('customer.checkout');

require __DIR__ . '/auth.php';
