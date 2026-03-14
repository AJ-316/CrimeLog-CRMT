import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {FirRegisterRequest} from "../api/dtos/fir.ts";
import {createFir} from "../api/services/fir-services.ts";
import {getDepartmentUnits} from "../api/services/reference-services.ts";
import type {DepartmentUnitOptionDto} from "../api/dtos/reference.ts";
import {FirTypeOptions} from "../api/types.ts";
import {LoadingBlock, PageHeader, SectionCard, inputClassName, primaryButtonClassName, secondaryButtonClassName, textareaClassName} from "../components/app/WorkspaceUi.tsx";
import {getCurrentOfficerProfile} from "../api/services/officer-services.ts";
import WorkspaceFormField from "../components/form/WorkspaceFormField.tsx";
import {useFormState} from "../hooks/form-field-update.ts";
import {getSessionUserId} from "../utils/auth-session.ts";
import {getCountryOptions, getStateOptions, getCityOptions} from "../utils/location-data.ts";

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
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [includeAccusedAddress, setIncludeAccusedAddress] = useState(false);
    const [includeIncidentAddress, setIncludeIncidentAddress] = useState(false);
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
        incidentDateTime: "",
        incidentDescription: ""
    }), [userId]);

    const {form, updateField, setForm} = useFormState<FirRegisterRequest>(initialState);

    const countryOptions = useMemo(() => getCountryOptions(), []);
    const accusedStates = useMemo(() => getStateOptions(form.accusedAddress?.countryCode ?? ""), [form.accusedAddress?.countryCode]);
    const accusedCities = useMemo(() => getCityOptions(form.accusedAddress?.countryCode ?? "", form.accusedAddress?.state ?? ""), [form.accusedAddress?.countryCode, form.accusedAddress?.state]);
    const incidentStates = useMemo(() => getStateOptions(form.incidentPlace?.countryCode ?? ""), [form.incidentPlace?.countryCode]);
    const incidentCities = useMemo(() => getCityOptions(form.incidentPlace?.countryCode ?? "", form.incidentPlace?.state ?? ""), [form.incidentPlace?.countryCode, form.incidentPlace?.state]);

    useEffect(() => {
        const loadAccessContext = async () => {
            try {
                const [profile, allUnits] = await Promise.all([getCurrentOfficerProfile(), getDepartmentUnits()]);
                setUnits(allUnits.filter((unit) => unit.id === profile.departmentUnitId));

                if (profile.unitType !== "POLICE_STATION") {
                    navigate("/access-denied", {replace: true, state: {from: "/app/fir/new"}});
                    return;
                }

                setForm((current) => ({
                    ...current,
                    initialInvestigatingUnitId: profile.departmentUnitId
                }));
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load officer profile");
            } finally {
                setIsCheckingAccess(false);
            }
        };

        void loadAccessContext();
    }, [navigate, setForm]);

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

        if (!form.initialInvestigatingUnitId) {
            setError("Officer posting unit is required for FIR creation.");
            return;
        }

        const payload: FirRegisterRequest = {
            firNumber: form.firNumber.trim(),
            firType: form.firType,
            registrationDateTime: form.registrationDateTime,
            accusedFirstName: form.accusedFirstName?.trim() || null,
            accusedMiddleName: form.accusedMiddleName?.trim() || null,
            accusedLastName: form.accusedLastName?.trim() || null,
            accusedContact: form.accusedContact?.trim() || null,
            accusedDescription: form.accusedDescription?.trim() || null,
            initialInvestigatingUnitId: form.initialInvestigatingUnitId,
            officerIdCreatedBy: userId,
            incidentDateTime: form.incidentDateTime || null,
            incidentDescription: form.incidentDescription?.trim() || null
        };

        if (includeAccusedAddress) {
            payload.accusedAddress = {
                ...form.accusedAddress,
                countryCode: form.accusedAddress?.countryCode ?? ""
            };
        } else {
            payload.accusedAddress = null;
        }

        if (includeIncidentAddress) {
            payload.incidentPlace = {
                ...form.incidentPlace,
                countryCode: form.incidentPlace?.countryCode ?? ""
            };
        } else {
            payload.incidentPlace = null;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await createFir(payload);
            navigate("/app/fir");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to create FIR");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            {isCheckingAccess ? <LoadingBlock label="Checking officer access" /> : null}
            {!isCheckingAccess ? (
            <>
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
                            <select className={inputClassName} onChange={(event) => updateField("firType", event.target.value as FirRegisterRequest["firType"])} required value={form.firType}>
                                {FirTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </label>
                        <WorkspaceFormField field="registrationDateTime" label="Registration date and time" required type="datetime-local" update={updateField} value={form.registrationDateTime} />
                        <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                            Initial investigating unit
                            <select className={inputClassName} disabled required value={form.initialInvestigatingUnitId || ""}>
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
                        <WorkspaceFormField field="accusedFirstName" label="First name" update={updateField} value={form.accusedFirstName ?? ""} />
                        <WorkspaceFormField field="accusedMiddleName" label="Middle name" update={updateField} value={form.accusedMiddleName ?? ""} />
                        <WorkspaceFormField field="accusedLastName" label="Last name" update={updateField} value={form.accusedLastName ?? ""} />
                        <WorkspaceFormField field="accusedContact" label="Contact number" pattern="\\+?[1-9]\\d{1,14}" placeholder="+911234567890" title="International format: + followed by digits" update={updateField} value={form.accusedContact ?? ""} />
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-sm text-slate-700">
                        <input checked={includeAccusedAddress} className="h-4 w-4" id="toggle-accused-address" onChange={(event) => {
                            setIncludeAccusedAddress(event.target.checked);
                            if (!event.target.checked) {
                                setForm((current) => ({...current, accusedAddress: createEmptyAddress()}));
                            }
                        }} type="checkbox" />
                        <label className="font-medium" htmlFor="toggle-accused-address">Add accused address (optional)</label>
                    </div>
                    {includeAccusedAddress ? (
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Country / Nationality
                                <select className={inputClassName} onChange={(event) => {
                                    updateAddress("accusedAddress", "countryCode", event.target.value);
                                    updateAddress("accusedAddress", "state", "");
                                    updateAddress("accusedAddress", "city", "");
                                }} required={includeAccusedAddress} value={form.accusedAddress?.countryCode || ""}>
                                    <option value="">Select country</option>
                                    {countryOptions.map((country) => (
                                        <option key={country.code} value={country.code}>{country.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                State / Province
                                <select className={inputClassName} disabled={!form.accusedAddress?.countryCode} onChange={(event) => {
                                    updateAddress("accusedAddress", "state", event.target.value);
                                    updateAddress("accusedAddress", "city", "");
                                }} required={includeAccusedAddress} value={form.accusedAddress?.state || ""}>
                                    <option value="">Select state</option>
                                    {accusedStates.map((state) => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                City
                                <select className={inputClassName} disabled={!form.accusedAddress?.state} onChange={(event) => updateAddress("accusedAddress", "city", event.target.value)} required={includeAccusedAddress} value={form.accusedAddress?.city || ""}>
                                    <option value="">Select city</option>
                                    {accusedCities.map((city) => (
                                        <option key={city.code} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Street
                                <input className={inputClassName} disabled={!form.accusedAddress?.countryCode} onChange={(event) => updateAddress("accusedAddress", "street", event.target.value)} required={includeAccusedAddress} value={form.accusedAddress?.street || ""} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Postal code
                                <input className={inputClassName} disabled={!form.accusedAddress?.state} onChange={(event) => updateAddress("accusedAddress", "postalCode", event.target.value)} required={includeAccusedAddress} value={form.accusedAddress?.postalCode || ""} />
                            </label>
                        </div>
                    ) : null}
                </SectionCard>

                <SectionCard description="Describe when the incident happened, where it took place, and what was reported." title="Incident details">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <WorkspaceFormField field="incidentDateTime" label="Incident date and time" type="datetime-local" update={updateField} value={form.incidentDateTime ?? ""} />
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-sm text-slate-700">
                        <input checked={includeIncidentAddress} className="h-4 w-4" id="toggle-incident-address" onChange={(event) => {
                            setIncludeIncidentAddress(event.target.checked);
                            if (!event.target.checked) {
                                setForm((current) => ({...current, incidentPlace: createEmptyAddress()}));
                            }
                        }} type="checkbox" />
                        <label className="font-medium" htmlFor="toggle-incident-address">Add incident location (optional)</label>
                    </div>
                    {includeIncidentAddress ? (
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Country / Nationality
                                <select className={inputClassName} onChange={(event) => {
                                    updateAddress("incidentPlace", "countryCode", event.target.value);
                                    updateAddress("incidentPlace", "state", "");
                                    updateAddress("incidentPlace", "city", "");
                                }} required={includeIncidentAddress} value={form.incidentPlace?.countryCode || ""}>
                                    <option value="">Select country</option>
                                    {countryOptions.map((country) => (
                                        <option key={country.code} value={country.code}>{country.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                State / Province
                                <select className={inputClassName} disabled={!form.incidentPlace?.countryCode} onChange={(event) => {
                                    updateAddress("incidentPlace", "state", event.target.value);
                                    updateAddress("incidentPlace", "city", "");
                                }} required={includeIncidentAddress} value={form.incidentPlace?.state || ""}>
                                    <option value="">Select state</option>
                                    {incidentStates.map((state) => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                City
                                <select className={inputClassName} disabled={!form.incidentPlace?.state} onChange={(event) => updateAddress("incidentPlace", "city", event.target.value)} required={includeIncidentAddress} value={form.incidentPlace?.city || ""}>
                                    <option value="">Select city</option>
                                    {incidentCities.map((city) => (
                                        <option key={city.code} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Street
                                <input className={inputClassName} disabled={!form.incidentPlace?.countryCode} onChange={(event) => updateAddress("incidentPlace", "street", event.target.value)} required={includeIncidentAddress} value={form.incidentPlace?.street || ""} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Postal code
                                <input className={inputClassName} disabled={!form.incidentPlace?.state} onChange={(event) => updateAddress("incidentPlace", "postalCode", event.target.value)} required={includeIncidentAddress} value={form.incidentPlace?.postalCode || ""} />
                            </label>
                        </div>
                    ) : null}
                    <label className="mt-5 block text-sm font-medium text-slate-700">
                        Incident description
                        <textarea className={textareaClassName} onChange={(event) => updateField("incidentDescription", event.target.value)} value={form.incidentDescription ?? ""} />
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
            </>
            ) : null}
        </section>
    );
}