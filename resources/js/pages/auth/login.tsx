import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const fullDescText = 'Masukkan email dan password Anda di bawah ini';
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullDescText.length) {
                setDisplayText(fullDescText.slice(0, index));
                index++;
            } else {
                setIsTypingComplete(true);
                clearInterval(timer);
            }
        }, 25);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <Head title="Masuk" />

            <div className="fixed inset-0 z-50 grid grid-cols-1 bg-white lg:grid-cols-12 dark:bg-zinc-950">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    /* [scrollbar-width:none] [&::-webkit-scrollbar]:hidden] digunakan untuk menghilangkan garis scroll */
                    className="relative z-10 col-span-12 flex flex-col justify-start overflow-y-auto px-6 py-12 lg:col-span-6 lg:px-24 lg:py-20 scrollbar-none [&::-webkit-scrollbar]:hidden bg-zinc-100 dark:bg-zinc-950"
                >
                    <Link
                        href="/"
                        className="mb-4 flex w-fit items-center gap-2.5"
                    >
                        <img
                            src="/images/flx.png"
                            alt="FinanceLux"
                            className="h-8 w-8 rounded-full object-contain"
                        />
                        <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Finance Lux
                        </span>
                    </Link>

                    <div className="w-full max-w-sm">
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Masuk untuk memulai aktivitas Anda
                        </h1>
                        
                        {/* Typing Animation */}
                        <div className="mb-8 min-h-5">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {displayText}
                                {!isTypingComplete && (
                                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-zinc-400" />
                                )}
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Alamat Email
                                            </Label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="email@example.com"
                                                    className="pl-9 rounded-none"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm"
                                                        tabIndex={5}
                                                    >
                                                        Lupa password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    className="pl-9 rounded-none"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">
                                                Ingat saya
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-2 w-full rounded-none"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            Masuk
                                        </Button>

                                        <div className="relative flex items-center py-1">
                                            <div className="grow border-t border-muted" />
                                            <span className="mx-4 shrink text-xs text-muted-foreground uppercase">
                                                Atau lanjutkan dengan
                                            </span>
                                            <div className="grow border-t border-muted" />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex w-full items-center justify-center gap-2 rounded-none"
                                            onClick={() =>
                                                (window.location.href =
                                                    '/auth/github')
                                            }
                                        >
                                            <svg
                                                role="img"
                                                viewBox="0 0 24 24"
                                                className="h-4 w-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                            </svg>
                                            <span>Lanjutkan dengan GitHub</span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    className="relative hidden items-center justify-center overflow-hidden bg-zinc-400 lg:col-span-6 lg:flex dark:bg-zinc-900"
                >
                    <img
                        src="/images/banner.png"
                        alt="FinanceLux Dashboard"
                        className="h-full w-full object-contain p-12"
                    />
                </motion.div>
            </div>
        </>
    );
}