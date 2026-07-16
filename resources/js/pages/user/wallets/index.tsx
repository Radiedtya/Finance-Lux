import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Trash2,
    Wallet as WalletIcon,
    Eye,
    EyeOff,
    Plus,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { SidebarInset } from '@/components/ui/sidebar';
import {
    formatRupiah,
    swalButtonClasses,
    swalDangerButtonClasses,
    swalInputClass,
    swalLabelClass,
    useAnimeCounter,
} from '@/lib/finance';
import { userWallets } from '@/routes';

type WalletRow = {
    id: number;
    name: string;
    balance: number;
};

type WalletsPageProps = {
    wallets: WalletRow[];
    flash?: { success?: string; error?: string };
};

async function openWalletForm(existing?: WalletRow) {
    const { value } = await Swal.fire({
        title: existing ? 'Edit Dompet' : 'Tambah Dompet',
        width: 480,
        padding: '2rem',
        html: `
            <div class="space-y-4 text-left">
                <div>
                    <label class="${swalLabelClass}">Nama Dompet</label>
                    <input id="swal-name" class="${swalInputClass}" placeholder="Contoh: Dompet Utama" value="${
                        existing?.name ?? ''
                    }">
                </div>
                ${
                    existing
                        ? `<p class="text-xs text-neutral-400 mt-2">Saldo hanya berubah lewat transaksi, tidak bisa diedit manual di sini.</p>`
                        : ''
                }
            </div>
        `,
        showCancelButton: true,
        buttonsStyling: false,
        customClass: {
            ...swalButtonClasses,
            confirmButton: 'swal2-confirm-custom',
            cancelButton: 'swal2-cancel-custom',
            popup: 'swal2-popup-custom',
            actions: 'swal2-actions-custom',
        },
        confirmButtonText: existing ? 'Simpan Perubahan' : 'Tambah Dompet',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
            const name = (
                document.getElementById('swal-name') as HTMLInputElement
            ).value.trim();

            if (!name) {
                Swal.showValidationMessage('Nama dompet wajib diisi');

                return;
            }

            return { name };
        },
        didOpen: () => {
            const style = document.createElement('style');
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
                    background-color: #18181b !important;
                    color: white !important;
                    border: none !important;
                    font-size: 0.875rem !important;
                    font-weight: 500 !important;
                    letter-spacing: 0.025em !important;
                    transition: all 0.2s ease !important;
                }
                .swal2-confirm-custom:hover {
                    background-color: #27272a !important;
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
                    background-color: #f4f4f5 !important;
                    color: #18181b !important;
                }
                .dark .swal2-confirm-custom:hover {
                    background-color: #e4e4e7 !important;
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
        },
    });

    return value as { name: string } | undefined;
}

// function useTypingText(text: string, speed: number) {
//     const [displayed, setDisplayed] = useState('');
//     const indexRef = useRef(0);
//     const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//     useEffect(() => {
//         indexRef.current = 0;
//         setDisplayed('');

//         intervalRef.current = setInterval(() => {
//             indexRef.current += 1;
//             const currentText = text.slice(0, indexRef.current);

//             setDisplayed((prev) => {
//                 if (prev === currentText && indexRef.current < text.length) {
//                     return prev;
//                 }
//                 return currentText;
//             });

//             if (indexRef.current >= text.length && intervalRef.current) {
//                 clearInterval(intervalRef.current);
//                 intervalRef.current = null;
//             }
//         }, speed);

//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, [text, speed]);

//     const done = displayed.length >= text.length && text.length > 0;

//     return { displayed, done };
// }

