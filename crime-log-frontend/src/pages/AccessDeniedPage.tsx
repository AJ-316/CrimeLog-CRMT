import {Link, useLocation} from "react-router-dom";

export default function AccessDeniedPage() {
    const location = useLocation();
    const attemptedPath = typeof location.state?.from === "string" ? location.state.from : null;

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">Access denied</p>
                <h1 className="mt-3 text-2xl font-semibold text-slate-900">You do not have permission to open this page.</h1>
                <p className="mt-3 text-sm text-slate-600">
                    This route is restricted for your current role. Use your role navigation to continue.
                </p>
                {attemptedPath ? (
                    <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        Attempted route: <span className="font-medium text-slate-900">{attemptedPath}</span>
                    </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/app">
                        Back to dashboard
                    </Link>
                    <Link className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" to="/">
                        Go to home
                    </Link>
                </div>
            </section>
        </main>
    );
}

