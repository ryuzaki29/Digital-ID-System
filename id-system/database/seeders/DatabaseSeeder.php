<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create main admin user
        User::firstOrCreate(
            ['email' => 'joabina@up.edu.ph'],
            [
                'name' => 'Joabina',
                'password' => '12345678',
                'email_verified_at' => now(),
            ]
        );

        // Create test user
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => '12345678',
                'email_verified_at' => now(),
            ]
        );
    }
}
