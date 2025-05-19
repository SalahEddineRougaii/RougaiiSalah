<?php


namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BienFactory extends Factory
{
    public function definition()
    {
        return [
            'titre' => $this->faker->sentence(3),
            'ville' => $this->faker->city,
            'type' => $this->faker->randomElement(['achat', 'location']),
            'prix' => $this->faker->numberBetween(5000, 5000000),
            'description' => $this->faker->paragraph,
            'photos' => json_encode([
                $this->faker->imageUrl(),
                $this->faker->imageUrl()
            ]),
        ];
    }
}