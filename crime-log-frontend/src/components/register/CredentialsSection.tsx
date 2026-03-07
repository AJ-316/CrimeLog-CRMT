import RegisterField from "./RegisterField.tsx";

interface CredentialsSectionProps {
    email: string;
    password: string;
    confirmPassword: string;
    errors: Record<string, string>;
    onCredentialChange: (field: "email" | "password" | "confirmPassword", value: string) => void;
}

export default function CredentialsSection({
    email,
    password,
    confirmPassword,
    errors,
    onCredentialChange
}: CredentialsSectionProps) {
    return (
        <div className="rounded-xl border border-slate-200 p-4 text-left">
            <h2 className="text-lg font-semibold text-slate-800">Account credentials</h2>
            <p className="mt-1 text-sm text-slate-500">
                Choose the email and password that will be used to log in.
            </p>

            <div className="mt-4 grid gap-4">
                <RegisterField
                    error={errors.email}
                    id="email"
                    label="Email"
                    onChange={(value) => onCredentialChange("email", value)}
                    required
                    type="email"
                    value={email}
                />
                <RegisterField
                    error={errors.password}
                    id="password"
                    label="Password"
                    onChange={(value) => onCredentialChange("password", value)}
                    required
                    type="password"
                    value={password}
                />
                <RegisterField
                    error={errors.confirmPassword}
                    id="confirmPassword"
                    label="Re-enter password"
                    onChange={(value) => onCredentialChange("confirmPassword", value)}
                    required
                    type="password"
                    value={confirmPassword}
                />
            </div>
        </div>
    );
}

