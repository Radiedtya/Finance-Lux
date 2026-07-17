import { Head, usePage } from '@inertiajs/react';
import { animate, stagger } from 'animejs';
import { motion } from 'framer-motion';
import {
    WalletMinimal,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Tags,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// import { FaMoneyBillWave } from "react-icons/fa";
import { GrTransaction } from 'react-icons/gr';
import Swal from 'sweetalert2';
import { SidebarInset } from '@/components/ui/sidebar';
import { formatRupiah, formatDate } from '@/lib/finance';
import { dashboard } from '@/routes';

type WalletType = {
    id: number;
    name: string;
    balance: number;
};

type CategoryType = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
};

type TransactionType = {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string | null;
    date: string;
    wallet: WalletType;
    category: CategoryType;
};

type ChartData = {
    category: string;
    color: string;
    total: number;
};

type DailyData = {
    date: string;
    income: number;
    expense: number;
};

type MonthlySummary = {
    month: string;
    income: number;
    expense: number;
};

type DashboardProps = {
    stats: {
        total_wallets: number;
        total_balance: number;
        total_categories: number;
        total_transactions: number;
    };
    recent_transactions: TransactionType[];
    charts: {
        expense_by_category: ChartData[];
        daily: DailyData[];
        monthly_summary: MonthlySummary[];
        top_expense_categories: ChartData[];
    };
    current_month: string;
    flash?: { success?: string; error?: string };
};

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    delay,
    isCount,
}: {
    icon: any;
    label: string;
    value: number | string;
    color?: string;
    delay?: number;
    isCount?: boolean;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (cardRef.current && typeof value === 'number' && isCount) {
            // Animate card entrance
            animate(cardRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                delay: delay || 0,
                easing: 'easeOutCubic',
            });

            // Animate number counter
            const start = 0;
            const end = value;
            const duration = 1000;
            const startTime = performance.now();

            const animateNumber = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 2);
                const current = start + (end - start) * eased;
                setDisplayValue(Math.round(current));

                if (progress < 1) {
                    requestAnimationFrame(animateNumber);
                }
            };

            // Start animation after delay
            setTimeout(() => {
                requestAnimationFrame(animateNumber);
            }, delay || 0);
        } else if (cardRef.current) {
            // For non-count values (like total_balance)
            animate(cardRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                delay: delay || 0,
                easing: 'easeOutCubic',
            });
            setDisplayValue(typeof value === 'number' ? value : 0);
        }
    }, [value, delay, isCount]);

    const colorClasses = {
        blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
        emerald:
            'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
        purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
        amber: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
        rose: 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30',
        indigo: 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30',
    };

    const iconColors = {
        blue: 'text-blue-600 dark:text-blue-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        purple: 'text-purple-600 dark:text-purple-400',
        amber: 'text-amber-600 dark:text-amber-400',
        rose: 'text-rose-600 dark:text-rose-400',
        indigo: 'text-indigo-600 dark:text-indigo-400',
    };

    const textColors = {
        blue: 'text-blue-700 dark:text-blue-300',
        emerald: 'text-emerald-700 dark:text-emerald-300',
        purple: 'text-purple-700 dark:text-purple-300',
        amber: 'text-amber-700 dark:text-amber-300',
        rose: 'text-rose-700 dark:text-rose-300',
        indigo: 'text-indigo-700 dark:text-indigo-300',
    };

    const selectedColor = color || 'blue';

    return (
        <div
            ref={cardRef}
            className={`border p-5 ${colorClasses[selectedColor as keyof typeof colorClasses]}`}
            style={{ opacity: 0 }}
        >
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                    {label}
                </p>
                <Icon
                    className={`h-4 w-4 ${iconColors[selectedColor as keyof typeof iconColors]}`}
                    strokeWidth={1.5}
                />
            </div>
            <p
                className={`mt-2 text-2xl font-light tabular-nums ${textColors[selectedColor as keyof typeof textColors]}`}
            >
                {isCount ? displayValue : formatRupiah(displayValue)}
            </p>
        </div>
    );
}

