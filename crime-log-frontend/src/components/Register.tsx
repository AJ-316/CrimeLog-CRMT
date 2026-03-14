import {useState, type FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {PersonDto} from "../api/dtos/personDto.ts";
import {register} from "../api/services/auth-services.ts";
import CredentialsSection from "./register/CredentialsSection.tsx";
import PersonSection from "./register/PersonSection.tsx";
import RoleSection from "./register/RoleSection.tsx";
import {
    buildRegisterRequest,
    createInitialRegisterForm,
    type CredentialFieldKey,
    type PersonAddressKey,
    type PersonScalarFieldKey,
    type RegisterFormDraft,
    type RegisterLawyerDraft,
    type RegisterOfficerDraft,
    type RegisterRole
} from "./register/register-types.ts";
import {
    validateBasicInfo,
    validateCredentials,
    validateRoleInfo,
    type ValidationErrors
} from "./register/register-validation.ts";

type RegisterStep = 1 | 2 | 3;

interface RegisterProps {
    onSwitchToLogin?: (message?: string) => void;
}

const registerSteps = [1, 2, 3] as const satisfies readonly RegisterStep[];

const stepDetails: Record<RegisterStep, { title: string; subtitle: string }> = {
    1: {
        title: "Basic info",
        subtitle: "Personal details and account role"
    },
    2: {
        title: "Role info",
        subtitle: "Fields required by the selected profile"
    },
    3: {
        title: "Credentials",
        subtitle: "Finish with email and password"
    }
};

function Register({onSwitchToLogin}: RegisterProps) {
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterFormDraft>(() => createInitialRegisterForm());
    const [step, setStep] = useState<RegisterStep>(1);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearErrors = (...keys: string[]) => {
        if (keys.length === 0) {
            return;
        }

        setErrors((previousErrors) => {
            const nextErrors = {...previousErrors};
            keys.forEach((key) => {
                delete nextErrors[key];
            });
            return nextErrors;
        });
    };

    const updateRole = (role: RegisterRole) => {
        setForm((previousForm) => ({
            ...previousForm,
            role
        }));
        clearErrors("role");
    };

    const updatePersonField = <K extends PersonScalarFieldKey>(field: K, value: PersonDto[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            personDto: {
                ...previousForm.personDto,
                [field]: value
            }
        }));
        clearErrors(`personDto.${String(field)}`);
    };

    const updatePersonAddress = <K extends keyof AddressDto>(section: PersonAddressKey, field: K, value: AddressDto[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            personDto: {
                ...previousForm.personDto,
                [section]: {
                    ...previousForm.personDto[section],
                    [field]: value
                }
            }
        }));
        clearErrors(`personDto.${section}.${String(field)}`);
    };

    const updateLawyerField = <K extends keyof RegisterLawyerDraft>(field: K, value: RegisterLawyerDraft[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            lawyerProfile: {
                ...previousForm.lawyerProfile,
                [field]: value
            }
        }));
        clearErrors(`lawyerProfile.${String(field)}`);
    };

    const updateLawyerOfficeAddress = <K extends keyof AddressDto>(field: K, value: AddressDto[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            lawyerProfile: {
                ...previousForm.lawyerProfile,
                officeAddress: {
                    ...previousForm.lawyerProfile.officeAddress,
                    [field]: value
                }
            }
        }));
        clearErrors(`lawyerProfile.officeAddress.${String(field)}`);
    };

    const updateOfficerField = <K extends keyof RegisterOfficerDraft>(field: K, value: RegisterOfficerDraft[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            officerProfile: {
                ...previousForm.officerProfile,
                [field]: value
            }
        }));
        clearErrors(`officerProfile.${String(field)}`);
    };

    const updateCredentialField = <K extends CredentialFieldKey>(field: K, value: RegisterFormDraft[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            [field]: value
        }));
        clearErrors(field);
        if (field === "password" || field === "confirmPassword") {
            clearErrors("confirmPassword");
        }
    };

    const goToNextStep = () => {
        const nextErrors = step === 1 ? validateBasicInfo(form) : validateRoleInfo(form);
        if (Object.keys(nextErrors).length > 0) {
            setErrors((previousErrors) => ({...previousErrors, ...nextErrors}));
            return;
        }

        setSubmitError("");
        setErrors({});
        setStep((previousStep) => (previousStep === 1 ? 2 : 3));
    };

    const goToPreviousStep = () => {
        setSubmitError("");
        setStep((previousStep) => (previousStep === 3 ? 2 : 1));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const basicErrors = validateBasicInfo(form);
        const roleErrors = validateRoleInfo(form);
        const credentialErrors = validateCredentials(form);
        const allErrors: ValidationErrors = {
            ...basicErrors,
            ...roleErrors,
            ...credentialErrors
        };

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            setSubmitError("");

            if (Object.keys(basicErrors).length > 0) {
                setStep(1);
            } else if (Object.keys(roleErrors).length > 0) {
                setStep(2);
            } else {
                setStep(3);
            }

            return;
        }

        setIsSubmitting(true);
        setSubmitError("");
        setSubmitSuccess("");

        try {
            const responseMessage = await register(buildRegisterRequest(form));
            // setPreferredRole(form.role);
            setSubmitSuccess(responseMessage);
            setErrors({});
            setStep(1);
            setForm(createInitialRegisterForm());
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwitchToLogin = () => {
        if (onSwitchToLogin) {
            onSwitchToLogin(submitSuccess || "Account created. You can log in now.");
            return;
        }

        navigate("/?auth=login");
    };

    return (
        <div className="mx-auto w-full max-w-4xl text-left text-white">
            <div className="mb-6">
                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                    CrimeLog
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">Create your account</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Share the details needed to open your account and route you to the right workspace.
                </p>
                <p className="mt-3 text-sm text-slate-400">
                    Already registered? Use the <span className="font-medium text-white">Login</span> tab above.
                </p>
            </div>

            <div className="mb-6 rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:overflow-x-auto pb-1">
                    {registerSteps.map((stepNumber, index) => {
                        const isActive = step === stepNumber;
                        const isComplete = step > stepNumber;

                        return (
                            <div className="flex min-w-0 flex-1 items-center gap-3" key={stepNumber}>
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                                        isActive
                                            ? "border-white bg-white text-slate-950"
                                            : isComplete
                                                ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                                                : "border-white/15 bg-white/5 text-slate-400"
                                    }`}>
                                        {stepNumber}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">{stepDetails[stepNumber].title}</p>
                                        <p className="truncate text-xs text-slate-400">{stepDetails[stepNumber].subtitle}</p>
                                    </div>
                                </div>
                                {index < registerSteps.length - 1 ? (
                                    <div className={`hidden h-px flex-1 rounded-full md:block ${isComplete ? "bg-emerald-300/60" : "bg-white/10"}`} />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.16)] sm:p-6">
                    {step === 1 ? (
                        <PersonSection
                            errors={errors}
                            onAddressChange={updatePersonAddress}
                            onPersonChange={updatePersonField}
                            onRoleChange={updateRole}
                            person={form.personDto}
                            role={form.role}
                        />
                    ) : null}

                    {step === 2 ? (
                        <RoleSection
                            errors={errors}
                            lawyerProfile={form.lawyerProfile}
                            officerProfile={form.officerProfile}
                            onLawyerChange={updateLawyerField}
                            onLawyerOfficeAddressChange={updateLawyerOfficeAddress}
                            onOfficerChange={updateOfficerField}
                            role={form.role}
                        />
                    ) : null}

                    {step === 3 ? (
                        <CredentialsSection
                            confirmPassword={form.confirmPassword}
                            email={form.email}
                            errors={errors}
                            onCredentialChange={updateCredentialField}
                            password={form.password}
                        />
                    ) : null}
                </div>

                {submitError ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {submitError}
                    </div>
                ) : null}

                {submitSuccess ? (
                    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100 sm:flex-row sm:items-center sm:justify-between">
                        <span>{submitSuccess}</span>
                        <button className="rounded-xl border border-emerald-300/30 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/15" onClick={handleSwitchToLogin} type="button">
                            Continue to login
                        </button>
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={step === 1 || isSubmitting}
                        onClick={goToPreviousStep}
                        type="button"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                            onClick={goToNextStep}
                            type="button"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Register;
