import {useEffect, useState, type FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import type {LoginRequest} from "../api/dtos/auth.ts";
import {login} from "../api/services/auth-services.ts";
import FormInput from "./form/FormInput.tsx";
import {useFormState} from "../hooks/form-field-update.ts";

interface LoginProps {
    onSuccess?: () => void;
    statusMessage?: string;
}

function Login({onSuccess, statusMessage}: LoginProps) {
    const navigate = useNavigate();
    const {form, updateField} = useFormState<LoginRequest>({
        email: "",
        password: ""
    });
    const [localStatusMessage, setLocalStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLocalStatusMessage(statusMessage ?? "");
    }, [statusMessage]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalStatusMessage("");
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const message = await login(form);
            setLocalStatusMessage(message);

            if (onSuccess) {
                onSuccess();
            } else {
                navigate("/app");
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md text-left">
            <div className="mb-6">
                <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-200">
                    CrimeLog
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Welcome back</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                    Sign in to review reports, follow case activity, and continue your work securely.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">Email</label>
                    <FormInput<LoginRequest>
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300 focus:bg-white/8 focus:ring-4 focus:ring-blue-400/15"
                        field="email"
                        id="email"
                        type="email"
                        update={updateField}
                        value={form.email}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">Password</label>
                    <FormInput<LoginRequest>
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300 focus:bg-white/8 focus:ring-4 focus:ring-blue-400/15"
                        field="password"
                        id="password"
                        type="password"
                        update={updateField}
                        value={form.password}
                    />
                </div>

                {errorMessage ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p> : null}
                {localStatusMessage ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{localStatusMessage}</p> : null}

                <button
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting ? "Signing in..." : "Log in"}
                </button>
            </form>
        </div>
    )
}

export default Login;
