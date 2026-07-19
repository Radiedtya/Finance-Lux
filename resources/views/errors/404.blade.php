<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>404 - Tidak Ditemukan | {{ config('app.name', 'Laravel') }}</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <script>
            (function() {
                const saved = localStorage.getItem('theme');
                const cookieTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
                const val = cookieTheme ? cookieTheme.split('=')[1] : saved;
                
                if (val === 'dark' || (!val && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
                background-color: #fafafa;
                color: #18181b;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            html.dark body {
                background-color: #09090b;
                color: #fafafa;
            }
            
            .error-wrapper {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            @media (min-width: 1024px) {
                .error-wrapper { flex-direction: row; }
            }
            .content-side {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 3rem 1.5rem;
                background-color: #ffffff;
            }
            html.dark .content-side {
                background-color: #09090b;
            }
            @media (min-width: 1024px) {
                .content-side { padding: 6rem 5rem; }
            }
            .image-side {
                flex: 1;
                position: relative;
                display: none;
            }
            @media (min-width: 1024px) {
                .image-side { display: block; }
            }
            .image-side img {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .image-overlay {
                position: absolute;
                inset: 0;
                background-color: rgba(24, 24, 27, 0.2);
                mix-blend-mode: multiply;
            }
            
            .label {
                font-size: 1rem;
                font-weight: 600;
                line-height: 2;
                color: #000000;
            }
            html.dark .label { color: #ffffff; }
            
            .title {
                margin-top: 1rem;
                font-size: 2.25rem;
                font-weight: 800;
                line-height: 1.1;
                letter-spacing: -0.025em;
                color: #18181b;
            }
            html.dark .title { color: #ffffff; }
            @media (min-width: 640px) {
                .title { font-size: 3rem; }
            }
            
            .desc {
                margin-top: 1.5rem;
                font-size: 1rem;
                line-height: 1.75;
                color: #52525b;
            }
            html.dark .desc { color: #a1a1aa; }
            
            .btn {
                display: inline-flex;
                align-items: center;
                margin-top: 2.5rem;
                border-radius: 0.5rem;
                background-color: #18181b;
                padding: 0.75rem 1.5rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: #ffffff;
                text-decoration: none;
                transition: background-color 150ms;
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }
            html.dark .btn {
                background-color: #ffffff;
                color: #09090b;
            }
            .btn:hover {
                background-color: #27272a;
            }
            html.dark .btn:hover {
                background-color: #e4e4e7;
            }
        </style>
    </head>
    <body>
        <section class="error-wrapper">
            <div class="content-side">
                <div style="max-width: 36rem;">
                    <p class="label">404 Error</p>
                    <h1 class="title">Halaman ini tidak ditemukan</h1>
                    <p class="desc">
                        Kami sudah mencari ke mana-mana, tetapi tidak bisa menemukan halaman yang Anda maksud. Mari kembali ke tempat yang lebih baik.
                    </p>
                    <a href="{{ route('home') }}" class="btn">Kembali ke Beranda</a>
                </div>
            </div>
            <div class="image-side">
                <img src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80" alt="Lost in the forest">
                <div class="image-overlay"></div>
            </div>
        </section>
    </body>
</html>