<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () { // rutas protegidas por sanctum
    Route::get('/catalogs/countries', [CatalogoController::class, 'getCountries']);
    Route::get('/catalogs/location/{country_code}/{postal_code}', [CatalogoController::class, 'getNeighborhoods']);
    
    // CRUD de solicitudes
    Route::get('/requests', [RequestController::class, 'index']); // listar
    Route::post('/requests', [RequestController::class, 'store']); // crear
    Route::put('/requests/{id}', [RequestController::class, 'update']); // 👑 ACTUALIZAR ESTATUS REAL
});