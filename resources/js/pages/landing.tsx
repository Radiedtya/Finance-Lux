import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
import {
    TrendingUp,
    Tag,
    Shield,
    FileText,
    Smartphone,
    ArrowRight,
    Star,
    Menu,
    X,
    ChevronRight,
    ChevronUp,
    Send,
    Loader2,
    PlusCircle,
    ListChecks,
    LineChart,
    Wallet,
    User,
    Mail,
    Moon,
    Sun,
    Search,
    Info,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    FaMapMarkedAlt,
    FaGithubAlt,
    FaQuestion,
    FaWallet,
    FaChartLine,
    FaListOl,
    FaShieldAlt,
    FaMobileAlt,
    FaFileAlt,
} from 'react-icons/fa';
import { PiWhatsappLogoDuotone } from 'react-icons/pi';
import { SiGmail } from 'react-icons/si';
import Swal from 'sweetalert2';
import { login, dashboard, adminDashboard } from '@/routes';

type Feature = {
    icon: string;
    title: string;
    description: string;
};

type Testimonial = {
    name: string;
    role: string;
    avatar: string;
    quote: string;
};

type Stats = {
    users: number;
    transactions: number;
    wallets: number;
    countries: number;
};

type CalloutType = 'info' | 'success' | 'warning' | 'danger';

type FAQCallout = {
    type: CalloutType;
    title: string;
    text: string;
};

type FAQ = {
    question: string;
    answer: string;
    keywords?: string;
    icon: string;
    iconColor: string;
    callout?: FAQCallout;
};

type LandingProps = {
    features: Feature[];
    testimonials: Testimonial[];
    stats: Stats;
    faqs: FAQ[];
};

type FlashProps = {
    flash?: { success?: string };
};

const iconMap: Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
    wallet: Wallet,
    chart: TrendingUp,
    category: Tag,
    secure: Shield,
    report: FileText,
    mobile: Smartphone,
};

const sectionIds = [
    'home',
    'how-it-works',
    'stats',
    'features',
    'testimonials',
    'faq',
    'contact',
];

function useActiveSection() {
    const [active, setActive] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);

            if (el) {
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return active;
}

