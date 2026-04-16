import type {PropsWithChildren, ReactNode} from "react";

const toneClassNames = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700"
} as const;

export function PageHeader({
    eyebrow,
    title,
    description,
    actions
}: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-950 px-4 py-5 text-white shadow-[0_22px_65px_rgba(15,23,42,0.18)] sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">{eyebrow}</p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </div>
            {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
        </div>
    );
}

export function SectionCard({
    title,
    description,
    children,
    className = ""
}: PropsWithChildren<{ title: string; description?: string; className?: string }>) {
    return (
        <section className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6 ${className}`.trim()}>
            <div className="mb-5 flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
            </div>
            {children}
        </section>
    );
}

export function EmptyState({
    title,
    description,
    action
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center sm:px-6 sm:py-10">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}

export function StatusBadge({
    label,
    tone = "slate"
}: {
    label: string;
    tone?: keyof typeof toneClassNames;
}) {
    return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${toneClassNames[tone]}`}>{label}</span>;
}

export function LoadingBlock({label = "Loading"}: { label?: string }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-10">
            {label}
        </div>
    );
}

export const primaryButtonClassName = "inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto";
export const secondaryButtonClassName = "inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto";
export const dangerButtonClassName = "inline-flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 sm:w-auto";
export const inputClassName = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100";
export const textareaClassName = `${inputClassName} min-h-28 resize-y`;
export const tableContainerClassName = "overflow-x-auto rounded-3xl border border-slate-200";
export const tableClassName = "w-full min-w-[760px] divide-y divide-slate-200 text-left";
export const tableHeadCellClassName = "bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap";
export const tableCellClassName = "px-4 py-4 text-sm text-slate-700 align-top";