function AnimatedBarChart({ data }: { data: ChartData[] }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const maxValue = Math.max(...data.map((d) => d.total), 1);

    useEffect(() => {
        if (chartRef.current) {
            const bars = chartRef.current.querySelectorAll('.bar-item');
            animate(bars, {
                width: ['0%', '100%'],
                duration: 800,
                delay: stagger(100),
                easing: 'easeOutQuad',
            });
        }
    }, [data]);

    return (
        <div ref={chartRef} className="space-y-3">
            {data.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className="min-w-[80px] truncate text-xs text-zinc-600 dark:text-zinc-400">
                        {item.category}
                    </div>
                    <div className="relative h-6 flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <div
                            className="bar-item h-full rounded-r-sm"
                            style={{
                                backgroundColor: item.color || '#10b981',
                                width: '0%',
                            }}
                            data-width={`${(item.total / maxValue) * 100}%`}
                        />
                    </div>
                    <div className="min-w-[70px] text-right font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {formatRupiah(item.total)}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AnimatedLineChart({ data }: { data: DailyData[] }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * 100,
        income: (d.income / maxValue) * 80,
        expense: (d.expense / maxValue) * 80,
        date: d.date,
    }));

    useEffect(() => {
        if (svgRef.current) {
            const lines = svgRef.current.querySelectorAll('.chart-line');

            lines.forEach((line) => {
                const length =
                    (line as SVGGeometryElement).getTotalLength?.() || 1000;
                animate(line, {
                    strokeDashoffset: [length, 0],
                    duration: 1000,
                    delay: 200,
                    easing: 'easeOutCubic',
                });
            });
        }
    }, []);

    return (
        <div className="relative h-48">
            <svg
                ref={svgRef}
                className="h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="#e4e4e7"
                    strokeWidth="0.3"
                />
                <line
                    x1="0"
                    y1="50"
                    x2="100"
                    y2="50"
                    stroke="#e4e4e7"
                    strokeWidth="0.3"
                />
                <line
                    x1="0"
                    y1="80"
                    x2="100"
                    y2="80"
                    stroke="#e4e4e7"
                    strokeWidth="0.3"
                />

                <polyline
                    className="chart-line"
                    points={points
                        .map((p) => `${p.x},${100 - p.income}`)
                        .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                />

                <polyline
                    className="chart-line"
                    points={points
                        .map((p) => `${p.x},${100 - p.expense}`)
                        .join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                />

                {points.map((p, i) => (
                    <circle
                        key={`income-${i}`}
                        cx={p.x}
                        cy={100 - p.income}
                        r="1.5"
                        fill="#10b981"
                    />
                ))}

                {points.map((p, i) => (
                    <circle
                        key={`expense-${i}`}
                        cx={p.x}
                        cy={100 - p.expense}
                        r="1.5"
                        fill="#ef4444"
                    />
                ))}
            </svg>

            <div className="mt-1 flex justify-between">
                {data.map((d, i) => (
                    <span key={i} className="text-[8px] text-zinc-400">
                        {new Date(d.date).toLocaleDateString('id-ID', {
                            weekday: 'short',
                        })}
                    </span>
                ))}
            </div>

            <div className="mt-2 flex justify-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-4 bg-emerald-500" />
                    <span className="text-[10px] text-zinc-500">Pemasukan</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-4 bg-red-500" />
                    <span className="text-[10px] text-zinc-500">
                        Pengeluaran
                    </span>
                </div>
            </div>
        </div>
    );
}

function RecentTransactionItem({
    transaction,
    index,
}: {
    transaction: TransactionType;
    index: number;
}) {
    const isIncome = transaction.type === 'income';
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (itemRef.current) {
            animate(itemRef.current, {
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 400,
                delay: index * 100,
                easing: 'easeOutCubic',
            });
        }
    }, [index]);

    return (
        <div
            ref={itemRef}
            className="flex items-center justify-between gap-3 border-b border-zinc-100 p-3 last:border-0 dark:border-zinc-800"
            style={{ opacity: 0 }}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 items-center justify-center ${
                        isIncome
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
                            : 'bg-red-50 text-red-600 dark:bg-red-950'
                    }`}
                >
                    {isIncome ? (
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                        <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {transaction.description || transaction.category.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span
                            className="h-1.5 w-1.5"
                            style={{
                                backgroundColor: transaction.category.color,
                            }}
                        />
                        {transaction.category.name}
                        <span className="text-zinc-300 dark:text-zinc-600">
                            ·
                        </span>
                        {transaction.wallet.name}
                        <span className="text-zinc-300 dark:text-zinc-600">
                            ·
                        </span>
                        {formatDate(transaction.date)}
                    </div>
                </div>
            </div>
            <p
                className={`text-sm font-medium tabular-nums ${
                    isIncome ? 'text-emerald-600' : 'text-red-600'
                }`}
            >
                {isIncome ? '+' : '-'}
                {formatRupiah(transaction.amount)}
            </p>
        </div>
    );
}

function TypingHeader() {
    const fullText = 'Ringkasan dan statistik keuangan kamu secara real-time.';
    const [displayText, setDisplayText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);

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
        }, 30);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.p
            className="text-sm font-light tracking-wide text-zinc-500 dark:text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {displayText}
            {!isTypingComplete && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-0.5 inline-block h-4 w-px bg-zinc-400 dark:bg-zinc-500"
                />
            )}
        </motion.p>
    );
}

export default function UserDashboard() {
    const { stats, recent_transactions, charts, current_month, flash } =
        usePage().props as unknown as DashboardProps;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: flash.success,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2500,
                customClass: {
                    popup: 'dark:bg-zinc-900 dark:text-zinc-100',
                },
            });
        }

        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: flash.error,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    popup: 'dark:bg-zinc-900 dark:text-zinc-100',
                },
            });
        }
    }, [flash]);

    const sparkleRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (sparkleRef.current) {
            animate(sparkleRef.current, {
                scale: [0, 1.2, 1],
                rotate: [0, 360],
                duration: 800,
                easing: 'easeOutCubic',
            });
        }
    }, []);

    return (
        <>
            <Head title="Dashboard" />
            <SidebarInset>
                <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto bg-white px-8 py-10 dark:bg-zinc-950">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
                                Hallo, Selamat Datang!
                            </h1>
                            <div ref={sparkleRef} className="text-amber-500">
                                <Sparkles
                                    className="h-5 w-5"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>
                        <TypingHeader />
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            Periode: {current_month}
                        </p>
                    </motion.div>

                    {/* Stats Cards - Only Total Wallets, Categories, Transactions, and Balance */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            icon={WalletMinimal}
                            label="Total Dompet"
                            value={stats.total_wallets}
                            color="blue"
                            delay={0}
                            isCount={true}
                        />
                        <StatCard
                            icon={Tags}
                            label="Total Kategori"
                            value={stats.total_categories}
                            color="purple"
                            delay={100}
                            isCount={true}
                        />
                        <StatCard
                            icon={GrTransaction}
                            label="Total Transaksi"
                            value={stats.total_transactions}
                            color="amber"
                            delay={200}
                            isCount={true}
                        />
                        {/* <StatCard
                            icon={FaMoneyBillWave}
                            label="Total Saldo"
                            value={stats.total_balance}
                            color="emerald"
                            delay={300}
                            isCount={false}
                        /> */}
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {charts.expense_by_category.length > 0 && (
                            <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                                <h3 className="mb-4 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                    Pengeluaran per Kategori
                                </h3>
                                <AnimatedBarChart
                                    data={charts.expense_by_category}
                                />
                            </div>
                        )}

                        {charts.top_expense_categories.length > 0 && (
                            <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                                <h3 className="mb-4 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                    Top 5 Pengeluaran
                                </h3>
                                <AnimatedBarChart
                                    data={charts.top_expense_categories}
                                />
                            </div>
                        )}
                    </div>

                    {/* Daily Trend */}
                    <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                Tren 7 Hari Terakhir
                            </h3>
                            <Calendar
                                className="h-4 w-4 text-zinc-400"
                                strokeWidth={1.5}
                            />
                        </div>
                        <AnimatedLineChart data={charts.daily} />
                    </div>

                    {/* Monthly Summary */}
                    {charts.monthly_summary.length > 0 && (
                        <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-4 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                Ringkasan 6 Bulan Terakhir
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {charts.monthly_summary.map((item, index) => (
                                    <div
                                        key={item.month}
                                        className="border border-zinc-100 p-3 dark:border-zinc-800"
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                        }}
                                    >
                                        <p className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
                                            {item.month}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-emerald-600">
                                                    +
                                                </span>
                                                <span className="font-mono">
                                                    {formatRupiah(item.income)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-red-600">
                                                    -
                                                </span>
                                                <span className="font-mono">
                                                    {formatRupiah(item.expense)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-zinc-500">
                                                    Selisih
                                                </span>
                                                <span
                                                    className={`font-mono ${
                                                        item.income -
                                                            item.expense >=
                                                        0
                                                            ? 'text-emerald-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {formatRupiah(
                                                        item.income -
                                                            item.expense,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Transactions */}
                    <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-4 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                            Transaksi Terbaru
                        </h3>
                        {recent_transactions.length === 0 ? (
                            <p className="text-sm font-light text-zinc-400">
                                Belum ada transaksi.
                            </p>
                        ) : (
                            <div>
                                {recent_transactions.map(
                                    (transaction, index) => (
                                        <RecentTransactionItem
                                            key={transaction.id}
                                            transaction={transaction}
                                            index={index}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [
        {
            title: 'User | Dashboard',
            href: dashboard(),
        },
    ],
};
