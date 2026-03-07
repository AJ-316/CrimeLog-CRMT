import {useState, type FormEvent} from "react";
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

const registerSteps = [1, 2, 3] as const satisfies readonly RegisterStep[];

const stepDetails: Record<RegisterStep, { title: string; subtitle: string }> = {
    1: {
        title: "Basic info",
        subtitle: "Collect the nested person DTO and the target role."
    },
    2: {
        title: "Role info",
        subtitle: "Show only the fields required for the chosen role."
    },
    3: {
        title: "Credentials",
        subtitle: "Finish with email, password, and confirmation."
    }
};

function Register() {
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

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Register</h1>
                <p className="mt-2 text-slate-600">
                    Complete the three-stage form to submit the exact DTO structure required by the backend.
                </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                {registerSteps.map((stepNumber) => {
                    const isActive = step === stepNumber;
                    const isComplete = step > stepNumber;

                    return (
                        <div
                            className={`rounded-xl border p-4 text-left ${
                                isActive
                                    ? "border-blue-500 bg-blue-50"
                                    : isComplete
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-slate-200 bg-white"
                            }`}
                            key={stepNumber}
                        >
                            <p className="text-sm font-semibold text-slate-500">Step {stepNumber}</p>
                            <h2 className="mt-1 text-lg font-semibold text-slate-800">{stepDetails[stepNumber].title}</h2>
                            <p className="mt-1 text-sm text-slate-600">{stepDetails[stepNumber].subtitle}</p>
                        </div>
                    );
                })}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
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

                {submitError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                    </div>
                ) : null}

                {submitSuccess ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {submitSuccess}
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                        className="rounded border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={step === 1 || isSubmitting}
                        onClick={goToPreviousStep}
                        type="button"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                            onClick={goToNextStep}
                            type="button"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
