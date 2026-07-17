import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    Eye,
    EyeOff,
    Pencil,
    Plus,
    Receipt,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { SidebarInset } from '@/components/ui/sidebar';
import {
    formatDate,
    formatRupiah,
    swalInputClass,
    swalLabelClass,
    useAnimeCounter,
} from '@/lib/finance';
import { userTransactions } from '@/routes';

type Wallet = { id: number; name: string };
type Category = { id: number; name: string; type: 'income' | 'expense'; color: string };

type TransactionRow = {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string | null;
    date: string;
    wallet: Wallet;
    category: Category;
};

type TransactionsPageProps = {
    transactions: TransactionRow[];
    wallets: Wallet[];
    categories: Category[];
    flash?: { success?: string; error?: string };
};

function injectSwalStyle(accent: 'neutral' | 'danger' = 'neutral') {
    const style = document.createElement('style');
    const confirmBg = accent === 'danger' ? '#dc2626' : '#18181b';
    const confirmBgHover = accent === 'danger' ? '#b91c1c' : '#27272a';
    const confirmBgDark = accent === 'danger' ? '#ef4444' : '#f4f4f5';
    const confirmBgDarkHover = accent === 'danger' ? '#dc2626' : '#e4e4e7';
    const confirmColorDark = accent === 'danger' ? 'white' : '#18181b';

    style.textContent = `
        .swal2-popup-custom {
            border-radius: 0 !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        .swal2-actions-custom {
            gap: 0.75rem !important;
            margin-top: 1.5rem !important;
        }
        .swal2-confirm-custom {
            padding: 0.625rem 1.5rem !important;
            background-color: ${confirmBg} !important;
            color: white !important;
            border: none !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            letter-spacing: 0.025em !important;
            transition: all 0.2s ease !important;
        }
        .swal2-confirm-custom:hover {
            background-color: ${confirmBgHover} !important;
            transform: translateY(-1px) !important;
        }
        .swal2-cancel-custom {
            padding: 0.625rem 1.5rem !important;
            background-color: transparent !important;
            color: #71717a !important;
            border: 1px solid #e4e4e7 !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            letter-spacing: 0.025em !important;
            transition: all 0.2s ease !important;
        }
        .swal2-cancel-custom:hover {
            background-color: #f4f4f5 !important;
            color: #18181b !important;
            border-color: #a1a1aa !important;
        }
        .dark .swal2-confirm-custom {
            background-color: ${confirmBgDark} !important;
            color: ${confirmColorDark} !important;
        }
        .dark .swal2-confirm-custom:hover {
            background-color: ${confirmBgDarkHover} !important;
        }
        .dark .swal2-cancel-custom {
            color: #a1a1aa !important;
            border-color: #3f3f46 !important;
        }
        .dark .swal2-cancel-custom:hover {
            background-color: #27272a !important;
            color: #f4f4f5 !important;
            border-color: #52525b !important;
        }
    `;
    document.head.appendChild(style);
}

const swalCustomClass = {
    confirmButton: 'swal2-confirm-custom',
    cancelButton: 'swal2-cancel-custom',
    popup: 'swal2-popup-custom',
    actions: 'swal2-actions-custom',
};

function showServerError(errors: Record<string, string>) {
    const message = Object.values(errors)[0] ?? 'Terjadi kesalahan, coba lagi.';

    Swal.fire({
        icon: 'error',
        title: 'Tidak bisa disimpan',
        text: message,
        buttonsStyling: false,
        customClass: swalCustomClass,
        didOpen: () => injectSwalStyle('danger'),
    });
}

