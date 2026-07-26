<?php

namespace Database\Seeders;

// use App\Models\Category;
// use App\Models\Transaction;
use App\Models\User;
// use App\Models\Wallet;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@flx.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
        ]);

        // 2. Buat Akun User Biasa untuk Testing Fitur Finansial
        $user = User::factory()->create([
            'name' => 'Ryn',
            'email' => 'ryn@flx.com',
            'role' => 'user',
            'password' => Hash::make('password'),
        ]);

        $user = User::factory()->create([
            'name' => 'Radiedtya',
            'email' => 'rad@flx.com',
            'role' => 'user',
            'password' => Hash::make('password'),
        ]);

        // 3. Buat 3 Dompet/Rekening khusus untuk user di atas
        // $wallets = Wallet::factory()->count(3)->create([
        //     'user_id' => $user->id,
        // ]);

        // // 4. Buat 6 Kategori keuangan khusus untuk user di atas
        // $categories = Category::factory()->count(6)->create([
        //     'user_id' => $user->id,
        // ]);

        // // 5. Buat 15 Transaksi acak yang menghubungkan Wallet dan Category milik user tersebut
        // for ($i = 0; $i < 15; $i++) {
        //     $randomWallet = $wallets->random();
        //     $randomCategory = $categories->random();

        //     Transaction::factory()->create([
        //         'user_id' => $user->id,
        //         'wallet_id' => $randomWallet->id,
        //         'category_id' => $randomCategory->id,
        //         // Samakan jenis transaksi dengan jenis kategorinya agar logis
        //         'type' => $randomCategory->type, 
        //     ]);
        // }

        // // 6. Opsional: Buat 5 user tambahan lainnya buat meramaikan list data user di dashboard Admin
        // User::factory()->count(5)->create([
        //     'role' => 'user',
        // ]);
    }
}