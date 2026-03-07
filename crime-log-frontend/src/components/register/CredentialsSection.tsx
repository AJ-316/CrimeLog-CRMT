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
        <div className="space-y-5 text-left">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Step 3</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Account credentials</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                    Finish the registration with the email and password used to access CrimeLog.
                </p>
            </div>

            <div className="grid gap-4">
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
