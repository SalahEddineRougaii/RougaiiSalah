<?php

// database/migrations/2025_05_16_000000_create_biens_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBiensTable extends Migration
{
    public function up()
    {
        Schema::create('biens', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('ville');
            $table->string('type'); // achat, location, etc.
            $table->integer('prix');
            $table->text('description')->nullable();
            $table->string('photos')->nullable(); // JSON ou string liste photos
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('biens');
    }
}
