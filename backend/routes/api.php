<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AuthController;


Route::post('/login', [AuthController::class, 'login']); 
Route::middleware('auth:sanctum')->group(function () { // Rutas Protegidas por Sanctum
    Route::get('/catalogs/countries', [CatalogoController::class, 'getCountries']);
    Route::get('/catalogs/neighborhoods/{country}/{cp}', [CatalogoController::class, 'getNeighborhoods']);
    
    // CRUD de solicitudes protegido
    Route::get('/requests', [RequestController::class, 'index']); // Listar
    Route::post('/requests', [RequestController::class, 'store']); // Crear
});