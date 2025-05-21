<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\AnnonceImage;
use App\Models\AnnonceVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnnonceController extends Controller
{
    // Ajouter une annonce avec images et vidéos multiples
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric',
                'ville' => 'required|string|max:100',
                'adresse' => 'required|string|max:255',
                'type_bien' => 'required|string|max:100',
                'nombre_pieces' => 'nullable|integer',
                'surface' => 'nullable|numeric',
                'annee_construction' => 'nullable|integer',
                'disponibilite' => 'nullable|date',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'statut' => 'required|string',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
                'videos.*' => 'nullable|file|mimes:mp4,avi,mov|max:20480',
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
            $annonce->surface = $request->surface;
            $annonce->annee_construction = $request->annee_construction;
            $annonce->disponibilite = $request->disponibilite;
            $annonce->latitude = $request->latitude;
            $annonce->longitude = $request->longitude;
            $annonce->statut = $request->statut;
            $annonce->save();

            // Images multiples
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('annonces/images', 'public');
                    AnnonceImage::create([
                        'annonce_id' => $annonce->id,
                        'image_path' => $path,
                    ]);
                }
            }

            // Vidéos multiples
            if ($request->hasFile('videos')) {
                foreach ($request->file('videos') as $video) {
                    $path = $video->store('annonces/videos', 'public');
                    AnnonceVideo::create([
                        'annonce_id' => $annonce->id,
                        'video_path' => $path,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'annonce' => $annonce->load('images', 'videos')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
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

    // Récupérer les annonces du vendeur (par user_id) avec images et vidéos
    public function mesAnnonces(Request $request)
    {
        try {
            $userId = $request->query('user_id');
            if (!$userId) {
                return response()->json(['error' => 'user_id manquant'], 400);
            }
            $annonces = Annonce::with('images', 'videos')->where('user_id', $userId)->get();
            return response()->json($annonces);
        } catch (\Exception $e) {
            \Log::error('Erreur récupération annonces', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }

    // Lister toutes les annonces (admin) avec images et vidéos
    public function index()
    {
        return Annonce::with('user', 'images', 'videos')->get();
    }

    // Voir une annonce
    public function show($id)
    {
        $annonce = Annonce::with('user', 'images', 'videos')->find($id);
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        return response()->json($annonce);
    }

    // Modifier une annonce (sans gestion des fichiers ici)
public function update(Request $request, $id)
{
    $annonce = Annonce::find($id);
    if (!$annonce) {
        return response()->json(['message' => 'Annonce non trouvée'], 404);
    }

    // Mets à jour les champs de base
    $annonce->update($request->except(['images', 'videos']));

    // Si de nouvelles images sont envoyées, on supprime les anciennes et on ajoute les nouvelles
    if ($request->hasFile('images')) {
        $annonce->images()->delete();
        foreach ($request->file('images') as $image) {
            $path = $image->store('annonces/images', 'public');
            $annonce->images()->create(['image_path' => $path]);
        }
    }

    // Si de nouvelles vidéos sont envoyées, on supprime les anciennes et on ajoute les nouvelles
    if ($request->hasFile('videos')) {
        $annonce->videos()->delete();
        foreach ($request->file('videos') as $video) {
            $path = $video->store('annonces/videos', 'public');
            $annonce->videos()->create(['video_path' => $path]);
        }
    }

    return response()->json($annonce->load('images', 'videos'));
}

    // Supprimer une annonce (et ses images/vidéos)
    public function destroy($id)
    {
        $annonce = Annonce::find($id);
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        $annonce->images()->delete();
        $annonce->videos()->delete();
        $annonce->delete();
        return response()->json(['message' => 'Annonce supprimée']);
    }

    public function vendeurIndex(Request $request)
{
    $userId = $request->query('user_id');
    if (!$userId) {
        return response()->json(['error' => 'user_id manquant'], 400);
    }
    $annonces = Annonce::with('images', 'videos')->where('user_id', $userId)->get();
    return response()->json($annonces);
}

// Voir une annonce précise du vendeur
public function vendeurShow($id)
{
    $annonce = Annonce::with('images', 'videos')->find($id);
    if (!$annonce) {
        return response()->json(['message' => 'Annonce non trouvée'], 404);
    }
    return response()->json($annonce);
}

// Modifier une annonce du vendeur
public function vendeurUpdate(Request $request, $id)
{
    $annonce = Annonce::find($id);
    if (!$annonce) {
        return response()->json(['message' => 'Annonce non trouvée'], 404);
    }
    \Log::info('Reçu pour update', $request->all());
    $annonce->update($request->except(['images', 'videos']));

    if ($request->hasFile('images')) {
        $annonce->images()->delete();
        foreach ($request->file('images') as $image) {
            $path = $image->store('annonces/images', 'public');
            $annonce->images()->create(['image_path' => $path]);
        }
    }
    if ($request->hasFile('videos')) {
        $annonce->videos()->delete();
        foreach ($request->file('videos') as $video) {
            $path = $video->store('annonces/videos', 'public');
            $annonce->videos()->create(['video_path' => $path]);
        }
    }

    return response()->json($annonce->load('images', 'videos'));
}

// Supprimer une annonce du vendeur
public function vendeurDestroy($id)
{
    $annonce = Annonce::find($id);
    if (!$annonce) {
        return response()->json(['message' => 'Annonce non trouvée'], 404);
    }
    $annonce->images()->delete();
    $annonce->videos()->delete();
    $annonce->delete();
    return response()->json(['message' => 'Annonce supprimée']);
}
}