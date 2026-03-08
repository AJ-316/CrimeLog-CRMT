import {useEffect, useMemo, useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import type {Role} from "../api/types.ts";
import type {AppOutletContext} from "./app/AppShell.tsx";
import {getFirs} from "../api/services/fir-services.ts";
import {getAssignedCases, getCases} from "../api/services/case-services.ts";
import {getMyRequests, getPendingRequests} from "../api/services/request-services.ts";
import {getSessionUserId} from "../utils/auth-session.ts";
import {primaryButtonClassName, secondaryButtonClassName} from "./app/WorkspaceUi.tsx";

interface DashboardMetric {
    label: string;
    value: string;
    detail: string;
}

interface QuickLink {
    label: string;
    description: string;
    to: string;
    primary?: boolean;
}

const roleNarrative: Record<Role, string> = {
    ADMIN: "Review incoming requests, keep oversight metrics visible, and move approvals forward with a clean queue.",
    LAWYER: "Track assigned matters, request representation on new cases, and keep participant context close at hand.",
    OFFICER: "Stay on top of FIR intake, case workload, and operational requests from a single dashboard.",
    PUBLIC: "Use the dashboard as your entry point into the secured CrimeLog workspace."
};

const quickLinksByRole: Record<Role, QuickLink[]> = {
    ADMIN: [
        {label: "Open approvals", description: "Review the pending request queue.", to: "/app/approvals", primary: true},
        {label: "View audit", description: "See current operational totals.", to: "/app/audit"}
    ],
    LAWYER: [
        {label: "View cases", description: "Open assigned case records.", to: "/app/cases", primary: true},
        {label: "Open clients", description: "Review participants by matter.", to: "/app/clients"},
        {label: "Request representation", description: "Submit a new lawyer case request.", to: "/app/hearings"}
    ],
    OFFICER: [
        {label: "Create FIR", description: "Register a new first information report.", to: "/app/fir/new", primary: true},
        {label: "View cases", description: "Review investigation files and participants.", to: "/app/cases"},
        {label: "Submit request", description: "Send transfer or charge-sheet requests.", to: "/app/requests"}
    ],
    PUBLIC: []
};

function Dashboard() {
    const {role} = useOutletContext<AppOutletContext>();
    const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const quickLinks = useMemo(() => quickLinksByRole[role], [role]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                setError("");
                const userId = getSessionUserId();

                if (role === "OFFICER" && userId) {
                    const [firs, cases, requests] = await Promise.all([getFirs(), getCases(), getMyRequests(userId)]);
                    setMetrics([
                        {label: "Total FIRs", value: String(firs.length), detail: "FIRs currently visible in the register."},
                        {label: "Total cases", value: String(cases.length), detail: "Investigation files currently tracked."},
                        {label: "Pending requests", value: String(requests.filter((request) => request.status === "PENDING").length), detail: "Officer requests still waiting for review."}
                    ]);
                    return;
                }

                if (role === "ADMIN") {
                    const [pendingRequests, cases, firs] = await Promise.all([getPendingRequests(), getCases(), getFirs()]);
                    setMetrics([
                        {label: "Pending approvals", value: String(pendingRequests.length), detail: "Requests awaiting an administrator decision."},
                        {label: "Total cases", value: String(cases.length), detail: "Case records currently active in the workspace."},
                        {label: "Total FIRs", value: String(firs.length), detail: "FIR records presently available for review."}
                    ]);
                    return;
                }

                if (role === "LAWYER" && userId) {
                    const [assignedCases, allCases, requests] = await Promise.all([getAssignedCases(userId), getCases(), getMyRequests(userId)]);
                    setMetrics([
                        {label: "Assigned cases", value: String(assignedCases.length), detail: "Matters currently assigned to this lawyer."},
                        {label: "Open cases", value: String(allCases.filter((caseItem) => caseItem.caseStage !== "CLOSED").length), detail: "Open case records visible for legal review."},
                        {label: "Pending requests", value: String(requests.filter((request) => request.status === "PENDING").length), detail: "Representation requests still under review."}
                    ]);
                    return;
                }

                const [firs, cases] = await Promise.all([getFirs(), getCases()]);
                setMetrics([
                    {label: "Visible FIRs", value: String(firs.length), detail: "FIR records currently available in the workspace."},
                    {label: "Visible cases", value: String(cases.length), detail: "Case records currently available in the workspace."},
                    {label: "Role", value: role, detail: "Your current authenticated workspace role."}
                ]);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        void loadDashboard();
    }, [role]);

    return (
        <section className="space-y-6">
            <div className="rounded-[28px] border border-slate-900 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-[0_22px_65px_rgba(15,23,42,0.28)]">
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

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

            <div className="grid gap-4 md:grid-cols-3">
                {(isLoading ? [
                    {label: "Loading", value: "…", detail: "Preparing dashboard metrics."},
                    {label: "Loading", value: "…", detail: "Preparing dashboard metrics."},
                    {label: "Loading", value: "…", detail: "Preparing dashboard metrics."}
                ] : metrics).map((item) => (
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.07)]" key={`${item.label}-${item.detail}`}>
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </article>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                    <h2 className="text-xl font-semibold text-slate-900">Quick navigation</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {quickLinks.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">Your current role has no additional quick actions.</div>
                        ) : quickLinks.map((link) => (
                            <Link
                                className={`rounded-2xl border px-4 py-4 text-left transition ${link.primary ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                                key={link.to}
                                to={link.to}
                            >
                                <p className="text-sm font-semibold">{link.label}</p>
                                <p className="mt-2 text-sm leading-6">{link.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                    <h2 className="text-xl font-semibold text-slate-900">Next best step</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                        {role === "OFFICER"
                            ? "Keep FIR registration moving, open active cases, and submit operational requests from the officer workspace."
                            : role === "ADMIN"
                                ? "Start with the approval queue, then use the audit view to monitor operational volume across the platform."
                                : role === "LAWYER"
                                    ? "Open assigned matters to review participants, then submit representation requests for cases you want to take on."
                                    : "Open the sections available to your current account from the navigation panel."}
                    </p>
                    {quickLinks[0] ? (
                        <Link className={`mt-5 ${quickLinks[0].primary ? primaryButtonClassName : secondaryButtonClassName}`} to={quickLinks[0].to}>
                            {quickLinks[0].label}
                        </Link>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;

