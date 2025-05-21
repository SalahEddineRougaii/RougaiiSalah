<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsersController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\Api\BienController;
use App\Http\Controllers\PaiementController;




Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout']);

Route::get('/users', [UsersController::class, 'index']);
Route::put('/users/{id}', [UsersController::class, 'update']);
Route::delete('/users/{id}', [UsersController::class, 'destroy']);
Route::get('/biens', [BienController::class, 'index']);
Route::post('/biens', [BienController::class, 'store']);


Route::post('/annonces', [AnnonceController::class, 'store']);
Route::get('/annonces/miennes', [AnnonceController::class, 'mesAnnonces']);

Route::post('/paiement', [PaiementController::class, 'payer']);

Route::get('/users/{id}', [UsersController::class, 'show']);

Route::get('/admin/annonces', [AnnonceController::class, 'index']);
Route::get('/admin/annonces/{id}', [AnnonceController::class, 'show']);
Route::put('/admin/annonces/{id}', [AnnonceController::class, 'update']);
Route::delete('/admin/annonces/{id}', [AnnonceController::class, 'destroy']);

Route::get('/annonces', [AnnonceController::class, 'index']);

Route::post('/annonces', [AnnonceController::class, 'store']);
Route::get('/vendeur/annonces', [AnnonceController::class, 'vendeurIndex']); // liste des annonces du vendeur (avec user_id en paramètre)
Route::get('/vendeur/annonces/{id}', [AnnonceController::class, 'vendeurShow']); // voir une annonce précise du vendeur
Route::post('/vendeur/annonces', [AnnonceController::class, 'store']); // création (déjà existant)
Route::post('/vendeur/annonces/{id}', [AnnonceController::class, 'vendeurUpdate']); // modification (POST + _method=PUT)
Route::delete('/vendeur/annonces/{id}', [AnnonceController::class, 'vendeurDestroy']); // suppression

Route::put('/vendeur/annonces/{id}', [AnnonceController::class, 'vendeurUpdate']);