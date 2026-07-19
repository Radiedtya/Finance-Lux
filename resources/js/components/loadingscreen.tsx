import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type LoadingScreenProps = {
    onLoaded?: () => void;
    minDuration?: number;
};

function useTypingText(text: string, speed: number) {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            index++;
            setDisplayed(text.slice(0, index));

            if (index >= text.length) {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return displayed;
}

export default function LoadingScreen({
    onLoaded,
    minDuration = 1800,
}: LoadingScreenProps) {
    const brandText = 'Finance Lux';
    const typed = useTypingText(brandText, 90);
    const isTypingComplete = typed.length >= brandText.length;

    const financePart = typed.slice(0, 7);
    const luxPart = typed.slice(7);

    useEffect(() => {
        const startTime = Date.now();

        const finishLoading = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(minDuration - elapsed, 0);

            setTimeout(() => {
                onLoaded?.();
            }, remaining);
        };

        if (document.readyState === 'complete') {
            finishLoading();
        } else {
            window.addEventListener('load', finishLoading);
        }

        return () => {
            window.removeEventListener('load', finishLoading);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDuration]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
        >
            <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <div className="absolute inset-0 scale-150 rounded-full bg-amber-500/20 blur-xl" />
                    <img
                        src="/images/flx.png"
                        alt="FinanceLux"
                        className="relative h-20 w-20 rounded-2xl object-contain shadow-lg shadow-indigo-500/10"
                    />
                </div>

                <p className="min-h-9 text-2xl font-light tracking-tight text-white sm:text-3xl">
                    {financePart}
                    <span className="font-medium text-indigo-600">{luxPart}</span>
                    {!isTypingComplete && (
                        <span className="ml-0.5 inline-block h-6 w-px animate-pulse bg-indigo-400 align-middle" />
                    )}
                </p>

                <div className="mt-8 h-px w-40 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                            duration: minDuration / 1000,
                            ease: 'easeInOut',
                        }}
                        className="h-full bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-500"
                    />
                </div>

                <p className="mt-4 text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">
                    Memuat
                </p>
            </motion.div>
        </motion.div>
    );
}