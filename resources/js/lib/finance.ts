import { animate } from 'animejs';
import { useEffect, useRef, useState } from 'react';

export function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDate(value: string | Date, style: 'long' | 'short' = 'long') {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: style === 'long' ? 'long' : 'short',
        year: 'numeric',
    }).format(new Date(value));
}

export function useAnimeCounter(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    const objRef = useRef({ val: 0 });

    useEffect(() => {
        const obj = objRef.current;
        const animation = animate(obj, {
            val: target,
            duration,
            ease: 'outExpo',
            onUpdate: () => setValue(Math.round(obj.val)),
        });

        return () => {
            animation.pause();
        };
    }, [target, duration]);

    return value;
}

export function getContrastText(hex: string) {
    const clean = hex.replace('#', '');

    if (clean.length !== 6) {
        return '#18181b';
    }

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.6 ? '#18181b' : '#ffffff';
}

export const walletGradients = [
    'from-violet-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-sky-500 to-blue-600',
];

export function gradientForId(id: number) {
    return walletGradients[id % walletGradients.length];
}

export const swalButtonClasses = {
    popup: 'rounded-sm border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900',
    title: 'text-neutral-900 dark:text-neutral-100',
    htmlContainer: 'text-neutral-600 dark:text-neutral-400',
    confirmButton:
        'rounded-sm bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200',
    cancelButton:
        'rounded-sm border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800',
};

export const swalDangerButtonClasses = {
    ...swalButtonClasses,
    confirmButton:
        'rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700',
};

export const swalInputClass =
    'w-full rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

export const swalLabelClass =
    'mb-1 block text-left text-xs font-medium text-neutral-500 dark:text-neutral-400';