<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bien;

class BiensTableSeeder extends Seeder
{
    public function run()
    {
        Bien::factory()->count(50)->create();
    }
}