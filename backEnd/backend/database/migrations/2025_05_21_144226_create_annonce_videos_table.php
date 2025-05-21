<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnonceVideosTable extends Migration
{
    public function up()
    {
        Schema::create('annonce_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annonce_id')->constrained('annonces')->onDelete('cascade');
            $table->string('video_path');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('annonce_videos');
    }
}