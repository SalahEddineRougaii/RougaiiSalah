<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric',
                'ville' => 'required|string|max:100',
                'adresse' => 'required|string|max:255',
                'type_bien' => 'required|string|max:100',
                'nb_pieces' => 'required|integer',
                'statut' => 'required|string|in:vente,location',
                'image' => 'nullable|image|max:2048',
            ]);

            $annonce = new Annonce();
            $annonce->user_id = $request->user_id;
            $annonce->titre = $request->titre;
            $annonce->description = $request->description;
            $annonce->prix = $request->prix;
            $annonce->ville = $request->ville;
            $annonce->adresse = $request->adresse;
            $annonce->type_bien = $request->type_bien;
            $annonce->nb_pieces = $request->nb_pieces;
            $annonce->statut = $request->statut;

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('annonces', 'public');
                $annonce->image = $path;
            }

            $annonce->save();

            return response()->json(['message' => 'Annonce créée avec succès', 'annonce' => $annonce], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function mesAnnonces(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id manquant'], 400);
        }

        $annonces = Annonce::where('user_id', $userId)->get();

        return response()->json($annonces);
    }
}
