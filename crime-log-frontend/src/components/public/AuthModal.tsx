import {useEffect, type ReactNode} from "react";

interface AuthModalProps {
    isOpen: boolean;
    title: string;
    subtitle: string;
    size?: "compact" | "wide";
    onClose: () => void;
    children: ReactNode;
}

export default function AuthModal({
    isOpen,
    title,
    subtitle,
    size = "compact",
    onClose,
    children
}: AuthModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
            <button className="absolute inset-0" onClick={onClose} type="button" aria-label="Close authentication dialog" />

            <div className={`relative z-10 w-full overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/85 shadow-[0_24px_90px_rgba(15,23,42,0.55)] ${
                size === "wide" ? "max-w-5xl" : "max-w-md"
            }`}>
                <div className="border-b border-white/10 bg-linear-to-r from-blue-500/15 via-transparent to-cyan-400/10 px-6 py-5 sm:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                                CrimeLog access
                            </span>
                            <h2 className="mt-4 text-2xl font-semibold text-white" id="auth-modal-title">{title}</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{subtitle}</p>
                        </div>
                        <button
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                            onClick={onClose}
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="max-h-[80vh] overflow-y-auto px-6 py-6 sm:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
