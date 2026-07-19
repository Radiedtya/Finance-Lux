import { Head, router, usePage } from '@inertiajs/react';
import Chart from 'chart.js/auto';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    MessageSquare,
    CalendarDays,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { SidebarInset } from '@/components/ui/sidebar';
import { adminMessages } from '@/routes';

type ContactMessageItem = {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
};

type PaginatedResponse = {
    data: ContactMessageItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type MessagesPageProps = {
    messages: PaginatedResponse;
    stats: {
        total: number;
        this_month: number;
        today: number;
    };
    chart: {
        labels: string[];
        data: number[];
    };
    flash?: {
        success?: string;
    };
};

const FULL_TITLE = 'Pesan Masuk';

function formatDate(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

const rowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
        opacity: 1,
        transition: { delay: i * 0.04, duration: 0.3 },
    }),
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function MessagesIndex() {
    const { messages, flash, stats, chart } = usePage().props as unknown as MessagesPageProps;

    const [pendingId, setPendingId] = useState<number | null>(null);
    const [displayedTitle, setDisplayedTitle] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        let index = 0;
        let cursorTimeout: ReturnType<typeof setTimeout>;
        const typeInterval = setInterval(() => {
            if (index <= FULL_TITLE.length) {
                setDisplayedTitle(FULL_TITLE.slice(0, index));
                index++;
            } else {
                clearInterval(typeInterval);
                cursorTimeout = setTimeout(() => setShowCursor(false), 1000);
            }
        }, 70);

        return () => {
            clearInterval(typeInterval);
            clearTimeout(cursorTimeout);
        };
    }, []);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        if (!ctx) {
            return;
        }

        const isDark = document.documentElement.classList.contains('dark');
        const lineColor = isDark ? '#a1a1aa' : '#71717a';
        const bgColor = isDark ? 'rgba(161, 161, 170, 0.1)' : 'rgba(113, 113, 122, 0.1)';

        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chart.labels,
                datasets: [
                    {
                        label: 'Pesan Masuk',
                        data: chart.data,
                        borderColor: lineColor,
                        backgroundColor: bgColor,
                        borderWidth: 2,
                        pointBackgroundColor: lineColor,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => `${tooltipItem.formattedValue} pesan`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: isDark ? '#a1a1aa' : '#4b5563' },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: isDark ? '#27272a' : '#e5e7eb' },
                        ticks: {
                            color: isDark ? '#a1a1aa' : '#4b5563',
                            stepSize: 1,
                        },
                    },
                },
            },
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [chart]);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#18181b',
                color: '#d4d4d8',
                iconColor: '#71717a',
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
        }
    }, [flash?.success]);

    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const total = messages.last_page;
        const current = messages.current_page;

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (current > 3) {
                pages.push('…');
            }

            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                pages.push(i);
            }

            if (current < total - 2) {
                pages.push('…');
            }

            pages.push(total);
        }

        return pages;
    }, [messages.current_page, messages.last_page]);

    const goToPage = (page: number) => {
        if (page === messages.current_page) {
            return;
        }

        router.get(adminMessages(), { page }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (message: ContactMessageItem) => {
        Swal.fire({
            title: 'Hapus Pesan?',
            text: `Pesan dari "${message.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            background: '#18181b',
            color: '#d4d4d8',
        }).then((result) => {
            if (result.isConfirmed) {
                setPendingId(message.id);

                router.delete(`/admin/messages/${message.id}`, {
                    preserveScroll: true,
                    only: ['messages', 'stats', 'flash'],
                    onError: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: 'Gagal menghapus pesan',
                            showConfirmButton: false,
                            timer: 3000,
                            background: '#18181b',
                            color: '#d4d4d8',
                        });
                    },
                    onFinish: () => setPendingId(null),
                });
            }
        });
    };

    return (
        <SidebarInset>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <Head title="Pesan Masuk" />

                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {displayedTitle}
                        <span
                            className={`ml-0.5 inline-block w-0.5 translate-y-0.75 bg-zinc-400 transition-opacity duration-300 ${
                                showCursor ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ height: '1em' }}
                        />
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400"
                    >
                        Kelola pesan yang masuk dari pengunjung website.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Tren pesan per bulan
                        </h2>
                        <div className="mt-4 h-64">
                            <canvas
                                ref={chartRef}
                                role="img"
                                aria-label="Line chart menampilkan tren pesan masuk"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Pesan</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Bulan Ini</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.this_month}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Hari Ini</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.today}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <h2 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {messages.total} pesan
                    </h2>

                    <div className="min-w-0 overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-zinc-200 dark:divide-zinc-700">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="*:font-medium *:text-zinc-900 dark:*:text-zinc-100">
                                    <th className="px-3 py-2 whitespace-nowrap">Pengirim</th>
                                    <th className="px-3 py-2 whitespace-nowrap">Pesan</th>
                                    <th className="px-3 py-2 whitespace-nowrap">Tanggal</th>
                                    <th className="px-3 py-2 text-right whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                <AnimatePresence mode="popLayout">
                                    {messages.data.length === 0 ? (
                                        <motion.tr
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <td colSpan={4} className="px-3 py-6 text-center text-sm text-zinc-500">
                                                Belum ada pesan masuk.
                                            </td>
                                        </motion.tr>
                                    ) : (
                                        messages.data.map((msg, i) => (
                                            <motion.tr
                                                key={msg.id}
                                                custom={i}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className="*:text-zinc-700 *:first:font-medium dark:*:text-zinc-300 dark:*:first:text-zinc-100"
                                            >
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm text-zinc-900 dark:text-zinc-100">{msg.name}</p>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{msg.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-sm max-w-xs truncate">
                                                    {msg.message}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                    {formatDate(msg.created_at)}
                                                </td>
                                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        disabled={pendingId === msg.id}
                                                        onClick={() => handleDelete(msg)}
                                                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 dark:border-zinc-700 dark:text-red-400 dark:hover:border-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                                    >
                                                        {pendingId === msg.id ? (
                                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-red-300 border-t-red-600" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {messages.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                            <p className="text-xs text-zinc-500">
                                Halaman {messages.current_page} dari {messages.last_page}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={messages.current_page <= 1}
                                    onClick={() => goToPage(messages.current_page - 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600 disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:text-zinc-400 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:text-zinc-300 dark:disabled:hover:border-zinc-700 dark:disabled:hover:text-zinc-500"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </button>
                                {pageNumbers.map((page, idx) =>
                                    typeof page === 'string' ? (
                                        <span
                                            key={`dots-${idx}`}
                                            className="flex h-7 w-7 items-center justify-center text-[11px] text-zinc-400"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => goToPage(page)}
                                            className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-medium transition-colors ${
                                                page === messages.current_page
                                                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                                                    : 'border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}
                                <button
                                    type="button"
                                    disabled={messages.current_page >= messages.last_page}
                                    onClick={() => goToPage(messages.current_page + 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600 disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:text-zinc-400 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:text-zinc-300 dark:disabled:hover:border-zinc-700 dark:disabled:hover:text-zinc-500"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </SidebarInset>
    );
}

MessagesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin | Pesan Masuk',
            href: adminMessages(),
        },
    ],
};