import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ShieldCheck,
    ShieldOff,
    UserCog,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { SidebarInset } from '@/components/ui/sidebar';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string | null;
    created_at: string;
};

type PaginatedResponse = {
    data: ManagedUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type UsersPageProps = {
    users: PaginatedResponse;
    flash?: {
        success?: string;
    };
};

const FULL_TITLE = 'Manajemen Pengguna';

function formatDate(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function initials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
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
        transition: { delay: i * 0.03, duration: 0.3 },
    }),
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function UsersIndex() {
    const { users, flash } = usePage().props as unknown as UsersPageProps;

    const url = new URL(usePage().url, window.location.origin);
    const initialSearch = url.searchParams.get('search') || '';

    const [localSearch, setLocalSearch] = useState(initialSearch);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [displayedTitle, setDisplayedTitle] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const prevSearchRef = useRef(initialSearch);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== prevSearchRef.current) {
                prevSearchRef.current = localSearch;
                router.get(
                    '/admin/users',
                    { search: localSearch || undefined, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch]);

    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const total = users.last_page;
        const current = users.current_page;

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (current > 3) {
                pages.push('…');
            }

            for (
                let i = Math.max(2, current - 1);
                i <= Math.min(total - 1, current + 1);
                i++
            ) {
                pages.push(i);
            }

            if (current < total - 2) {
                pages.push('…');
            }

            pages.push(total);
        }

        return pages;
    }, [users.current_page, users.last_page]);

    const goToPage = (page: number) => {
        if (page === users.current_page) {
            return;
        }

        router.get(
            '/admin/users',
            { search: localSearch || undefined, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleRoleChange = (
        user: ManagedUser,
        nextRole: 'admin' | 'user',
    ) => {
        if (nextRole === user.role) {
            return;
        }

        Swal.fire({
            title:
                nextRole === 'admin' ? 'Jadikan Admin?' : 'Turunkan ke User?',
            text: `Ubah role "${user.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27272a',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal',
            background: '#18181b',
            color: '#d4d4d8',
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            setPendingId(user.id);
            router.put(
                `/admin/users/${user.id}`,
                { role: nextRole },
                { preserveScroll: true, onFinish: () => setPendingId(null) },
            );
        });
    };

    return (
        <SidebarInset>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <Head title="Manajemen Pengguna" />

                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {displayedTitle}
                        <span
                            className={`ml-0.5 inline-block w-[2px] translate-y-[3px] bg-zinc-400 transition-opacity duration-300 ${
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
                        Kelola daftar pengguna dan hak akses mereka.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            {users.total} pengguna
                        </p>
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                            <Input
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Cari pengguna..."
                                className="h-8 border-zinc-200 bg-zinc-50/50 pl-8 text-xs dark:border-zinc-700 dark:bg-zinc-800/50"
                            />
                        </div>
                    </div>

                    <div className="min-w-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-100 text-left text-[11px] font-medium tracking-wider text-zinc-400 uppercase dark:border-zinc-800/60">
                                    <th className="px-5 py-3">Pengguna</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Bergabung</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {users.data.length === 0 ? (
                                        <motion.tr
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <td
                                                colSpan={5}
                                                className="px-5 py-14 text-center"
                                            >
                                                <p className="text-sm text-zinc-400">
                                                    Tidak ada pengguna
                                                    ditemukan.
                                                </p>
                                            </td>
                                        </motion.tr>
                                    ) : (
                                        users.data.map((user, i) => (
                                            <motion.tr
                                                key={user.id}
                                                custom={i}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/60 dark:border-zinc-800/40 dark:hover:bg-zinc-800/20"
                                            >
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {user.avatar ? (
                                                            <img
                                                                src={
                                                                    user.avatar
                                                                }
                                                                alt={user.name}
                                                                className="h-8 w-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                                {initials(
                                                                    user.name,
                                                                )}
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-5 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    {user.role === 'admin' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                            <UserCog className="h-3 w-3" />
                                                            User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    {user.role === 'admin' ? (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                pendingId ===
                                                                user.id
                                                            }
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user,
                                                                    'user',
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                                                        >
                                                            {pendingId ===
                                                            user.id ? (
                                                                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
                                                            ) : (
                                                                <ShieldOff className="h-3 w-3" />
                                                            )}
                                                            Jadikan User
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                pendingId ===
                                                                user.id
                                                            }
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user,
                                                                    'admin',
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                                                        >
                                                            {pendingId ===
                                                            user.id ? (
                                                                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
                                                            ) : (
                                                                <ShieldCheck className="h-3 w-3" />
                                                            )}
                                                            Jadikan Admin
                                                        </button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 dark:border-zinc-800/60">
                            <p className="text-[11px] text-zinc-400">
                                Halaman {users.current_page} dari{' '}
                                {users.last_page}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={users.current_page <= 1}
                                    onClick={() =>
                                        goToPage(users.current_page - 1)
                                    }
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
                                                page === users.current_page
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
                                    disabled={
                                        users.current_page >= users.last_page
                                    }
                                    onClick={() =>
                                        goToPage(users.current_page + 1)
                                    }
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin | User Management',
            href: '/admin/users',
        },
    ],
};