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
    Users,
    Globe,
    Menu,
    X,
    ChevronRight,
    BarChart3,
    ChevronUp,
    Send,
    Loader2,
    PlusCircle,
    ListChecks,
    LineChart,
    Wallet,
    User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkedAlt, FaGithubAlt } from 'react-icons/fa';
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

type FAQ = {
    question: string;
    answer: string;
};

type LandingProps = {
    features: Feature[];
    testimonials: Testimonial[];
    stats: Stats;
    faqs?: FAQ[];
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
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { role?: string } };
    };
    const activeSection = useActiveSection();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const dashboardRoute =
        auth?.user?.role === 'admin' ? adminDashboard() : dashboard();

    const navLinks = [
        { href: '#home', id: 'home', label: 'Beranda' },
        { href: '#how-it-works', id: 'how-it-works', label: 'Cara Kerja' },
        { href: '#features', id: 'features', label: 'Fitur' },
        { href: '#testimonials', id: 'testimonials', label: 'Testimoni' },
        { href: '#faq', id: 'faq', label: 'FAQ' },
        { href: '#contact', id: 'contact', label: 'Kontak' },
    ];

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
                    <Link href="#home" className="flex items-center gap-2">
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
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative rounded-full px-2.5 py-1 text-[11px] transition-colors ${
                                    activeSection === link.id
                                        ? 'text-zinc-900 after:absolute after:right-2.5 after:bottom-0.5 after:left-2.5 after:h-[1.5px] after:origin-left after:scale-x-100 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300 dark:text-white dark:after:bg-white'
                                        : 'text-zinc-500 after:absolute after:right-2.5 after:bottom-0.5 after:left-2.5 after:h-[1.5px] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300 dark:text-zinc-400 dark:hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-2.5 md:flex">
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
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                        className="rounded-full p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        {isOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </button>
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
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                                        activeSection === link.id
                                            ? 'bg-zinc-50 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                            : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                                    }`}
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                                {auth?.user ? (
                                    <Link
                                        href={dashboardRoute}
                                        className="rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-xl px-4 py-2 text-center text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
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
            className="relative flex min-h-screen items-center overflow-hidden bg-white dark:bg-zinc-950"
        >
            <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-5 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className="max-w-xl"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
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
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                            alt="FinanceLux Dashboard"
                            className="w-full rounded-lg object-contain"
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
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
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
                                className="relative rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
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

        return () => {
            observer.disconnect();
        };
    }, [stats]);

    const statsData = [
        { label: 'Pengguna Aktif', value: counts.users, icon: Users },
        {
            label: 'Transaksi Tercatat',
            value: counts.transactions,
            icon: BarChart3,
        },
        { label: 'Dompet Dibuat', value: counts.wallets, icon: Wallet },
        { label: 'Negara', value: counts.countries, icon: Globe },
    ];

    return (
        <section
            id="stats"
            ref={ref}
            className="bg-zinc-900 py-20 dark:bg-zinc-950"
        >
            <div className="mx-auto max-w-6xl px-5">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statsData.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 15,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
                            >
                                <Icon
                                    className="mx-auto mb-2 h-4 w-4 text-zinc-500"
                                    strokeWidth={2}
                                />
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    {item.value.toLocaleString('id-ID')}+
                                </p>
                                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                                    {item.label}
                                </p>
                            </motion.div>
                        );
                    })}
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
    const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

    return (
        <section
            id="features"
            ref={ref}
            className="bg-white py-24 dark:bg-zinc-950"
        >
            <div className="mx-auto max-w-6xl px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        Fitur
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Semua yang Anda butuhkan, tidak lebih tidak kurang
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Dibangun untuk kebutuhan pencatatan keuangan pribadi
                        sehari-hari.
                    </p>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = iconMap[feature.icon] || Wallet;

                        return (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    filter: 'blur(5px)',
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    filter: 'blur(0px)',
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                }}
                                viewport={{ once: true }}
                                style={{ y }}
                                className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                            >
                                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    return (
        <section
            id="testimonials"
            className="bg-zinc-50 py-24 dark:bg-zinc-900"
        >
            <div className="mx-auto max-w-6xl px-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        Testimoni
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Apa kata pengguna
                    </h2>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className="h-3 w-3 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQ[] = [
        {
            question: 'Apa itu Finance Lux?',
            answer: 'Finance Lux adalah aplikasi pencatatan keuangan pribadi. Anda bisa membuat beberapa dompet, mencatat transaksi, dan mengelompokkannya jadi kategori — semuanya diperbarui otomatis tanpa perlu hitung manual.',
        },
        {
            question: 'Apakah Finance Lux gratis dipakai?',
            answer: 'Ya, semua fitur inti (dompet, kategori, transaksi, dan ringkasan) gratis dipakai tanpa batas waktu.',
        },
        {
            question: 'Bagaimana cara mulai pakai Finance Lux?',
            answer: 'Buat akun, tambahkan dompet pertama Anda, lalu mulai catat transaksi. Saldo dan ringkasan akan otomatis terupdate setiap kali ada transaksi baru.',
        },
        {
            question: 'Apakah data keuangan saya aman?',
            answer: 'Data disimpan terenkripsi dan hanya bisa diakses lewat akun Anda sendiri. Kami tidak pernah membagikan data transaksi ke pihak ketiga.',
        },
        {
            question: 'Bisa diakses dari HP?',
            answer: 'Bisa. Tampilan Finance Lux menyesuaikan otomatis di HP, tablet, maupun desktop — tanpa perlu install aplikasi terpisah.',
        },
    ];

    return (
        <section id="faq" className="bg-white py-24 dark:bg-zinc-950">
            <div className="mx-auto max-w-3xl px-5">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        FAQ
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                        Pertanyaan yang sering diajukan
                    </h2>
                </motion.div>

                <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index}>
                                <button
                                    onClick={() => {
                                        setOpenIndex(isOpen ? null : index);
                                    }}
                                    className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                                >
                                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
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
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-4 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
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
                        className="col-span-3 space-y-4"
                    >
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });
                                }}
                                placeholder="Nama kamu"
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                }}
                                placeholder="nama@email.com"
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Pesan
                            </label>
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
                                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                            />
                            {errors.message && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" strokeWidth={2} />
                            )}
                            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                        </button>
                    </motion.form>

                    <div className="col-span-2 space-y-4">
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
                                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                        <Icon
                                            className="h-4 w-4"
                                            strokeWidth={2}
                                        />
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
        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col items-center px-8 py-8 sm:flex-row">
                <Link
                    href="#home"
                    className="text-xl leading-none font-black text-zinc-900 select-none dark:text-white"
                >
                    <span className="flex items-center gap-2">
                        <img
                            src="/images/flx.png"
                            alt="FinanceLux"
                            className="h-6 w-6 rounded-md object-contain"
                        />
                        Finance<span className="text-indigo-600">Lux.</span>
                    </span>
                </Link>
                <p className="mt-4 text-sm text-zinc-500 sm:mt-0 sm:ml-4 sm:border-l sm:border-zinc-200 sm:pl-4 dark:text-zinc-400 dark:sm:border-zinc-700">
                    &copy; {new Date().getFullYear()} Finance Lux - All rights
                    reserved.
                </p>
                <span className="mt-4 inline-flex justify-center space-x-5 sm:mt-0 sm:ml-auto sm:justify-start">
                    <a
                        href="https://github.com/Radiedtya/finance-lux"
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
}: LandingProps) {
    useFlashToast();

    return (
        <>
            <Head title="Kelola Uang Tanpa Drama" />
            <Navbar />
            <Hero />
            <HowItWorks />
            <StatsSection stats={stats} />
            <Features features={features} />
            <Testimonials testimonials={testimonials} />
            <FAQSection />
            <ContactSection />
            <Footer />
            <ScrollToTop />
        </>
    );
}
