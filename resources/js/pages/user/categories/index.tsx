// CategoriesIndex.tsx
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tags, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { SidebarInset } from '@/components/ui/sidebar';
import {
    getContrastText,
    swalButtonClasses,
    swalDangerButtonClasses,
    swalInputClass,
    swalLabelClass,
} from '@/lib/finance';
import { userCategories } from '@/routes';

type CategoryRow = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
};

type CategoriesPageProps = {
    categories: CategoryRow[];
    flash?: { success?: string; error?: string };
};

async function openCategoryForm(existing?: CategoryRow) {
    const { value } = await Swal.fire({
        title: existing ? 'Edit Kategori' : 'Tambah Kategori',
        width: 480,
        padding: '2rem',
        html: `
            <div class="space-y-4 text-left">
                <div>
                    <label class="${swalLabelClass}">Nama Kategori</label>
                    <input id="swal-name" class="${swalInputClass}" placeholder="Contoh: Makanan" value="${
                        existing?.name ?? ''
                    }">
                </div>
                <div>
                    <label class="${swalLabelClass}">Tipe</label>
                    <select id="swal-type" class="${swalInputClass}">
                        <option value="expense" ${
                            existing?.type === 'expense' || !existing
                                ? 'selected'
                                : ''
                        }>Pengeluaran</option>
                        <option value="income" ${
                            existing?.type === 'income' ? 'selected' : ''
                        }>Pemasukan</option>
                    </select>
                </div>
                <div>
                    <label class="${swalLabelClass}">Warna</label>
                    <input id="swal-color" type="color" class="h-10 w-full cursor-pointer rounded border border-zinc-200 dark:border-zinc-700" value="${
                        existing?.color ?? '#10b981'
                    }">
                </div>
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
        confirmButtonText: existing ? 'Simpan Perubahan' : 'Tambah Kategori',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
            const name = (
                document.getElementById('swal-name') as HTMLInputElement
            ).value.trim();
            const type = (
                document.getElementById('swal-type') as HTMLSelectElement
            ).value as 'income' | 'expense';
            const color = (
                document.getElementById('swal-color') as HTMLInputElement
            ).value;

            if (!name) {
                Swal.showValidationMessage('Nama kategori wajib diisi');

                return;
            }

            return { name, type, color };
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

    return value as
        { name: string; type: 'income' | 'expense'; color: string } | undefined;
}

function CategoryChip({
    category,
    index,
    onDelete,
}: {
    category: CategoryRow;
    index: number;
    onDelete: (category: CategoryRow) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative flex items-center gap-2 border border-transparent px-4 py-2"
            style={{
                backgroundColor: category.color,
                color: getContrastText(category.color),
            }}
        >
            <span className="text-sm font-medium tracking-wide">
                {category.name}
            </span>

            <AnimatePresence>
                {isHovered && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => onDelete(category)}
                        className="flex items-center justify-center p-1 transition-colors hover:bg-black/10"
                        style={{ color: getContrastText(category.color) }}
                    >
                        <X className="h-3 w-3" />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function CategoryGroup({
    title,
    categories,
    onDelete,
}: {
    title: string;
    categories: CategoryRow[];
    onDelete: (category: CategoryRow) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.3 }}
            className="border-b border-zinc-100 pb-6 dark:border-zinc-800"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                        {title}
                    </h2>
                    <span className="bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600">
                        {categories.length}
                    </span>
                </div>
            </div>

            {categories.length === 0 ? (
                <p className="text-sm font-light text-zinc-400 italic">
                    Belum ada kategori
                </p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                        {categories.map((category, index) => (
                            <CategoryChip
                                key={category.id}
                                category={category}
                                index={index}
                                onDelete={onDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}

function TypingHeader() {
    const fullText = 'Kelola kategori pemasukan dan pengeluaran kamu.';
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

export default function CategoriesIndex() {
    const { categories, flash } = usePage()
        .props as unknown as CategoriesPageProps;

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

    const incomeCategories = useMemo(
        () => categories.filter((c) => c.type === 'income'),
        [categories],
    );
    const expenseCategories = useMemo(
        () => categories.filter((c) => c.type === 'expense'),
        [categories],
    );

    const handleCreate = async () => {
        const data = await openCategoryForm();

        if (!data) {
            return;
        }

        router.post('/categories', data, { preserveScroll: true });
    };

    const handleDelete = async (category: CategoryRow) => {
        const result = await Swal.fire({
            title: `Hapus "${category.name}"?`,
            text: 'Kategori yang sudah dipakai transaksi tidak bisa dihapus.',
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
            router.delete(`/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Kategori" />
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
                            Tambah Kategori
                        </button>
                    </motion.div>

                    {categories.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center border border-dashed border-zinc-200 py-16 dark:border-zinc-800"
                        >
                            <Tags
                                className="mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-600"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm font-light text-zinc-400">
                                Belum ada kategori. Klik "Tambah Kategori" untuk
                                membuat yang pertama.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="grid gap-8 lg:grid-cols-2"
                        >
                            <CategoryGroup
                                title="Pemasukan"
                                categories={incomeCategories}
                                onDelete={handleDelete}
                            />
                            <CategoryGroup
                                title="Pengeluaran"
                                categories={expenseCategories}
                                onDelete={handleDelete}
                            />
                        </motion.div>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'User | Categories Management',
            href: userCategories(),
        },
    ],
};
