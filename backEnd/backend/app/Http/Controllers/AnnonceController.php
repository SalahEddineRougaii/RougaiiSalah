<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    // Ajouter une annonce
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
                'nombre_pieces' => 'required|integer',
                'statut' => 'required|in:vendue,louée',
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
            $annonce->nombre_pieces = $request->nombre_pieces;
            $annonce->statut = $request->statut;

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('annonces', 'public');
                $annonce->image = $path;
            }

            $annonce->save();

            return response()->json([
                'status' => 'success',
                'annonce' => $annonce
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création d\'annonce', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer les annonces du vendeur (par user_id)
    public function mesAnnonces(Request $request)
    {
        try {
            $userId = $request->query('user_id');

            if (!$userId) {
                return response()->json(['error' => 'user_id manquant'], 400);
            }

            $annonces = Annonce::where('user_id', $userId)->get();

            return response()->json($annonces);

        } catch (\Exception $e) {
            \Log::error('Erreur récupération annonces', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }


    // Lister toutes les annonces (admin)
    public function index()
    {
        return Annonce::with('user')->get();
    }

    // Voir une annonce
    public function show($id)
    {
        $annonce = Annonce::with('user')->find($id);
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        return response()->json($annonce);
    }

    // Modifier une annonce
    public function update(Request $request, $id)
    {
        $annonce = Annonce::find($id);
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        $annonce->update($request->all());
        return response()->json($annonce);
    }

    // Supprimer une annonce
    public function destroy($id)
    {
        $annonce = Annonce::find($id);
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        $annonce->delete();
        return response()->json(['message' => 'Annonce supprimée']);
    }

}
