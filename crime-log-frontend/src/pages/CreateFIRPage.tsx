import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {FirRegisterRequest} from "../api/dtos/fir.ts";
import {createFir} from "../api/services/fir-services.ts";
import {getDepartmentUnits} from "../api/services/reference-services.ts";
import type {DepartmentUnitOptionDto} from "../api/dtos/reference.ts";
import {FirTypeOptions} from "../api/types.ts";
import {PageHeader, SectionCard, inputClassName, primaryButtonClassName, secondaryButtonClassName, textareaClassName} from "../components/app/WorkspaceUi.tsx";
import WorkspaceFormField from "../components/form/WorkspaceFormField.tsx";
import {useFormState} from "../hooks/form-field-update.ts";
import {getSessionUserId} from "../utils/auth-session.ts";

const createEmptyAddress = (): AddressDto => ({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: ""
});

const toInputDateTimeValue = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function CreateFIRPage() {
    const navigate = useNavigate();
    const [units, setUnits] = useState<DepartmentUnitOptionDto[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const userId = getSessionUserId();

    const initialState = useMemo<FirRegisterRequest>(() => ({
        firNumber: "",
        firType: "REGULAR",
        registrationDateTime: toInputDateTimeValue(new Date()),
        accusedFirstName: "",
        accusedMiddleName: "",
        accusedLastName: "",
        accusedContact: "",
        accusedDescription: "",
        accusedAddress: createEmptyAddress(),
        initialInvestigatingUnitId: 0,
        officerIdCreatedBy: userId ?? 0,
        incidentPlace: createEmptyAddress(),
        incidentDateTime: toInputDateTimeValue(new Date()),
        incidentDescription: ""
    }), [userId]);

    const {form, updateField, setForm} = useFormState<FirRegisterRequest>(initialState);

    useEffect(() => {
        const loadUnits = async () => {
            try {
                setUnits(await getDepartmentUnits());
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load department units");
            }
        };

        void loadUnits();
    }, []);

    const updateAddress = (section: "accusedAddress" | "incidentPlace", field: keyof AddressDto, value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [section]: {
                ...currentForm[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userId) {
            setError("Unable to determine the signed-in officer.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await createFir({...form, officerIdCreatedBy: userId});
            navigate("/app/fir");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to create FIR");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                actions={<Link className={secondaryButtonClassName} to="/app/fir">Back to FIRs</Link>}
                description="Register a new FIR with the reporting details, accused information, incident place, and the unit that should investigate first."
                eyebrow="Officer FIR Module"
                title="Create FIR"
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
                <SectionCard description="Record the main FIR metadata before adding accused and incident details." title="FIR registration">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <WorkspaceFormField field="firNumber" label="FIR number" required update={updateField} value={form.firNumber} />
                        <label className="block text-sm font-medium text-slate-700">
                            FIR type
                            <select className={inputClassName} onChange={(event) => updateField("firType", event.target.value as FirRegisterRequest["firType"])} value={form.firType}>
                                {FirTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </label>
                        <WorkspaceFormField field="registrationDateTime" label="Registration date and time" required type="datetime-local" update={updateField} value={form.registrationDateTime} />
                        <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                            Initial investigating unit
                            <select className={inputClassName} onChange={(event) => updateField("initialInvestigatingUnitId", Number(event.target.value))} value={form.initialInvestigatingUnitId || ""}>
                                <option value="">Select a department unit</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name} • {unit.agencyName}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </SectionCard>

                <SectionCard description="Capture the accused identity and address visible on this FIR." title="Accused details">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <WorkspaceFormField field="accusedFirstName" label="First name" required update={updateField} value={form.accusedFirstName} />
                        <WorkspaceFormField field="accusedMiddleName" label="Middle name" update={updateField} value={form.accusedMiddleName} />
                        <WorkspaceFormField field="accusedLastName" label="Last name" required update={updateField} value={form.accusedLastName} />
                        <WorkspaceFormField field="accusedContact" label="Contact number" required update={updateField} value={form.accusedContact} />
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {(["street", "city", "state", "postalCode", "countryCode"] as const).map((field) => (
                            <label className="block text-sm font-medium text-slate-700" key={field}>
                                {field === "postalCode" ? "Postal code" : field === "countryCode" ? "Country code" : field.charAt(0).toUpperCase() + field.slice(1)}
                                <input className={inputClassName} onChange={(event) => updateAddress("accusedAddress", field, event.target.value)} value={form.accusedAddress[field]} />
                            </label>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard description="Describe when the incident happened, where it took place, and what was reported." title="Incident details">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <WorkspaceFormField field="incidentDateTime" label="Incident date and time" required type="datetime-local" update={updateField} value={form.incidentDateTime} />
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {(["street", "city", "state", "postalCode", "countryCode"] as const).map((field) => (
                            <label className="block text-sm font-medium text-slate-700" key={field}>
                                {field === "postalCode" ? "Postal code" : field === "countryCode" ? "Country code" : field.charAt(0).toUpperCase() + field.slice(1)}
                                <input className={inputClassName} onChange={(event) => updateAddress("incidentPlace", field, event.target.value)} value={form.incidentPlace[field]} />
                            </label>
                        ))}
                    </div>
                    <label className="mt-5 block text-sm font-medium text-slate-700">
                        Incident description
                        <textarea className={textareaClassName} onChange={(event) => updateField("incidentDescription", event.target.value)} value={form.incidentDescription} />
                    </label>
                </SectionCard>

                {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

                <div className="flex flex-wrap gap-3">
                    <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating FIR" : "Create FIR"}
                    </button>
                    <Link className={secondaryButtonClassName} to="/app/fir">Cancel</Link>
                </div>
            </form>
        </section>
    );
}

