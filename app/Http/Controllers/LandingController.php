<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('landing', [
            'features' => [
                [
                    'icon' => 'wallet',
                    'title' => 'Multi Wallet Management',
                    'description' => 'Kelola berbagai dompet dengan mudah dan pantau saldo secara real-time.',
                ],
                [
                    'icon' => 'chart',
                    'title' => 'Financial Analytics',
                    'description' => 'Visualisasikan pemasukan dan pengeluaran dengan grafik interaktif yang informatif.',
                ],
                [
                    'icon' => 'category',
                    'title' => 'Smart Categorization',
                    'description' => 'Atur transaksi berdasarkan kategori untuk memudahkan pelacakan keuangan.',
                ],
                [
                    'icon' => 'secure',
                    'title' => 'Bank-Grade Security',
                    'description' => 'Data keuangan Anda dilindungi dengan enkripsi dan sistem keamanan terbaik.',
                ],
                [
                    'icon' => 'report',
                    'title' => 'Monthly Reports',
                    'description' => 'Dapatkan ringkasan keuangan bulanan untuk membantu perencanaan keuangan.',
                ],
                [
                    'icon' => 'mobile',
                    'title' => 'Fully Responsive',
                    'description' => 'Akses di mana saja dengan tampilan yang optimal di semua perangkat.',
                ],
            ],
            'testimonials' => [
                [
                    'name' => 'Andi Pratama',
                    'role' => 'Entrepreneur',
                    'avatar' => 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0D9488&color=fff&size=64',
                    'quote' => 'Finance Lux transformed how I manage my business finances. The analytics and reporting features are exceptional.',
                ],
                [
                    'name' => 'Siti Rahayu',
                    'role' => 'Freelance Designer',
                    'avatar' => 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=2563EB&color=fff&size=64',
                    'quote' => 'Finally, a financial tool that actually understands freelancers. The categorization and tracking are game-changers.',
                ],
                [
                    'name' => 'Budi Santoso',
                    'role' => 'Financial Analyst',
                    'avatar' => 'https://ui-avatars.com/api/?name=Budi+Santoso&background=7C3AED&color=fff&size=64',
                    'quote' => 'As someone who works with numbers daily, Finance Lux provides the clarity and precision I need for personal finance.',
                ],
            ],
            'stats' => [
                'users' => 15000,
                'transactions' => 250000,
                'wallets' => 45000,
                'countries' => 10,
            ],
        ]);
    }
}