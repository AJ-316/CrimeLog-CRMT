import {useOutletContext} from "react-router-dom";
import type {Role} from "../api/types.ts";
import type {AppOutletContext} from "./app/AppShell.tsx";

const dashboardHighlights: Record<Role, readonly { label: string; value: string; detail: string }[]> = {
    ADMIN: [
        {label: "Pending approvals", value: "14", detail: "Accounts and access requests waiting for review."},
        {label: "Audit alerts", value: "03", detail: "Events that may need an administrator response."},
        {label: "System uptime", value: "99.9%", detail: "A quick view of overall platform availability."}
    ],
    LAWYER: [
        {label: "Open matters", value: "18", detail: "Cases and client tasks currently in motion."},
        {label: "Hearings this week", value: "06", detail: "Upcoming court appearances and prep windows."},
        {label: "Documents pending", value: "12", detail: "Briefs, filings, and evidence packets to review."}
    ],
    OFFICER: [
        {label: "Active assignments", value: "09", detail: "Incidents and tasks currently assigned in the field."},
        {label: "Priority reports", value: "04", detail: "Items that need immediate follow-up or escalation."},
        {label: "Units online", value: "27", detail: "A quick snapshot of current operational coverage."}
    ],
    PUBLIC: [
        {label: "Submitted reports", value: "05", detail: "Reports you have already filed through the system."},
        {label: "Open updates", value: "02", detail: "Cases or reports that recently changed status."},
        {label: "Support replies", value: "07", detail: "Messages and notices currently available to review."}
    ]
};

const roleNarrative: Record<Role, string> = {
    ADMIN: "Oversee access, governance, and platform health from a calm operator-focused dashboard.",
    LAWYER: "See your legal workload, upcoming hearings, and document pressure points at a glance.",
    OFFICER: "Stay oriented on assignments, field updates, and operational readiness with a clean overview.",
    PUBLIC: "Track submitted reports and important updates without losing your sense of where things stand."
};

function Dashboard() {
    const {role} = useOutletContext<AppOutletContext>();

    return (
        <section className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-[0_22px_65px_rgba(15,23,42,0.28)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Dashboard</p>
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">CrimeLog overview</h1>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{roleNarrative[role]}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current workspace role</p>
                        <p className="mt-2 text-lg font-semibold text-white">{role}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {dashboardHighlights[role].map((item) => (
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.07)]" key={item.label}>
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </article>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                    <h2 className="text-xl font-semibold text-slate-900">Workspace highlights</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {[
                            "Role-aware navigation",
                            "Clear page summaries",
                            "Focused work areas",
                            "Room for live case data"
                        ].map((item) => (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700" key={item}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                    <h2 className="text-xl font-semibold text-slate-900">Coming into focus</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                        <li>• Recent activity timeline</li>
                        <li>• Search and filters for cases</li>
                        <li>• Notification center</li>
                        <li>• Profile and session settings</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Dashboard;