function WalletCard({
    wallet,
    index,
    onEdit,
    onDelete,
    showBalance,
}: {
    wallet: WalletRow;
    index: number;
    onEdit: (wallet: WalletRow) => void;
    onDelete: (wallet: WalletRow) => void;
    showBalance: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={{
                delay: index * 0.03,
                duration: 0.3,
                ease: 'easeOut',
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <WalletIcon
                            className="h-4 w-4 text-zinc-600 dark:text-zinc-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {wallet.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500">
                            •••• {String(wallet.id).padStart(4, '0')}
                        </p>
                    </div>
                </div>

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
                                onClick={() => onEdit(wallet)}
                                className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                            >
                                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(wallet)}
                                className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            >
                                <Trash2
                                    className="h-3.5 w-3.5"
                                    strokeWidth={1.5}
                                />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-4">
                {showBalance ? (
                    <p className="text-xl font-light tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                        {formatRupiah(wallet.balance)}
                    </p>
                ) : (
                    <p className="text-xl font-light tracking-tight text-zinc-400 dark:text-zinc-600">
                        ••••••••
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function TypingHeader() {
    const fullText = 'Kelola dompet untuk mencatat transaksi keuangan kamu.';
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

export default function WalletsIndex() {
    const { wallets, flash } = usePage().props as unknown as WalletsPageProps;
    const [search, setSearch] = useState('');
    const [showBalance, setShowBalance] = useState(false);

    const totalBalance = useMemo(
        () => wallets.reduce((sum, w) => sum + Number(w.balance), 0),
        [wallets],
    );
    const animatedTotal = useAnimeCounter(totalBalance);

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

    const filteredWallets = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return wallets;
        }

        return wallets.filter((w) => w.name.toLowerCase().includes(query));
    }, [wallets, search]);

    const handleCreate = async () => {
        const data = await openWalletForm();

        if (!data) {
            return;
        }

        router.post('/wallets', data, { preserveScroll: true });
    };

    const handleEdit = async (wallet: WalletRow) => {
        const data = await openWalletForm(wallet);

        if (!data) {
            return;
        }

        router.put(`/wallets/${wallet.id}`, data, { preserveScroll: true });
    };

    const handleDelete = async (wallet: WalletRow) => {
        const result = await Swal.fire({
            title: `Hapus "${wallet.name}"?`,
            text: 'Dompet yang sudah memiliki transaksi tidak bisa dihapus.',
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                ...swalDangerButtonClasses,
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom',
                popup: 'swal2-popup-custom',
                actions: 'swal2-actions-custom',
            },
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            didOpen: () => {
                const style = document.createElement('style');
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
                        background-color: #dc2626 !important;
                        color: white !important;
                        border: none !important;
                        font-size: 0.875rem !important;
                        font-weight: 500 !important;
                        letter-spacing: 0.025em !important;
                        transition: all 0.2s ease !important;
                    }
                    .swal2-confirm-custom:hover {
                        background-color: #b91c1c !important;
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
                        background-color: #ef4444 !important;
                    }
                    .dark .swal2-confirm-custom:hover {
                        background-color: #dc2626 !important;
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
            },
        });

        if (result.isConfirmed) {
            router.delete(`/wallets/${wallet.id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Dompet" />
            <SidebarInset>
                <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto bg-white px-8 py-10 dark:bg-zinc-950">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div className="flex flex-col space-y-1.5">
                            {/* <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
                                Dompet
                            </h1> */}
                            <TypingHeader />
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="inline-flex shrink-0 items-center gap-2.5 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:translate-y-[-1px] hover:bg-zinc-800 active:translate-y-0 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.5} />
                            Tambah Dompet
                        </button>
                    </motion.div>

                    {/* Summary and Search Section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="border border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                                    Total Saldo
                                </p>
                                <div className="flex items-center gap-2">
                                    {showBalance ? (
                                        <p className="text-xl font-light tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                                            {formatRupiah(animatedTotal)}
                                        </p>
                                    ) : (
                                        <p className="text-xl font-light tracking-tight text-zinc-400 dark:text-zinc-600">
                                            ••••••••
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowBalance(!showBalance)
                                        }
                                        className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                        title={
                                            showBalance
                                                ? 'Sembunyikan saldo'
                                                : 'Tampilkan saldo'
                                        }
                                    >
                                        {showBalance ? (
                                            <EyeOff
                                                className="h-4 w-4"
                                                strokeWidth={1.5}
                                            />
                                        ) : (
                                            <Eye
                                                className="h-4 w-4"
                                                strokeWidth={1.5}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full max-w-xs sm:w-64">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari dompet..."
                                className="border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-zinc-900"
                            />
                            <svg
                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Wallet Grid */}
                    {filteredWallets.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center border border-dashed border-zinc-200 py-16 dark:border-zinc-800"
                        >
                            <WalletIcon
                                className="mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-600"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm font-light text-zinc-400">
                                Belum ada dompet. Klik "Tambah Dompet" untuk
                                membuat yang pertama.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {filteredWallets.map((wallet, index) => (
                                    <WalletCard
                                        key={wallet.id}
                                        wallet={wallet}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        showBalance={showBalance}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

WalletsIndex.layout = {
    breadcrumbs: [
        {
            title: 'User | Wallets Management',
            href: userWallets(),
        },
    ],
};