async function openTransactionForm(
    wallets: Wallet[],
    categories: Category[],
    existing?: TransactionRow,
) {
    const walletOptions = wallets
        .map(
            (w) =>
                `<option value="${w.id}" ${
                    existing?.wallet.id === w.id ? 'selected' : ''
                }>${w.name}</option>`,
        )
        .join('');

    const categoryOptions = categories
        .map(
            (c) =>
                `<option value="${c.id}" data-type="${c.type}" ${
                    existing?.category.id === c.id ? 'selected' : ''
                }>${c.name} (${c.type === 'income' ? 'Pemasukan' : 'Pengeluaran'})</option>`,
        )
        .join('');

    const { value } = await Swal.fire({
        title: existing ? 'Edit Transaksi' : 'Tambah Transaksi',
        width: 480,
        padding: '2rem',
        html: `
            <div class="space-y-4 text-left">
                <div>
                    <label class="${swalLabelClass}">Dompet</label>
                    <select id="swal-wallet" class="${swalInputClass}">${walletOptions}</select>
                </div>
                <div>
                    <label class="${swalLabelClass}">Kategori</label>
                    <select id="swal-category" class="${swalInputClass}">${categoryOptions}</select>
                </div>
                <div>
                    <label class="${swalLabelClass}">Nominal</label>
                    <input id="swal-amount" type="number" min="0.01" step="0.01" class="${swalInputClass}" value="${
                        existing?.amount ?? ''
                    }">
                </div>
                <div>
                    <label class="${swalLabelClass}">Tanggal</label>
                    <input id="swal-date" type="date" class="${swalInputClass}" value="${
                        existing?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
                    }">
                </div>
                <div>
                    <label class="${swalLabelClass}">Catatan (opsional)</label>
                    <input id="swal-description" class="${swalInputClass}" placeholder="Contoh: Makan siang" value="${
                        existing?.description ?? ''
                    }">
                </div>
            </div>
        `,
        showCancelButton: true,
        buttonsStyling: false,
        customClass: swalCustomClass,
        confirmButtonText: existing ? 'Simpan Perubahan' : 'Tambah Transaksi',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        didOpen: () => injectSwalStyle('neutral'),
        preConfirm: () => {
            const walletId = (
                document.getElementById('swal-wallet') as HTMLSelectElement
            ).value;
            const categorySelect = document.getElementById(
                'swal-category',
            ) as HTMLSelectElement;
            const categoryId = categorySelect.value;
            const type = categorySelect.selectedOptions[0]?.dataset.type as
                | 'income'
                | 'expense';
            const amount = (
                document.getElementById('swal-amount') as HTMLInputElement
            ).value;
            const date = (
                document.getElementById('swal-date') as HTMLInputElement
            ).value;
            const description = (
                document.getElementById('swal-description') as HTMLInputElement
            ).value.trim();

            if (!walletId || !categoryId) {
                Swal.showValidationMessage('Dompet dan kategori wajib dipilih');

                return;
            }

            if (!amount || Number(amount) <= 0) {
                Swal.showValidationMessage('Nominal tidak valid');

                return;
            }

            if (!date) {
                Swal.showValidationMessage('Tanggal wajib diisi');

                return;
            }

            return {
                wallet_id: Number(walletId),
                category_id: Number(categoryId),
                type,
                amount: Number(amount),
                date,
                description: description || null,
            };
        },
    });

    return value;
}

