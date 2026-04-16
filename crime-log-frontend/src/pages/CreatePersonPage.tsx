import {useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {PersonDto} from "../api/dtos/personDto.ts";
import {createPerson} from "../api/services/person-services.ts";
import {GenderOptions} from "../api/types.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    PageHeader,
    SectionCard,
    inputClassName,
    primaryButtonClassName,
    secondaryButtonClassName
} from "../components/app/WorkspaceUi.tsx";
import {readImageFileAsBase64} from "../utils/file-upload.ts";

const phonePattern = /^\+?[1-9]\d{1,14}$/;

const createEmptyAddress = (): AddressDto => ({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: ""
});

const createInitialPerson = (): PersonDto => ({
    nationalId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    profilePhotoPath: "images/profiles/default-profile.png",
    profilePhotoData: null,
    profilePhotoContentType: null,
    dateOfBirth: "",
    gender: "MALE",
    nationalityCode: "",
    birthPlace: createEmptyAddress(),
    permanentAddress: createEmptyAddress(),
    currentAddress: createEmptyAddress(),
    contactPrimary: "",
    contactSecondary: null
});

export default function CreatePersonPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();
    const [form, setForm] = useState<PersonDto>(createInitialPerson());
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAuthorized = role === "ADMIN" || role === "OFFICER";

    const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const setField = <K extends keyof PersonDto>(field: K, value: PersonDto[K]) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const setAddressField = (section: "birthPlace" | "permanentAddress" | "currentAddress", field: keyof AddressDto, value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [section]: {
                ...currentForm[section],
                [field]: value
            }
        }));
    };

    const handleProfilePhotoChange = async (file: File | null) => {
        if (!file) {
            setField("profilePhotoData", null);
            setField("profilePhotoContentType", null);
            return;
        }

        const uploadedImage = await readImageFileAsBase64(file);
        setField("profilePhotoData", uploadedImage.base64Data);
        setField("profilePhotoContentType", uploadedImage.contentType);
    };

    const validate = (): Record<string, string> => {
        const nextErrors: Record<string, string> = {};
        const requiredScalarFields: Array<[keyof PersonDto, string]> = [
            ["nationalId", "National ID"],
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["dateOfBirth", "Date of birth"],
            ["nationalityCode", "Nationality code"],
            ["contactPrimary", "Primary contact"]
        ];

        requiredScalarFields.forEach(([field, label]) => {
            const value = form[field];
            if (typeof value === "string" && value.trim().length === 0) {
                nextErrors[field] = `${label} is required.`;
            }
        });

        if (form.dateOfBirth && form.dateOfBirth > maxDate) {
            nextErrors.dateOfBirth = "Date of birth cannot be in the future.";
        }

        if (form.contactPrimary && !phonePattern.test(form.contactPrimary.trim())) {
            nextErrors.contactPrimary = "Use international format like +919876543210.";
        }

        if (form.contactSecondary && form.contactSecondary.trim() && !phonePattern.test(form.contactSecondary.trim())) {
            nextErrors.contactSecondary = "Use international format like +919876543210.";
        }

        (["birthPlace", "permanentAddress", "currentAddress"] as const).forEach((section) => {
            const sectionLabel =
                section === "birthPlace"
                    ? "Birth place"
                    : section === "permanentAddress"
                        ? "Permanent address"
                        : "Current address";

            (["street", "city", "state", "postalCode", "countryCode"] as const).forEach((field) => {
                if (!form[section][field].trim()) {
                    nextErrors[`${section}.${field}`] = `${sectionLabel} ${field === "postalCode" ? "postal code" : field === "countryCode" ? "country code" : field} is required.`;
                }
            });
        });

        return nextErrors;
    };

    const normalizeAddress = (address: AddressDto): AddressDto => ({
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        postalCode: address.postalCode.trim(),
        countryCode: address.countryCode.trim().toUpperCase()
    });

    const buildPayload = (): PersonDto => ({
        ...form,
        nationalId: form.nationalId.trim(),
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        profilePhotoPath: form.profilePhotoPath.trim() || "images/profiles/default-profile.png",
        profilePhotoData: form.profilePhotoData?.trim() ? form.profilePhotoData.trim() : null,
        profilePhotoContentType: form.profilePhotoContentType?.trim() ? form.profilePhotoContentType.trim() : null,
        nationalityCode: form.nationalityCode.trim().toUpperCase(),
        birthPlace: normalizeAddress(form.birthPlace),
        permanentAddress: normalizeAddress(form.permanentAddress),
        currentAddress: normalizeAddress(form.currentAddress),
        contactPrimary: form.contactPrimary.trim(),
        contactSecondary: form.contactSecondary?.trim() ? form.contactSecondary.trim() : null
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await createPerson(buildPayload());
            navigate("/app/people", {replace: true});
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to create person");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthorized) {
        return (
            <section className="space-y-6">
                <PageHeader
                    actions={<Link className={secondaryButtonClassName} to="/app/people">Back to people</Link>}
                    description="Only admin and officer roles can register people in the database."
                    eyebrow="Access"
                    title="Add person"
                />
                <EmptyState
                    description="Your current role is not permitted to register person records."
                    title="Access denied"
                />
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <PageHeader
                actions={<Link className={secondaryButtonClassName} to="/app/people">Back to people</Link>}
                description="Register a person profile so officers and admins can link accurate identity records to FIRs and case workflows."
                eyebrow="Person registry"
                title="Add person"
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
                <SectionCard description="Core identity and contact details for the person record." title="Identity details">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <label className="block text-sm font-medium text-slate-700">
                            National ID
                            <input className={inputClassName} onChange={(event) => setField("nationalId", event.target.value)} value={form.nationalId} />
                            {errors.nationalId ? <p className="mt-2 text-xs text-rose-600">{errors.nationalId}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            First name
                            <input className={inputClassName} onChange={(event) => setField("firstName", event.target.value)} value={form.firstName} />
                            {errors.firstName ? <p className="mt-2 text-xs text-rose-600">{errors.firstName}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Middle name
                            <input className={inputClassName} onChange={(event) => setField("middleName", event.target.value)} value={form.middleName} />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Last name
                            <input className={inputClassName} onChange={(event) => setField("lastName", event.target.value)} value={form.lastName} />
                            {errors.lastName ? <p className="mt-2 text-xs text-rose-600">{errors.lastName}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Date of birth
                            <input className={inputClassName} max={maxDate} onChange={(event) => setField("dateOfBirth", event.target.value)} type="date" value={form.dateOfBirth} />
                            {errors.dateOfBirth ? <p className="mt-2 text-xs text-rose-600">{errors.dateOfBirth}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Gender
                            <select className={inputClassName} onChange={(event) => setField("gender", event.target.value as PersonDto["gender"])} value={form.gender}>
                                {GenderOptions.map((gender) => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Nationality code
                            <input className={inputClassName} maxLength={2} onChange={(event) => setField("nationalityCode", event.target.value)} placeholder="IN" value={form.nationalityCode} />
                            {errors.nationalityCode ? <p className="mt-2 text-xs text-rose-600">{errors.nationalityCode}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Primary contact
                            <input className={inputClassName} onChange={(event) => setField("contactPrimary", event.target.value)} placeholder="+919876543210" value={form.contactPrimary} />
                            {errors.contactPrimary ? <p className="mt-2 text-xs text-rose-600">{errors.contactPrimary}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Secondary contact (optional)
                            <input className={inputClassName} onChange={(event) => setField("contactSecondary", event.target.value || null)} placeholder="+919876543210" value={form.contactSecondary ?? ""} />
                            {errors.contactSecondary ? <p className="mt-2 text-xs text-rose-600">{errors.contactSecondary}</p> : null}
                        </label>
                        <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                            Profile photo
                            <input accept="image/*" className={inputClassName} onChange={(event) => void handleProfilePhotoChange(event.target.files?.[0] ?? null)} type="file" />
                            <p className="mt-2 text-xs text-slate-500">Upload a photo to store it with the person record in the database.</p>
                        </label>
                    </div>
                </SectionCard>

                {([
                    ["birthPlace", "Birth place"],
                    ["permanentAddress", "Permanent address"],
                    ["currentAddress", "Current address"]
                ] as const).map(([section, title]) => (
                    <SectionCard description={`Enter ${title.toLowerCase()} details.`} key={section} title={title}>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {(["street", "city", "state", "postalCode", "countryCode"] as const).map((field) => {
                                const key = `${section}.${field}`;
                                const label = field === "postalCode" ? "Postal code" : field === "countryCode" ? "Country code" : field.charAt(0).toUpperCase() + field.slice(1);
                                return (
                                    <label className="block text-sm font-medium text-slate-700" key={field}>
                                        {label}
                                        <input
                                            className={inputClassName}
                                            onChange={(event) => setAddressField(section, field, event.target.value)}
                                            value={form[section][field]}
                                        />
                                        {errors[key] ? <p className="mt-2 text-xs text-rose-600">{errors[key]}</p> : null}
                                    </label>
                                );
                            })}
                        </div>
                    </SectionCard>
                ))}

                {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

                <div className="flex flex-wrap gap-3">
                    <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating person" : "Create person"}
                    </button>
                    <Link className={secondaryButtonClassName} to="/app/people">Cancel</Link>
                </div>
            </form>
        </section>
    );
}
