import {useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import AuthModal from "./public/AuthModal.tsx";
import {hasAuthToken} from "../utils/auth-session.ts";

type AuthView = "login" | "register";

const featureCards = [
    {
        title: "Track investigations with clarity",
        description: "Follow reports, case notes, and status changes in a workspace built for quick understanding."
    },
    {
        title: "Role-aware workspaces",
        description: "Public users, officers, lawyers, and administrators can each move through a tailored view of the same system."
    },
    {
        title: "Secure access in one place",
        description: "Open login or registration in a focused card without losing the context of the home page."
    }
] as const;

const statItems = [
    {value: "01", label: "Unified incident intake"},
    {value: "02", label: "Secure role-based workflow"},
    {value: "03", label: "Modern evidence-friendly UI"}
] as const;

function Home() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [authNotice, setAuthNotice] = useState("");

    const authView = useMemo<AuthView | null>(() => {
        const authParam = searchParams.get("auth");
        return authParam === "login" || authParam === "register" ? authParam : null;
    }, [searchParams]);

    const openAuth = (view: AuthView, notice = "") => {
        setAuthNotice(notice);
        setSearchParams({auth: view});
    };

    const closeAuth = () => {
        setAuthNotice("");
        setSearchParams({});
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.24),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(45,212,191,0.18),transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_40%,#111827_100%)] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[120px_120px] mask-[radial-gradient(circle_at_center,black,transparent_80%)]" />
            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
                <header className="flex flex-col gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.28)] backdrop-blur md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">CrimeLog</p>
                        <p className="mt-2 text-sm text-slate-300">Secure case operations, incident intake, and role-aware coordination in one workspace.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100" onClick={() => openAuth("register")} type="button">
                            Open access
                        </button>
                        {hasAuthToken() ? (
                            <button className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15" onClick={() => navigate("/app")} type="button">
                                Open workspace
                            </button>
                        ) : null}
                    </div>
                </header>

                <main className="flex flex-1 items-center py-12 lg:py-16">
                    <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:items-center">
                        <section className="text-left">
                            <span className="inline-flex rounded-full border border-blue-300/15 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-blue-100">
                                Crime reporting and case visibility
                            </span>
                            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                                CrimeLog keeps reporting, review, and follow-up clear from the first screen.
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                                Submit reports, review updates, and move across operational workflows with a calm interface designed for serious case work.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100" onClick={() => openAuth("register")} type="button">
                                    Get started
                                </button>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {statItems.map((item) => (
                                    <div className="rounded-3xl border border-white/10 bg-white/6 px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.2)] backdrop-blur" key={item.label}>
                                        <p className="text-3xl font-semibold text-white">{item.value}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-4">
                            {featureCards.map((card, index) => (
                                <article
                                    className={`rounded-[28px] border border-white/10 bg-white/7 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.24)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 ${
                                        index === 1 ? "lg:translate-x-6" : ""
                                    }`}
                                    key={card.title}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Feature {index + 1}</p>
                                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{card.title}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                                </article>
                            ))}
                        </section>
                    </div>
                </main>
            </div>

            <AuthModal
                isOpen={authView !== null}
                onClose={closeAuth}
                size={authView === "register" ? "wide" : "compact"}
                subtitle={authView === "register"
                    ? "Use the tabs to move between registration and login whenever you need."
                    : "Use the tabs to switch to registration if you still need an account."}
                title={authView === "register" ? "Create your CrimeLog account" : "Sign in to CrimeLog"}
            >
                <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
                    <button
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${authView === "login" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
                        onClick={() => openAuth("login", authNotice)}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${authView === "register" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
                        onClick={() => openAuth("register")}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                {authView === "login" ? (
                    <Login
                        onSuccess={() => navigate("/app")}
                        statusMessage={authNotice}
                    />
                ) : null}

                {authView === "register" ? (
                    <Register
                        onSwitchToLogin={(message) => openAuth("login", message ?? "Account created. You can log in now.")}
                    />
                ) : null}
            </AuthModal>
        </div>
    )
}

export default Home;
