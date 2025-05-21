<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnoncesTable extends Migration
{
    public function up()
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->string('ville');
            $table->string('adresse');
            $table->string('type_bien');
            $table->integer('nombre_pieces')->nullable();
            $table->float('surface')->nullable();
            $table->year('annee_construction')->nullable();
            $table->date('disponibilite')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('statut')->default('vente');
            $table->enum('validation', ['en_attente', 'validee', 'refusee'])->default('en_attente');
            $table->unsignedInteger('vues')->default(0);
            $table->timestamps();
        });

        // Table pour les images multiples
    }

    public function down()
    {
        Schema::dropIfExists('annonce_videos');
        Schema::dropIfExists('annonce_images');
        Schema::dropIfExists('annonces');
    }
}