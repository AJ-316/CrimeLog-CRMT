import {useState, type FormEvent} from "react";
import type {LoginRequest} from "../api/dtos/auth.ts";
import {login} from "../api/services/auth-services.ts";
import FormInput from "./form/FormInput.tsx";
import {useFormState} from "../hooks/form-field-update.ts";

function Login() {
    const {form, updateField} = useFormState<LoginRequest>({
        email: "",
        password: ""
    });
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatusMessage("");
        setErrorMessage("");

        try {
            const message = await login(form);
            setStatusMessage(message);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Login failed");
        }
    };

    return (
        <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Login</h1>
            <p className="mb-6 text-gray-600">Please enter your credentials to log in.</p>

            <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-2 block text-left text-gray-700" htmlFor="email">Email</label>
                    <FormInput<LoginRequest>
                        className="w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
                        field="email"
                        id="email"
                        type="email"
                        update={updateField}
                        value={form.email}
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-2 block text-left text-gray-700" htmlFor="password">Password</label>
                    <FormInput<LoginRequest>
                        className="w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
                        field="password"
                        id="password"
                        type="password"
                        update={updateField}
                        value={form.password}
                    />
                </div>

                {errorMessage ? <p className="mb-4 text-left text-sm text-red-600">{errorMessage}</p> : null}
                {statusMessage ? <p className="mb-4 text-left text-sm text-green-600">{statusMessage}</p> : null}

                <button className="w-full rounded bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600" type="submit">
                    Log In
                </button>
            </form>

        </div>
    )
}

export default Login;