function useFlashToast() {
    const { flash } = usePage().props as unknown as FlashProps;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: flash.success,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    }, [flash]);

    return flash;
}

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="fixed right-5 bottom-5 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 shadow-lg transition-colors hover:text-white dark:bg-white dark:text-zinc-600 dark:hover:text-zinc-900"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-4 w-4" strokeWidth={2} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        return (
            saved === 'dark' ||
            (!saved && prefersDark) ||
            (!saved && document.documentElement.classList.contains('dark'))
        );
    });
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { role?: string } };
    };
    const activeSection = useActiveSection();

    // --- Theme Toggle ---
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        document.cookie = `theme=${next ? 'dark' : 'light'};path=/;max-age=${365 * 24 * 60 * 60}`;
    };
    // --------------------

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dashboardRoute =
        auth?.user?.role === 'admin' ? adminDashboard() : dashboard();

    const navLinks = [
        { id: 'home', label: 'Beranda' },
        { id: 'how-it-works', label: 'Cara Kerja' },
        { id: 'features', label: 'Fitur' },
        { id: 'testimonials', label: 'Testimoni' },
        { id: 'faq', label: 'FAQ' },
        { id: 'contact', label: 'Kontak' },
    ];

    // Fungsi baru untuk scroll tanpa mengubah URL
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        e.preventDefault(); // Cegah URL berubah jadi #id
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false); // Tutup menu mobile jika terbuka
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 right-0 left-0 z-50"
        >
            <div className="mx-auto mt-3 max-w-4xl px-4">
                <div
                    className={`flex h-10 items-center justify-between rounded-full border px-4 transition-all duration-200 ${
                        isScrolled
                            ? 'border-zinc-200/80 bg-white/90 shadow-lg backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/90'
                            : 'border-zinc-200/60 bg-white/70 backdrop-blur-sm dark:border-zinc-700/40 dark:bg-zinc-900/70'
                    }`}
                >
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/flx.png"
                            alt="FinanceLux"
                            className="h-7 w-7 rounded-full object-contain"
                        />
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                            Finance Lux
                        </span>
                    </Link>

                    <div className="hidden items-center gap-0.5 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href="#" // Wajib ada href agar tetap dianggap link (aksesibilitas), tapi di-prevent di JS
                                onClick={(e) => handleNavClick(e, link.id)}
                                className={`relative rounded-full px-2.5 py-1 text-[11px] transition-colors ${
                                    activeSection === link.id
                                        ? 'text-zinc-900 after:absolute after:right-2.5 after:bottom-0.5 after:left-2.5 after:h-[1.5px] after:origin-left after:scale-x-100 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300 dark:text-white dark:after:bg-white'
                                        : 'text-zinc-500 after:absolute after:right-2.5 after:bottom-0.5 after:left-2.5 after:h-[1.5px] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300 dark:text-zinc-400 dark:hover:text-white'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden items-center gap-2.5 md:flex">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                            aria-label="Toggle theme"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isDark ? (
                                    <motion.span
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex"
                                    >
                                        <Sun
                                            className="h-3.5 w-3.5"
                                            strokeWidth={2}
                                        />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="moon"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex"
                                    >
                                        <Moon
                                            className="h-3.5 w-3.5"
                                            strokeWidth={2}
                                        />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        <span className="mr-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                        {auth?.user ? (
                            <Link
                                href={dashboardRoute}
                                className="rounded-full bg-zinc-900 px-3.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="flex items-center gap-1.5 text-[11px] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    <User className="h-3 w-3" strokeWidth={2} />
                                    Masuk
                                </Link>
                                <Link
                                    href={login()}
                                    className="rounded-full bg-zinc-900 px-3.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                                >
                                    Daftar Gratis
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 md:hidden">
                        {/* Theme Toggle Mobile */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" strokeWidth={2} />
                            ) : (
                                <Moon className="h-4 w-4" strokeWidth={2} />
                            )}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-full p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                            {isOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mx-auto max-w-4xl overflow-hidden px-4 md:hidden"
                    >
                        <div className="mt-2 space-y-1 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                            {navLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href="#"
                                    onClick={(e) => handleNavClick(e, link.id)}
                                    className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                                        activeSection === link.id
                                            ? 'bg-zinc-50 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                            : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                                {auth?.user ? (
                                    <Link
                                        href={dashboardRoute}
                                        className="rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-xl px-4 py-2 text-center text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Coba Gratis
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

function Hero() {
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const fullText =
        'Catat transaksi, atur dompet, dan lihat ke mana uang Anda benar-benar pergi.';
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayText(fullText.slice(0, index));
                index++;
            } else {
                setIsTypingComplete(true);
                clearInterval(timer);
            }
        }, 25);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950"
        >
            <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-5 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className="max-w-xl"
                >
                    <div className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-1.5 py-1.5 text-xs font-extrabold text-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[0.1em_0.1em_0px_0px_rgba(255,255,255,0.15)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Dipakai 15.000+ orang di Indonesia
                    </div>

                    <h1 className="text-4xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
                        Kelola uang Anda tanpa drama spreadsheet
                    </h1>

                    <div className="mt-5 min-h-12">
                        <p className="text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400">
                            {displayText}
                            {!isTypingComplete && (
                                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-zinc-400" />
                            )}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                        <Link
                            href={login()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                            Buat Akun Gratis
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                        >
                            Lihat Cara Kerjanya
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="mt-10 flex items-center gap-2"
                    >
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                />
                            ))}
                        </div>
                        <span className="text-xs text-zinc-400">
                            4.9 dari 2.500+ ulasan
                        </span>
                    </motion.div>

                    <div className="mt-12 lg:hidden">
                        <motion.img
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                            src="https://merakiui.com/images/components/Catalogue-pana.svg"
                            alt="FinanceLux Dashboard"
                            className="w-full object-contain"
                        />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
                        >
                            Visualisasi keuangan yang mudah dipahami siapa saja
                        </motion.p>
                    </div>
                </motion.div>
            </div>

            <div className="absolute top-0 right-0 hidden h-full w-1/2 bg-linear-to-l from-zinc-50 via-zinc-50/80 to-transparent px-8 lg:flex lg:flex-col lg:items-center lg:justify-center dark:from-zinc-900 dark:via-zinc-900/60 dark:to-transparent">
                <motion.img
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    src="https://merakiui.com/images/components/Catalogue-pana.svg"
                    alt="FinanceLux Dashboard"
                    className="w-full max-w-lg rounded-lg object-contain"
                />
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Visualisasi keuangan yang
                    </p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        mudah dipahami siapa saja
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: PlusCircle,
            title: 'Buat dompet',
            description:
                'Tambahkan dompet untuk setiap rekening, e-wallet, atau uang tunai yang Anda pakai sehari-hari.',
        },
        {
            number: '02',
            icon: ListChecks,
            title: 'Catat transaksi',
            description:
                'Setiap pemasukan dan pengeluaran dicatat dengan kategori, jadi Anda tahu uang habis ke mana.',
        },
        {
            number: '03',
            icon: LineChart,
            title: 'Lihat pola keuangan',
            description:
                'Saldo dan ringkasan pengeluaran terupdate otomatis setiap kali ada transaksi baru.',
        },
    ];

    return (
        <section
            id="how-it-works"
            className="bg-zinc-50 py-24 dark:bg-zinc-900"
        >
            <div className="mx-auto max-w-6xl px-5">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        Cara Kerja
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Tiga langkah, uang Anda langsung tercatat
                    </h2>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                    ease: 'easeOut',
                                }}
                                viewport={{ once: true }}
                                className="relative border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <span className="absolute top-5 right-5 text-3xl font-light text-zinc-100 dark:text-zinc-800">
                                    {step.number}
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function StatsSection({ stats }: { stats: Stats }) {
    const [counts, setCounts] = useState({
        users: 0,
        transactions: 0,
        wallets: 0,
        countries: 0,
    });
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    function formatNumber(num: number): string {
        if (num >= 1_000_000) {
            const val = num / 1_000_000;

            return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'M';
        }

        if (num >= 1_000) {
            const val = num / 1_000;

            return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'K';
        }

        return num.toString();
    }

    useEffect(() => {
        function animate() {
            const duration = 1800;
            const steps = 60;
            const interval = duration / steps;

            (Object.keys(stats) as (keyof Stats)[]).forEach((key) => {
                const target = stats[key];
                let current = 0;
                const increment = target / steps;

                const timer = setInterval(() => {
                    current += increment;

                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }

                    setCounts((prev) => ({
                        ...prev,
                        [key]: Math.round(current),
                    }));
                }, interval);
            });
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animate();
                }
            },
            { threshold: 0.3 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [stats]);

    const statsData = [
        { label: 'Pengguna Aktif', value: counts.users },
        { label: 'Transaksi Tercatat', value: counts.transactions },
        { label: 'Dompet Dibuat', value: counts.wallets },
        { label: 'Negara', value: counts.countries },
    ];

    return (
        <section
            id="stats"
            ref={ref}
            className="bg-white py-20 dark:bg-zinc-950"
        >
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-2xl text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
                        Pertumbuhan Kami dalam Angka
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Kami bangga dengan angka-angka ini. Mereka berbicara
                        tentang komitmen kami terhadap kualitas dan komunitas.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {statsData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                            }}
                            viewport={{ once: true }}
                            className={`text-center lg:border-r lg:border-zinc-200 last:lg:border-r-0 dark:lg:border-zinc-800`}
                        >
                            <div className="mb-2 text-4xl font-bold text-black dark:text-white">
                                {formatNumber(item.value)}+
                            </div>
                            <div className="text-sm font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                {item.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Features({ features }: { features: Feature[] }) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

    const iconColorMap: Record<string, string> = {
        wallet: 'text-teal-500',
        chart: 'text-blue-500',
        category: 'text-purple-500',
        secure: 'text-green-500',
        report: 'text-amber-500',
        mobile: 'text-rose-500',
    };

    return (
        <section
            id="features"
            ref={ref}
            className="bg-white py-24 dark:bg-zinc-950"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
                <div className="-mx-4 flex flex-wrap items-center lg:-mx-6">
                    {/* Text Side */}
                    <div className="order-1 w-full px-4 lg:order-0 lg:w-1/2 lg:px-6">
                        <div className="w-full lg:max-w-md">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="mb-4 text-3xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
                            >
                                Semua yang Anda butuhkan untuk kelola keuangan!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="mb-6 text-sm font-medium text-zinc-400 dark:text-zinc-500"
                            >
                                Dibangun untuk kebutuhan pencatatan keuangan
                                pribadi sehari-hari. Fitur-fitur kami mencakup:
                            </motion.p>
                            <ul>
                                {features.map((feature, index) => {
                                    const Icon =
                                        iconMap[feature.icon] || Wallet;
                                    const colorClass =
                                        iconColorMap[feature.icon] ||
                                        'text-zinc-500';

                                    return (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                delay: 0.15 + index * 0.07,
                                            }}
                                            viewport={{ once: true }}
                                            className="flex items-start gap-4 py-2.5 xl:py-3"
                                        >
                                            <div
                                                className={`mt-0.5 shrink-0 ${colorClass}`}
                                            >
                                                <Icon
                                                    className="h-7 w-7"
                                                    strokeWidth={1.8}
                                                />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                                    {feature.title}
                                                </span>
                                                <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="order-0 mb-12 w-full px-4 lg:order-1 lg:mb-0 lg:w-1/2 lg:px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            style={{ y }}
                            className="mx-auto sm:max-w-sm lg:max-w-full"
                        >
                            <img
                                src="https://cdn.devdojo.com/images/november2020/feature-graphic.png"
                                alt="Finance Lux Features"
                                className="w-full rounded-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    return (
        <section
            id="testimonials"
            className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-20 dark:bg-zinc-900"
        >
            <div className="mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-12 sm:mb-16"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        Testimoni
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Apa kata pengguna
                    </h2>
                </motion.div>

                <div className="space-y-10 sm:space-y-14">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.12,
                                ease: 'easeOut',
                            }}
                            viewport={{ once: true }}
                            className="relative pl-8 sm:pl-12"
                        >
                            <div className="absolute top-0 left-0 text-4xl text-zinc-200 select-none sm:text-5xl dark:text-zinc-700">
                                &ldquo;
                            </div>
                            <blockquote className="mb-3 text-lg leading-relaxed text-zinc-800 sm:mb-4 sm:text-xl dark:text-zinc-200">
                                {testimonial.quote}
                            </blockquote>
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 sm:text-base dark:text-white">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection({ faqs }: { faqs: FAQ[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const calloutStyles: Record<CalloutType, string> = {
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300',
        success:
            'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300',
        warning:
            'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300',
        danger: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300',
    };

    const calloutIcons: Record<CalloutType, React.ElementType> = {
        info: Info,
        success: CheckCircle,
        warning: AlertTriangle,
        danger: AlertCircle,
    };

    const faqIconMap: Record<string, React.ElementType> = {
        wallet: FaWallet,
        chart: FaChartLine,
        listchecks: FaListOl,
        secure: FaShieldAlt,
        mobile: FaMobileAlt,
        report: FaFileAlt,
        default: FaQuestion, 
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (faq.keywords &&
                faq.keywords.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    return (
        <section id="faq" className="bg-white py-24 dark:bg-zinc-950">
            <div className="mx-auto max-w-5xl px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        FAQ
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Pertanyaan yang sering diajukan
                    </h2>
                </motion.div>

                <div className="relative mb-10">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-zinc-200 bg-white py-3 pr-4 pl-12 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                    />
                </div>

                {filteredFaqs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
                        {filteredFaqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            const Icon = faqIconMap[faq.icon] || faqIconMap.default;
                            const CalloutIcon = faq.callout
                                ? calloutIcons[faq.callout.type]
                                : null;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.05,
                                    }}
                                    viewport={{ once: true }}
                                    className={`overflow-hidden border border-dashed border-zinc-300 bg-white transition-shadow dark:border-zinc-700 dark:bg-zinc-900 ${
                                        isOpen ? 'shadow-lg' : ''
                                    }`}
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : index)
                                        }
                                        className="flex w-full items-center gap-3 bg-zinc-50 p-5 text-left transition-colors hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                                    >
                                        <Icon
                                            className={`h-5 w-5 shrink-0 ${faq.iconColor}`}
                                            strokeWidth={2}
                                        />
                                        <span className="flex-1 text-sm font-semibold text-zinc-900 dark:text-white">
                                            {faq.question}
                                        </span>
                                        <ChevronRight
                                            className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                                                isOpen ? 'rotate-90' : ''
                                            }`}
                                            strokeWidth={2}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 pt-3">
                                                    <p className="mb-4 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                                        {faq.answer}
                                                    </p>

                                                    {faq.callout &&
                                                        CalloutIcon && (
                                                            <div
                                                                className={`flex items-start gap-3 border p-4 ${calloutStyles[faq.callout.type]}`}
                                                            >
                                                                <CalloutIcon
                                                                    className="mt-0.5 h-5 w-5 shrink-0"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                />
                                                                <div>
                                                                    <strong className="mb-1 block text-sm">
                                                                        {
                                                                            faq
                                                                                .callout
                                                                                .title
                                                                        }
                                                                    </strong>
                                                                    <span className="text-xs opacity-90">
                                                                        {
                                                                            faq
                                                                                .callout
                                                                                .text
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-10 text-center text-sm text-zinc-500">
                        Tidak ada pertanyaan yang cocok dengan pencarian "
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {searchQuery}
                        </span>
                        "
                    </div>
                )}
            </div>
        </section>
    );
}

