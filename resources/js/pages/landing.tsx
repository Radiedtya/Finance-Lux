import { Head, Link, usePage } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
import {
    Wallet,
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
    Sparkles,
    ChevronRight,
    BarChart3,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

type LandingProps = {
    features: Feature[];
    testimonials: Testimonial[];
    stats: Stats;
};

const iconMap: Record<string, any> = {
    wallet: Wallet,
    chart: TrendingUp,
    category: Tag,
    secure: Shield,
    report: FileText,
    mobile: Smartphone,
};

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage().props as any;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dashboardRoute =
        auth?.user?.role === 'admin' ? adminDashboard() : dashboard();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-4 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:bg-zinc-900/80'
                    : 'bg-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md dark:bg-zinc-900/60'
            } rounded-full border border-white/30 dark:border-zinc-800/30`}
        >
            <div className="flex h-12 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 p-1.5 shadow-sm">
                        <Wallet
                            className="h-4 w-4 text-white"
                            strokeWidth={1.5}
                        />
                    </div>
                    <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-white">
                        Finance{' '}
                        <span className="text-emerald-600 dark:text-emerald-400">
                            Lux
                        </span>
                    </span>
                </div>

                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        href="#features"
                        className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Features
                    </Link>
                    <Link
                        href="#testimonials"
                        className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Testimonials
                    </Link>
                    <Link
                        href="#stats"
                        className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Stats
                    </Link>

                    |
                    
                    {auth?.user ? (
                        <Link
                            href={dashboardRoute}
                            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            <Sparkles className="h-3 w-3" />
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                Get Started
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                    {isOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl md:hidden dark:bg-zinc-900/95"
                    >
                        <div className="space-y-1 px-4 py-4">
                            <Link
                                href="#features"
                                className="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                onClick={() => setIsOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#testimonials"
                                className="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                onClick={() => setIsOpen(false)}
                            >
                                Testimonials
                            </Link>
                            <Link
                                href="#stats"
                                className="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                onClick={() => setIsOpen(false)}
                            >
                                Stats
                            </Link>
                            <div className="mt-4 flex flex-col gap-2 px-4">
                                {auth?.user ? (
                                    <Link
                                        href={dashboardRoute}
                                        className="rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-full px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Get Started
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
    const fullText = 'Smart financial management for modern lifestyles.';
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
        }, 40);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/3 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-1.5 text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                        <Zap className="h-3 w-3" />
                        <span>#1 Financial Management Platform</span>
                    </motion.div>

                    <h1 className="mb-6 text-4xl leading-[1.1] font-light tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                        Take control of your{' '}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                financial future
                            </span>
                            <motion.span
                                className="absolute right-0 -bottom-2 left-0 h-0.5 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            />
                        </span>
                    </h1>

                    <div className="mx-auto max-w-2xl">
                        <p className="min-h-[2rem] text-base text-zinc-500 sm:text-lg dark:text-zinc-400">
                            {displayText}
                            {!isTypingComplete && (
                                <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-emerald-500" />
                            )}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    >
                        <Link
                            href={login()}
                            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            Start Free Trial
                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                strokeWidth={1.5}
                            />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                        >
                            Explore Features
                            <ChevronRight
                                className="h-4 w-4"
                                strokeWidth={1.5}
                            />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12 flex flex-wrap items-center justify-center gap-6"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[
                                    'emerald-400',
                                    'blue-400',
                                    'purple-400',
                                    'amber-400',
                                ].map((color, i) => (
                                    <div
                                        key={i}
                                        className={`h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-${color} to-${color.replace('400', '600')} dark:border-zinc-800`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    15,000+
                                </span>{' '}
                                users
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                4.9/5 ·{' '}
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    2,500+
                                </span>{' '}
                                reviews
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
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

    return (
        <section
            id="features"
            ref={ref}
            className="relative bg-zinc-50/50 py-20 dark:bg-zinc-900/30"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="text-xs font-medium tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
                        Features
                    </span>
                    <h2 className="mt-2 text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                        Everything you need to{' '}
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            succeed
                        </span>
                    </h2>
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                        Powerful tools designed to give you complete control
                        over your finances
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = iconMap[feature.icon] || Wallet;

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
                                style={{ y: y }}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                            >
                                <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 p-2.5 text-emerald-600 dark:from-emerald-950/30 dark:to-blue-950/30 dark:text-emerald-400">
                                    <Icon
                                        className="h-5 w-5"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
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
            className="relative bg-white py-20 dark:bg-zinc-950"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="text-xs font-medium tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
                        Testimonials
                    </span>
                    <h2 className="mt-2 text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                        What our{' '}
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            users say
                        </span>
                    </h2>
                </motion.div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-10 w-10 rounded-full"
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
                                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                "{testimonial.quote}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Stats({ stats }: { stats: Stats }) {
    const [counts, setCounts] = useState({
        users: 0,
        transactions: 0,
        wallets: 0,
        countries: 0,
    });

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        const animateValue = (key: keyof Stats, target: number) => {
            let current = 0;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;

                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                setCounts((prev) => ({ ...prev, [key]: Math.round(current) }));
            }, interval);
        };

        animateValue('users', stats.users);
        animateValue('transactions', stats.transactions);
        animateValue('wallets', stats.wallets);
        animateValue('countries', stats.countries);
    }, [stats]);

    const statsData = [
        { label: 'Active Users', value: counts.users, icon: Users },
        { label: 'Transactions', value: counts.transactions, icon: BarChart3 },
        { label: 'Wallets Created', value: counts.wallets, icon: Wallet },
        { label: 'Countries', value: counts.countries, icon: Globe },
    ];

    return (
        <section
            id="stats"
            className="relative bg-zinc-50/50 py-20 dark:bg-zinc-900/30"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="text-xs font-medium tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
                        Impact
                    </span>
                    <h2 className="mt-2 text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                        Trusted by thousands{' '}
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            worldwide
                        </span>
                    </h2>
                </motion.div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                }}
                                viewport={{ once: true }}
                                className="rounded-2xl border border-zinc-200/60 bg-white p-6 text-center dark:border-zinc-800/60 dark:bg-zinc-900/50"
                            >
                                <div className="mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 p-2.5 dark:from-emerald-950/30 dark:to-blue-950/30">
                                    <Icon
                                        className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <p className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white">
                                    {item.value.toLocaleString()}+
                                </p>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
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

function CTA() {
    return (
        <section className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600" />
            <div className="bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-10" />

            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
                        Ready to take{' '}
                        <span className="font-medium">control?</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
                        Join thousands of users who have transformed their
                        financial management. Start your free trial today.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href={login()}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:shadow-lg hover:shadow-white/20 dark:bg-zinc-100"
                        >
                            Start Free Trial
                            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                        <Link
                            href={login()}
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/10"
                        >
                            Log in
                        </Link>
                    </div>
                    <p className="mt-4 text-xs text-white/60">
                        No credit card required · Free for 30 days
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-zinc-900 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 p-1.5">
                                <Wallet
                                    className="h-4 w-4 text-white"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <span className="text-sm font-medium tracking-tight text-white">
                                Finance{' '}
                                <span className="text-emerald-400">Lux</span>
                            </span>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                            Smart financial management for modern lifestyles.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                            Product
                        </h4>
                        <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                            <li>
                                <Link
                                    href="#features"
                                    className="transition-colors hover:text-white"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#testimonials"
                                    className="transition-colors hover:text-white"
                                >
                                    Testimonials
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#stats"
                                    className="transition-colors hover:text-white"
                                >
                                    Stats
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                            Company
                        </h4>
                        <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                            Legal
                        </h4>
                        <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400">
                    © {new Date().getFullYear()} Finance Lux. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}

export default function Landing({
    features,
    testimonials,
    stats,
}: LandingProps) {
    return (
        <>
            <Head title="Finance Lux - Smart Financial Management" />
            <Navbar />
            <Hero />
            <Features features={features} />
            <Testimonials testimonials={testimonials} />
            <Stats stats={stats} />
            <CTA />
            <Footer />
        </>
    );
}
