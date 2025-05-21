<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    use HasFactory;

protected $fillable = [
    'user_id',
    'titre',
    'description',
    'prix',
    'ville',
    'adresse',
    'type_bien',
    'nombre_pieces',
    'surface',              // Ajoute ceci
    'annee_construction',   // Ajoute ceci
    'disponibilite',        // Ajoute ceci
    'latitude',             // Ajoute ceci
    'longitude',            // Ajoute ceci
    'statut',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
{
    return $this->hasMany(AnnonceImage::class);
}

public function videos()
{
    return $this->hasMany(AnnonceVideo::class);
}
}