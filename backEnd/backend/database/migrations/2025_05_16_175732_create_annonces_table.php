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
            $table->string('image')->nullable();
            $table->string('statut')->default('vente');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('annonces');
    }
}

