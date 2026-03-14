import {useEffect, useMemo} from "react";
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import type {Role} from "../../api/types.ts";
import {clearAuthSession, getSessionRole} from "../../utils/auth-session.ts";

export interface AppOutletContext {
    role: Role;
}

interface NavItem {
    label: string;
    path: string;
    caption: string;
}

const commonNav: readonly NavItem[] = [
    {label: "Dashboard", path: "/app", caption: "Workspace summary"}
];

const roleNav: Record<Role, readonly NavItem[]> = {
    ADMIN: [
        {label: "Approvals", path: "/app/approvals", caption: "Review pending requests"},
        {label: "Audit", path: "/app/audit", caption: "Operational metrics"}
    ],
    LAWYER: [
        {label: "Cases", path: "/app/cases", caption: "Assigned matters"},
        {label: "Clients", path: "/app/clients", caption: "Participants and status"},
        {label: "Hearings", path: "/app/hearings", caption: "Representation requests"}
    ],
    OFFICER: [
        {label: "FIR", path: "/app/fir", caption: "Register and review FIRs"},
        {label: "Cases", path: "/app/cases", caption: "Investigation files"},
        {label: "Requests", path: "/app/requests", caption: "Transfer and action requests"}
    ],
    PUBLIC: []
};

export default function AppShell() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = getSessionRole();

    const navItems = useMemo(() => [...commonNav, ...roleNav[role]], [role]);
    const allowedPrefixes = useMemo(() => navItems.map((item) => item.path), [navItems]);
    const outletContext: AppOutletContext = {role};

    useEffect(() => {
        const isAllowedPath = allowedPrefixes.some((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
        if (!isAllowedPath) {
            navigate("/app", {replace: true});
        }
    }, [allowedPrefixes, location.pathname, navigate]);

    const handleLogout = () => {
        clearAuthSession();
        navigate("/", {replace: true});
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_48%,_#f8fafc_100%)] px-3 py-3 text-slate-900 sm:px-4 lg:px-5">
            <div className="grid min-h-[calc(100vh-1.5rem)] w-full gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
                <aside className="flex flex-col rounded-[28px] border border-white/60 bg-slate-950 text-white shadow-[0_25px_80px_rgba(15,23,42,0.45)] lg:sticky lg:top-3 lg:min-h-[calc(100vh-1.5rem)]">
                    <div className="border-b border-white/10 px-5 py-6 sm:px-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">CrimeLog</p>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Operations workspace</h1>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Move through FIRs, cases, approvals, and role-specific actions from one focused workspace.
                        </p>
                    </div>

                    <div className="px-4 py-5">
                        <p className="px-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Navigation</p>
                        <nav className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                            {navItems.map((item) => (
                                <NavLink
                                    className={({isActive}) => `block rounded-2xl border px-4 py-3 transition ${
                                        isActive
                                            ? "border-blue-400/50 bg-blue-500/20 text-white shadow-[0_12px_30px_rgba(59,130,246,0.25)]"
                                            : "border-transparent bg-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                                    end={item.path === "/app"}
                                    key={item.path}
                                    to={item.path}
                                >
                                    <p className="text-sm font-semibold">{item.label}</p>
                                    <p className="mt-1 text-xs text-slate-400">{item.caption}</p>
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto border-t border-white/10 px-4 py-5">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Signed-in role</p>
                            <p className="mt-2 text-lg font-semibold text-white">{role}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Navigation and page actions are tailored to this role.
                            </p>
                        </div>

                        <button
                            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                            onClick={handleLogout}
                            type="button"
                        >
                            Log out
                        </button>
                    </div>
                </aside>

                <main className="flex min-h-[calc(100vh-1.5rem)] min-w-0 flex-col rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-5 xl:p-7">
                    <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-white bg-white/75 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">CrimeLog workspace</p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Manage reporting, cases, and approvals in one place</h2>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Signed in • Role context <span className="font-semibold text-slate-900">{role}</span>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <Outlet context={outletContext} />
                    </div>
                </main>
            </div>
        </div>
    );
}