function ContactSection() {
    const { flash } = usePage().props as unknown as FlashProps;
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            const t = setTimeout(() => {
                setForm({ name: '', email: '', message: '' });
            }, 0);

            return () => {
                clearTimeout(t);
            };
        }
    }, [flash]);

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            nextErrors.name = 'Nama wajib diisi';
        }

        if (!form.email.trim()) {
            nextErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = 'Format email tidak valid';
        }

        if (!form.message.trim()) {
            nextErrors.message = 'Pesan wajib diisi';
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        router.post('/contact', form, {
            preserveScroll: true,
            onError: (serverErrors) => {
                setErrors(serverErrors as Record<string, string>);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal mengirim pesan',
                    text: 'Periksa kembali data yang kamu isi.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            },

            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const contactInfo = [
        { icon: SiGmail, label: 'Email', value: 'financelux@gmail.com' },
        {
            icon: PiWhatsappLogoDuotone,
            label: 'WhatsApp',
            value: '+62 882 2215 0964',
        },
        {
            icon: FaMapMarkedAlt,
            label: 'Lokasi',
            value: 'Bandung, Jawa Barat, Indonesia',
        },
    ];

    return (
        <section id="contact" className="bg-zinc-50 py-24 dark:bg-zinc-900">
            <div className="mx-auto max-w-6xl px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        Kontak
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Ada pertanyaan? Tulis ke kami
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Biasanya kami balas dalam 1 hari kerja.
                    </p>
                </motion.div>

                <div className="grid gap-10 lg:grid-cols-5">
                    <motion.form
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="col-span-3 space-y-1.5"
                    >
                        <div className="w-full">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Nama
                            </label>
                            <div className="relative">
                                <User
                                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                                    strokeWidth={1.5}
                                />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        });
                                    }}
                                    placeholder="Nama kamu"
                                    className="w-full rounded-none! border border-zinc-300 bg-white py-2.5 pl-10 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Email
                            </label>
                            <div className="relative">
                                <SiGmail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        });
                                    }}
                                    placeholder="nama@email.com"
                                    className="w-full rounded-none! border border-zinc-300 bg-white py-2.5 pl-10 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Pesan
                            </label>
                            <div className="relative">
                                <Mail
                                    className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-zinc-400"
                                    strokeWidth={1.5}
                                />
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            message: e.target.value,
                                        });
                                    }}
                                    placeholder="Ceritakan pertanyaan atau masukan kamu..."
                                    className="w-full resize-none rounded-none! border border-zinc-300 bg-white py-2.5 pr-3 pl-10 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                                />
                            </div>
                            {errors.message && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-none! bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" strokeWidth={2} />
                            )}
                            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                        </button>
                    </motion.form>

                    <div className="col-span-2 flex flex-col gap-4 pt-5">
                        {contactInfo.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: 'easeOut',
                                    }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 rounded-xs border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                            {item.value}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
                <Link
                    href="/"
                    className="text-xl leading-none font-black text-zinc-900 select-none dark:text-white"
                >
                    <span className="flex items-center gap-2">
                        <img
                            src="/images/flx.png"
                            alt="FinanceLux"
                            className="h-8 w-8 rounded-full object-contain"
                        />
                        Finance<span className="text-indigo-600">Lux</span>
                    </span>
                </Link>
                <p className="text-xs text-zinc-400">
                    &copy; {new Date().getFullYear()} FinanceLux All rights
                    reserved.
                </p>
                <span className="mt-4 inline-flex justify-center space-x-5 sm:mt-0 sm:ml-auto sm:justify-start">
                    <a
                        href="#"
                        className="text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                        <span className="sr-only">GitHub</span>
                        <FaGithubAlt className="h-5 w-5" />
                    </a>
                </span>
            </div>
        </footer>
    );
}

export default function Landing({
    features,
    testimonials,
    stats,
    faqs,
}: LandingProps) {
    useFlashToast();

    return (
        <div>
            <Head title="Kelola Uang Tanpa Drama" />
            <Navbar />
            <Hero />
            <StatsSection stats={stats} />
            <HowItWorks />
            <Features features={features} />
            <Testimonials testimonials={testimonials} />
            <FAQSection faqs={faqs} />
            <ContactSection />
            <Footer />
            <ScrollToTop />
        </div>
    );
}
