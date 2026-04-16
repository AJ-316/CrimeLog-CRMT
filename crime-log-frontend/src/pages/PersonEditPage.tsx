import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router-dom";
import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {PersonDto} from "../api/dtos/personDto.ts";
import {getPerson, updatePerson} from "../api/services/person-services.ts";
import {GenderOptions} from "../api/types.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
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

const normalizeAddress = (address: AddressDto): AddressDto => ({
    street: address.street.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
    countryCode: address.countryCode.trim().toUpperCase()
});

const buildPayload = (person: PersonDto): PersonDto => ({
    ...person,
    nationalId: person.nationalId.trim(),
    firstName: person.firstName.trim(),
    middleName: person.middleName.trim(),
    lastName: person.lastName.trim(),
    profilePhotoPath: person.profilePhotoPath.trim() || "images/profiles/default-profile.png",
    profilePhotoData: person.profilePhotoData?.trim() ? person.profilePhotoData.trim() : null,
    profilePhotoContentType: person.profilePhotoContentType?.trim() ? person.profilePhotoContentType.trim() : null,
    nationalityCode: person.nationalityCode.trim().toUpperCase(),
    birthPlace: normalizeAddress(person.birthPlace),
    permanentAddress: normalizeAddress(person.permanentAddress),
    currentAddress: normalizeAddress(person.currentAddress),
    contactPrimary: person.contactPrimary.trim(),
    contactSecondary: person.contactSecondary?.trim() ? person.contactSecondary.trim() : null
});

const validateForm = (person: PersonDto): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (!person.nationalId.trim()) nextErrors.nationalId = "National ID is required.";
    if (!person.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!person.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!person.dateOfBirth.trim()) nextErrors.dateOfBirth = "Date of birth is required.";
    if (!person.nationalityCode.trim()) nextErrors.nationalityCode = "Nationality code is required.";
    if (!person.contactPrimary.trim()) nextErrors.contactPrimary = "Primary contact is required.";

    if (person.contactPrimary.trim() && !phonePattern.test(person.contactPrimary.trim())) {
        nextErrors.contactPrimary = "Use international format like +919876543210.";
    }

    if (person.contactSecondary?.trim() && !phonePattern.test(person.contactSecondary.trim())) {
        nextErrors.contactSecondary = "Use international format like +919876543210.";
    }

    return nextErrors;
};

