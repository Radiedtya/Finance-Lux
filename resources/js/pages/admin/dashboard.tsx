import { Head, usePage } from '@inertiajs/react';
import {
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { SidebarInset } from '@/components/ui/sidebar';

type MonthlyDataPoint = {
    name: string;
    Pemasukan: number;
    Pengeluaran: number;
};

type DonutDataPoint = {
    name: string;
    value: number;
    color: string;
};

type DashboardStats = {
    totalUsers: number;
    usersGrowth: number;
    totalWallets: number;
    walletsGrowth: number;
    transactionVolume: number;
    volumeGrowth: number;
};

type DashboardPageProps = {
    stats: DashboardStats;
    monthlyData: MonthlyDataPoint[];
    donutData: DonutDataPoint[];
};

function GrowthBadge({ value }: { value: number }) {
    const isPositive = value >= 0;

    return (
        <span
            className={`flex items-center text-xs font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
        >
            {isPositive ? (
                <ArrowUpRight className="mr-0.5 h-3 w-3" />
            ) : (
                <ArrowDownRight className="mr-0.5 h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {value}%
        </span>
    );
}

function useAnimatedCounter(
    end: number,
    duration: number = 1500,
    start: number = 0,
) {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = null;
        countRef.current = start;

        const step = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const progress = Math.min(
                (timestamp - startTimeRef.current) / duration,
                1,
            );

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            countRef.current = Math.floor(
                easedProgress * (end - start) + start,
            );
            setCount(countRef.current);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        const animationFrame = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, start]);

    return count;
}

export default function AdminDashboard() {
    const { auth, stats, monthlyData, donutData } = usePage()
        .props as unknown as DashboardPageProps & { auth: any };

    const [typedText, setTypedText] = useState('');
    const fullText = `Selamat Datang Kembali, ${auth.user?.name || 'Admin'}!`;

    const animatedUsers = useAnimatedCounter(stats.totalUsers, 2000);
    const animatedWallets = useAnimatedCounter(stats.totalWallets, 2000);
    const animatedVolume = useAnimatedCounter(
        stats.transactionVolume / 1_000_000,
        2000,
    );

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i <= fullText.length) {
                setTypedText(fullText.substring(0, i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [fullText]);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('id-ID').format(num);

    return (
        <SidebarInset>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-zinc-50/50 p-6 dark:bg-zinc-950">
                <Head title="Admin Dashboard" />

                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                        {typedText}
                        <span className="ml-1 animate-pulse text-zinc-400 dark:text-zinc-600">
                            |
                        </span>
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Berikut adalah ringkasan performa ekosistem aplikasi
                        Finance Lux hari ini.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-zinc-500">
                                Total Pengguna
                            </span>
                            <Users className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold tabular-nums">
                                {formatNumber(animatedUsers)}
                            </span>
                            <GrowthBadge value={stats.usersGrowth} />
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                            Daftar user aktif bulan ini
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-zinc-500">
                                Dompet Terbuat
                            </span>
                            <Wallet className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold tabular-nums">
                                {formatNumber(animatedWallets)}
                            </span>
                            <GrowthBadge value={stats.walletsGrowth} />
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                            Dompet/Rekening terhubung
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-zinc-500">
                                Volume Transaksi
                            </span>
                            <Activity className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold tabular-nums">
                                Rp {animatedVolume.toFixed(1)}M
                            </span>
                            <GrowthBadge value={stats.volumeGrowth} />
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                            Perputaran uang 7 hari terakhir
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-zinc-500">
                                Hak Akses Sistem
                            </span>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold">Active</span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                            Mode Super Administrator
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex flex-col space-y-1.5 pb-4">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Tren Arus Kas Aplikasi
                            </h2>
                            <p className="flex items-center text-xs text-zinc-400">
                                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                                Grafik perbandingan pemasukan dan pengeluaran
                                user
                            </p>
                        </div>
                        <div className="h-[300px] min-w-0 w-full">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                debounce={150}
                            >
                                <BarChart
                                    data={monthlyData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-zinc-100 dark:stroke-zinc-800"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={12}
                                        stroke="#888888"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        fontSize={12}
                                        stroke="#888888"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) =>
                                            `Rp${v / 1000000}M`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value: any) => [
                                            `Rp ${Number(value).toLocaleString('id-ID')}`,
                                        ]}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid #e4e4e7',
                                        }}
                                    />
                                    <Bar
                                        dataKey="Pemasukan"
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        isAnimationActive={false}
                                    />
                                    <Bar
                                        dataKey="Pengeluaran"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                        isAnimationActive={false}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex flex-col space-y-1.5 pb-4">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Alokasi Pengeluaran Terbanyak
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Distribusi kategori transaksi seluruh user
                            </p>
                        </div>
                        <div className="flex h-[300px] min-w-0 w-full flex-col items-center justify-center">
                            {donutData.length === 0 ? (
                                <p className="text-sm text-zinc-400">
                                    Belum ada data transaksi pengeluaran
                                </p>
                            ) : (
                            <ResponsiveContainer
                                width="100%"
                                height="80%"
                                debounce={150}
                            >
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        isAnimationActive={false}
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => [
                                            `Rp ${Number(value).toLocaleString('id-ID')}`,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            )}
                            <div className="mt-2 grid w-full grid-cols-2 gap-2 px-4 text-xs">
                                {donutData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        <div
                                            className="h-3 w-3 flex-shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <span className="truncate text-zinc-600 dark:text-zinc-400">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}