function groupByDate(transactions: TransactionRow[]) {
    const groups: Record<string, TransactionRow[]> = {};
    transactions.forEach((t) => {
        const key = t.date.slice(0, 10);
        groups[key] = groups[key] ? [...groups[key], t] : [t];
    });
    
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function TypingHeader() {
    const fullText = 'Catat pemasukan dan pengeluaran kamu.';
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

function SummaryBox({
    label,
    value,
    tone,
    showAmounts,
}: {
    label: string;
    value: number;
    tone: 'income' | 'expense' | 'neutral';
    showAmounts: boolean;
}) {
    const animated = useAnimeCounter(value);
    const toneClasses = {
        income: 'text-emerald-600',
        expense: 'text-red-600',
        neutral: 'text-zinc-900 dark:text-zinc-50',
    }[tone];

    return (
        <div className="border border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                {label}
            </p>
            <p
                className={`text-xl font-light tracking-tight tabular-nums ${
                    showAmounts ? toneClasses : 'text-zinc-400 dark:text-zinc-600'
                }`}
            >
                {showAmounts ? formatRupiah(animated) : '••••••••'}
            </p>
        </div>
    );
}

function TransactionRowItem({
    transaction,
    index,
    showAmounts,
    onEdit,
    onDelete,
}: {
    transaction: TransactionRow;
    index: number;
    showAmounts: boolean;
    onEdit: (t: TransactionRow) => void;
    onDelete: (t: TransactionRow) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const isIncome = transaction.type === 'income';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={{ delay: index * 0.02, duration: 0.25, ease: 'easeOut' }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="flex items-center justify-between gap-3 border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    {isIncome ? (
                        <ArrowUpRight
                            className="h-4 w-4 text-emerald-600"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <ArrowDownRight
                            className="h-4 w-4 text-red-600"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {transaction.description || transaction.category.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <span
                            className="h-1.5 w-1.5"
                            style={{ backgroundColor: transaction.category.color }}
                        />
                        {transaction.category.name} · {transaction.wallet.name}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <p
                    className={`text-sm font-light tabular-nums ${
                        showAmounts
                            ? isIncome
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            : 'text-zinc-400 dark:text-zinc-600'
                    }`}
                >
                    {showAmounts
                        ? `${isIncome ? '+' : '-'}${formatRupiah(transaction.amount)}`
                        : '••••••'}
                </p>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex gap-1"
                        >
                            <button
                                type="button"
                                onClick={() => onEdit(transaction)}
                                className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                            >
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(transaction)}
                                className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            >
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default function TransactionsIndex() {
    const { transactions, wallets, categories, flash } = usePage()
        .props as unknown as TransactionsPageProps;
    const [showAmounts, setShowAmounts] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: flash.success,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2500,
                customClass: { popup: 'dark:bg-zinc-900 dark:text-zinc-100' },
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
                customClass: { popup: 'dark:bg-zinc-900 dark:text-zinc-100' },
            });
        }
    }, [flash]);

    const totalIncome = useMemo(
        () =>
            transactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0),
        [transactions],
    );
    const totalExpense = useMemo(
        () =>
            transactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0),
        [transactions],
    );

    const grouped = useMemo(() => groupByDate(transactions), [transactions]);

    const handleCreate = async () => {
        if (wallets.length === 0 || categories.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Lengkapi data dulu',
                text: 'Tambahkan minimal 1 dompet dan 1 kategori sebelum mencatat transaksi.',
                buttonsStyling: false,
                customClass: swalCustomClass,
                didOpen: () => injectSwalStyle('neutral'),
            });

            return;
        }

        const data = await openTransactionForm(wallets, categories);

        if (!data) {
            return;
        }

        router.post('/transactions', data, {
            preserveScroll: true,
            onError: (errors) => showServerError(errors),
        });
    };

    const handleEdit = async (transaction: TransactionRow) => {
        const data = await openTransactionForm(wallets, categories, transaction);

        if (!data) {
            return;
        }

        router.put(`/transactions/${transaction.id}`, data, {
            preserveScroll: true,
            onError: (errors) => showServerError(errors),
        });
    };

    const handleDelete = async (transaction: TransactionRow) => {
        const result = await Swal.fire({
            title: 'Hapus transaksi ini?',
            text: `${transaction.category.name} · ${formatRupiah(transaction.amount)}`,
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: swalCustomClass,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            didOpen: () => injectSwalStyle('danger'),
        });

        if (result.isConfirmed) {
            router.delete(`/transactions/${transaction.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Transaksi" />
            <SidebarInset>
                <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto bg-white px-8 py-10 dark:bg-zinc-950">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div className="flex flex-col space-y-1.5">
                            <TypingHeader />
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="inline-flex shrink-0 items-center gap-2.5 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:translate-y-[-1px] hover:bg-zinc-800 active:translate-y-0 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.5} />
                            Tambah Transaksi
                        </button>
                    </motion.div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <SummaryBox
                                label="Pemasukan"
                                value={totalIncome}
                                tone="income"
                                showAmounts={showAmounts}
                            />
                            <SummaryBox
                                label="Pengeluaran"
                                value={totalExpense}
                                tone="expense"
                                showAmounts={showAmounts}
                            />
                            <SummaryBox
                                label="Selisih"
                                value={totalIncome - totalExpense}
                                tone="neutral"
                                showAmounts={showAmounts}
                            />
                            <button
                                type="button"
                                onClick={() => setShowAmounts((prev) => !prev)}
                                className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                title={showAmounts ? 'Sembunyikan nominal' : 'Tampilkan nominal'}
                            >
                                {showAmounts ? (
                                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                                ) : (
                                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                                )}
                            </button>
                        </div>
                    </div>

                    {grouped.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center border border-dashed border-zinc-200 py-16 dark:border-zinc-800"
                        >
                            <Receipt
                                className="mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-600"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm font-light text-zinc-400">
                                Belum ada transaksi. Klik "Tambah Transaksi" untuk mencatat yang pertama.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {grouped.map(([date, items]) => (
                                <div key={date}>
                                    <div className="mb-2 flex items-center gap-3">
                                        <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                            {formatDate(date)}
                                        </p>
                                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <AnimatePresence mode="popLayout">
                                            {items.map((transaction, index) => (
                                                <TransactionRowItem
                                                    key={transaction.id}
                                                    transaction={transaction}
                                                    index={index}
                                                    showAmounts={showAmounts}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

TransactionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'User | Transactions Management',
            href: userTransactions(),
        },
    ],
};