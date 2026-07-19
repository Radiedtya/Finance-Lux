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
            'faqs' => [
                [
                    'question' => 'Apa itu Finance Lux?',
                    'answer' => 'Finance Lux adalah aplikasi pencatatan keuangan pribadi. Anda bisa membuat beberapa dompet, mencatat transaksi, dan mengelompokkannya jadi kategori — semuanya diperbarui otomatis tanpa perlu hitung manual.',
                    'keywords' => 'finance lux aplikasi keuangan pencatatan dompet',
                    'icon' => 'faquestion',
                    'iconColor' => 'text-blue-500',
                    'callout' => [
                        'type' => 'info',
                        'title' => 'Tahukah Kamu?',
                        'text' => 'Kata "lux" berasal dari bahasa Latin yang berarti cahaya, melambangkan visi kami untuk menerangi pengelolaan keuangan Anda.',
                    ],
                ],
                [
                    'question' => 'Apakah Finance Lux gratis dipakai?',
                    'answer' => 'Ya, semua fitur inti seperti dompet, kategori, transaksi, dan ringkasan bulanan sepenuhnya gratis dipakai tanpa batas waktu dan tanpa iklan.',
                    'keywords' => 'gratis biaya harga berbayar premium',
                    'icon' => 'chart',
                    'iconColor' => 'text-emerald-500',
                    'callout' => [
                        'type' => 'success',
                        'title' => 'Janji Kami:',
                        'text' => 'Kami tidak akan pernah membebankan biaya tersembunyi. Fitur inti akan tetap gratis selamanya.',
                    ],
                ],
                [
                    'question' => 'Bagaimana cara mulai pakai Finance Lux?',
                    'answer' => 'Buat akun, tambahkan dompet pertama Anda, lalu mulai catat transaksi. Saldo dan ringkasan akan otomatis terupdate setiap kali ada transaksi baru.',
                    'keywords' => 'mulai cara daftar akun baru pemula',
                    'icon' => 'listchecks',
                    'iconColor' => 'text-purple-500',
                    'callout' => [
                        'type' => 'warning',
                        'title' => 'Tips:',
                        'text' => 'Agar lebih terorganisir, buatlah kategori pengeluaran terlebih dahulu sebelum mulai mencatat transaksi.',
                    ],
                ],
                [
                    'question' => 'Apakah data keuangan saya aman?',
                    'answer' => 'Data disimpan terenkripsi dan hanya bisa diakses lewat akun Anda sendiri. Kami tidak pernah membagikan data transaksi ke pihak ketiga.',
                    'keywords' => 'aman keamanan enkripsi privasi data bocor',
                    'icon' => 'secure',
                    'iconColor' => 'text-red-500',
                    'callout' => [
                        'type' => 'danger',
                        'title' => 'Penting:',
                        'text' => 'Jangan pernah membagikan password Anda kepada siapa pun, termasuk tim Finance Lux.',
                    ],
                ],
                [
                    'question' => 'Bisa diakses dari HP?',
                    'answer' => 'Bisa. Tampilan Finance Lux menyesuaikan otomatis di HP, tablet, maupun desktop — tanpa perlu install aplikasi terpisah di App Store atau Play Store.',
                    'keywords' => 'hp mobile android ios smartphone tablet akses',
                    'icon' => 'mobile',
                    'iconColor' => 'text-amber-500',
                    'callout' => [
                        'type' => 'info',
                        'title' => 'Pro Tip:',
                        'text' => 'Anda bisa menambahkan shortcut website Finance Lux di layar utama HP Anda agar terasa seperti aplikasi native.',
                    ],
                ],
                [
                    'question' => 'Apakah saya bisa mengexport data keuangan saya?',
                    'answer' => 'Ya, Anda bisa mengunduh laporan transaksi bulanan dalam format CSV langsung dari dashboard untuk keperluan analisis lebih lanjut.',
                    'keywords' => 'export download csv laporan data cetak',
                    'icon' => 'report',
                    'iconColor' => 'text-indigo-500',
                    'callout' => [
                        'type' => 'success',
                        'title' => 'Info:',
                        'text' => 'Fitur export memudahkan Anda yang ingin melakukan audit manual atau mencatatnya kembali di aplikasi spreadsheet pribadi.',
                    ],
                ],
            ],
        ]);
    }
}