export default function PersonEditPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();
    const {personId: personIdParam} = useParams();
    const [searchParams] = useSearchParams();

    const [personForm, setPersonForm] = useState<PersonDto>(createInitialPerson());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const personId = Number(personIdParam);
    const suspectOnly = searchParams.get("mode") === "suspect";

    const canManagePeople = role === "ADMIN" || role === "OFFICER";

    const redirectToDetails = useMemo(
        () => `/app/people/${personId}${suspectOnly ? "?mode=suspect" : ""}`,
        [personId, suspectOnly]
    );

    const setField = <K extends keyof PersonDto>(field: K, value: PersonDto[K]) => {
        setPersonForm((currentValue) => ({...currentValue, [field]: value}));
    };

    const setAddressField = (
        section: "birthPlace" | "permanentAddress" | "currentAddress",
        field: keyof AddressDto,
        value: string
    ) => {
        setPersonForm((currentValue) => ({
            ...currentValue,
            [section]: {
                ...currentValue[section],
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

    useEffect(() => {
        if (!Number.isInteger(personId) || personId <= 0) {
            setError("Invalid person ID.");
            setIsLoading(false);
            return;
        }

        if (!canManagePeople) {
            setError("You are not authorized to edit person details.");
            setIsLoading(false);
            return;
        }

        const loadPerson = async () => {
            try {
                setIsLoading(true);
                setError("");
                const person = await getPerson(personId);
                setPersonForm(person);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load person details");
            } finally {
                setIsLoading(false);
            }
        };

        void loadPerson();
    }, [canManagePeople, personId]);

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateForm(personForm);
        setFormErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            await updatePerson(personId, buildPayload(personForm));
            navigate(redirectToDetails, {replace: true});
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Failed to update person");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                actions={<Link className={secondaryButtonClassName} to={redirectToDetails}>Back to person details</Link>}
                description="Update every person field in one dedicated edit screen, including profile image, contacts, and address records."
                eyebrow="Person profile"
                title="Edit person"
            />

            {isLoading ? <LoadingBlock label="Loading person profile" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to open edit screen" /> : null}

            {!isLoading && !error ? (
                <form onSubmit={handleSave}>
                    <SectionCard description="Edit all personal details and save changes." title="Person information">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <label className="block text-sm font-medium text-slate-700">
                                National ID
                                <input className={inputClassName} readOnly value={personForm.nationalId} />
                                <p className="mt-2 text-xs text-slate-500">National ID cannot be edited.</p>
                                {formErrors.nationalId ? <p className="mt-2 text-xs text-rose-600">{formErrors.nationalId}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                First name
                                <input className={inputClassName} onChange={(event) => setField("firstName", event.target.value)} value={personForm.firstName} />
                                {formErrors.firstName ? <p className="mt-2 text-xs text-rose-600">{formErrors.firstName}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Middle name
                                <input className={inputClassName} onChange={(event) => setField("middleName", event.target.value)} value={personForm.middleName} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Last name
                                <input className={inputClassName} onChange={(event) => setField("lastName", event.target.value)} value={personForm.lastName} />
                                {formErrors.lastName ? <p className="mt-2 text-xs text-rose-600">{formErrors.lastName}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Date of birth
                                <input className={inputClassName} onChange={(event) => setField("dateOfBirth", event.target.value)} type="date" value={personForm.dateOfBirth} />
                                {formErrors.dateOfBirth ? <p className="mt-2 text-xs text-rose-600">{formErrors.dateOfBirth}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Gender
                                <select className={inputClassName} onChange={(event) => setField("gender", event.target.value as PersonDto["gender"])} value={personForm.gender}>
                                    {GenderOptions.map((gender) => (
                                        <option key={gender} value={gender}>{gender}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Nationality code
                                <input className={inputClassName} onChange={(event) => setField("nationalityCode", event.target.value)} value={personForm.nationalityCode} />
                                {formErrors.nationalityCode ? <p className="mt-2 text-xs text-rose-600">{formErrors.nationalityCode}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Primary contact
                                <input className={inputClassName} onChange={(event) => setField("contactPrimary", event.target.value)} value={personForm.contactPrimary} />
                                {formErrors.contactPrimary ? <p className="mt-2 text-xs text-rose-600">{formErrors.contactPrimary}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Secondary contact
                                <input className={inputClassName} onChange={(event) => setField("contactSecondary", event.target.value || null)} value={personForm.contactSecondary ?? ""} />
                                {formErrors.contactSecondary ? <p className="mt-2 text-xs text-rose-600">{formErrors.contactSecondary}</p> : null}
                            </label>
                            <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                                Profile photo
                                <input accept="image/*" className={inputClassName} onChange={(event) => void handleProfilePhotoChange(event.target.files?.[0] ?? null)} type="file" />
                            </label>
                        </div>

                        {([
                            ["birthPlace", "Birth place"],
                            ["permanentAddress", "Permanent address"],
                            ["currentAddress", "Current address"]
                        ] as const).map(([section, title]) => (
                            <div className="mt-6" key={section}>
                                <p className="text-sm font-semibold text-slate-900">{title}</p>
                                <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {(["street", "city", "state", "postalCode", "countryCode"] as const).map((field) => (
                                        <label className="block text-sm font-medium text-slate-700" key={field}>
                                            {field}
                                            <input
                                                className={inputClassName}
                                                onChange={(event) => setAddressField(section, field, event.target.value)}
                                                value={personForm[section][field]}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button className={primaryButtonClassName} disabled={isSaving} type="submit">
                                {isSaving ? "Saving" : "Save changes"}
                            </button>
                            <Link className={secondaryButtonClassName} to={redirectToDetails}>
                                Cancel
                            </Link>
                        </div>
                    </SectionCard>
                </form>
            ) : null}
        </section>
    );
}
