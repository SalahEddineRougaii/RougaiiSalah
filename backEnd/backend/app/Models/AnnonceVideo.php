<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnonceVideo extends Model
{
    use HasFactory;

    protected $fillable = ['annonce_id', 'video_path'];

    public function annonce()
    {
        return $this->belongsTo(Annonce::class);
    }
}