<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAnnoncesRestantesAndAPayeToUsersTable extends Migration{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('annonces_restantes')->default(0);
            $table->boolean('a_paye')->default(false);
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['annonces_restantes', 'a_paye']);
        });
    }
}