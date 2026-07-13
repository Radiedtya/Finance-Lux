<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['income', 'expense']);
        $names = $type === 'income' ? ['Gaji Bulanan', 'Freelance', 'Investasi'] : ['Makanan', 'Transportasi', 'Tagihan Listrik'];

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement($names),
            'type' => $type,
            'color' => fake()->hexColor(),
        ];
    }
}
