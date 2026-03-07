import {useOutletContext} from "react-router-dom";
import type {Role} from "../../api/types.ts";

interface TemplatePageProps {
    eyebrow: string;
    title: string;
    description: string;
    highlights: readonly string[];
    note: string;
}

const roleTheme: Record<Role, string> = {
    ADMIN: "from-violet-500/15 to-fuchsia-500/10 border-violet-400/20",
    LAWYER: "from-amber-500/15 to-orange-500/10 border-amber-400/20",
    OFFICER: "from-sky-500/15 to-cyan-500/10 border-sky-400/20",
    PUBLIC: "from-emerald-500/15 to-teal-500/10 border-emerald-400/20"
};

export default function TemplatePage({eyebrow, title, description, highlights, note}: TemplatePageProps) {
    const {role} = useOutletContext<{ role: Role }>();

    return (
        <section className="space-y-6">
            <div className={`rounded-[28px] border bg-linear-to-br p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${roleTheme[role]}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
                    </div>
                    <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-left backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Current role</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{role}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {highlights.map((highlight) => (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_14px_35px_rgba(15,23,42,0.06)]" key={highlight}>
                        <p className="text-sm font-medium text-slate-500">Key area</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{highlight}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">This space is ready to surface the most important details for this section.</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
                {note}
            </div>
        </section>
    );
}
