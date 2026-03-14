import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import type {CreateCaseRequest} from "../api/dtos/case.ts";
import type {FirSummaryDto} from "../api/dtos/fir.ts";
import type {DepartmentUnitOptionDto} from "../api/dtos/reference.ts";
import {createCase} from "../api/services/case-services.ts";
import {getFirs} from "../api/services/fir-services.ts";
import {getDepartmentUnits} from "../api/services/reference-services.ts";
import {LoadingBlock, PageHeader, SectionCard, inputClassName, primaryButtonClassName, secondaryButtonClassName} from "../components/app/WorkspaceUi.tsx";
import {getCurrentOfficerProfile} from "../api/services/officer-services.ts";
import WorkspaceFormField from "../components/form/WorkspaceFormField.tsx";
import {useFormState} from "../hooks/form-field-update.ts";

export default function CreateCasePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [firs, setFirs] = useState<FirSummaryDto[]>([]);
    const [units, setUnits] = useState<DepartmentUnitOptionDto[]>([]);
    const [agencyName, setAgencyName] = useState<string>("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const preferredFirId = Number(searchParams.get("firId"));

    const initialState = useMemo<CreateCaseRequest>(() => ({
        caseNumber: "",
        firId: Number.isInteger(preferredFirId) ? preferredFirId : 0,
        currentInvestigatingUnitId: null
    }), [preferredFirId]);

    const {form, updateField} = useFormState<CreateCaseRequest>(initialState);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setIsCheckingAccess(true);
                const [profile, firResults, unitResults] = await Promise.all([
                    getCurrentOfficerProfile(),
                    getFirs(),
                    getDepartmentUnits()
                ]);

                if (profile.unitType !== "POLICE_STATION") {
                    navigate("/access-denied", {replace: true, state: {from: "/app/cases/new"}});
                    return;
                }

                setFirs(
                    firResults.filter((item) => (item.caseId === null || item.firId === preferredFirId) && item.initialInvestigatingUnitId === profile.departmentUnitId)
                );

                const officerAgencyUnits = unitResults.filter((unit) => unit.id === profile.departmentUnitId || unit.agencyName === unitResults.find((candidate) => candidate.id === profile.departmentUnitId)?.agencyName);
                setUnits(officerAgencyUnits);
                setAgencyName(unitResults.find((candidate) => candidate.id === profile.departmentUnitId)?.agencyName ?? "");
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load case options");
            } finally {
                setIsCheckingAccess(false);
            }
        };

        void loadOptions();
    }, [navigate, preferredFirId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            const createdCase = await createCase(form);
            navigate(`/app/cases/${createdCase.caseId}`);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to create case");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUnits = useMemo(() => units.filter((unit) => !agencyName || unit.agencyName === agencyName), [units, agencyName]);

    return (
        <section className="space-y-6">
            {isCheckingAccess ? <LoadingBlock label="Checking officer access" /> : null}
            {!isCheckingAccess ? (
            <>
            <PageHeader
                actions={<Link className={secondaryButtonClassName} to="/app/cases">Back to cases</Link>}
                description="Open a new case from an FIR and assign the investigating unit that should own the file."
                eyebrow="Case management"
                title="Create case"
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
                <SectionCard description="Only FIRs without an existing case are available for selection." title="Case setup">
                    <div className="grid gap-4 md:grid-cols-2">
                        <WorkspaceFormField field="caseNumber" label="Case number" required update={updateField} value={form.caseNumber} />
                        <label className="block text-sm font-medium text-slate-700">
                            FIR
                            <select className={inputClassName} onChange={(event) => updateField("firId", Number(event.target.value))} value={form.firId || ""}>
                                <option value="">Select an FIR</option>
                                {firs.map((fir) => (
                                    <option key={fir.firId} value={fir.firId}>{fir.firNumber} • {fir.accusedName || "Accused not set"}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                            Investigating unit
                            <select className={inputClassName} onChange={(event) => updateField("currentInvestigatingUnitId", event.target.value ? Number(event.target.value) : null)} value={form.currentInvestigatingUnitId ?? ""}>
                                <option value="">Use the FIR unit</option>
                                {filteredUnits.map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name} • {unit.agencyName}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </SectionCard>

                {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

                <div className="flex flex-wrap gap-3">
                    <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating case" : "Create case"}
                    </button>
                    <Link className={secondaryButtonClassName} to="/app/cases">Cancel</Link>
                </div>
            </form>
            </>
            ) : null}
        </section>
    );
}
