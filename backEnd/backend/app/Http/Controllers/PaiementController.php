<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PaiementController extends Controller
{
    public function payer(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'annonces_restantes' => 'required|integer|min:1',
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $user->annonces_restantes = $request->annonces_restantes;
        $user->a_paye = true;
        $user->save();

        return response()->json(['message' => 'Paiement confirmé !']);
    }
}