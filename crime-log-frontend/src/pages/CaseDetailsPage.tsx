import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useOutletContext, useParams} from "react-router-dom";
import type {CaseDetailDto, CaseParticipantCreateRequest, CaseStageUpdateRequest} from "../api/dtos/case.ts";
import type {DepartmentUnitOptionDto, PersonOptionDto} from "../api/dtos/reference.ts";
import {addCaseParticipant, getCaseDetails, updateCaseInvestigatingUnit, updateCaseStage} from "../api/services/case-services.ts";
import {getDepartmentUnits, getPeople} from "../api/services/reference-services.ts";
import type {CaseStage} from "../api/types.ts";
import {CaseParticipantTypeOptions, CaseStageOptions} from "../api/types.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    inputClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {useFormState} from "../hooks/form-field-update.ts";
import {formatDate, formatDateTime, formatEnumLabel, formatParticipantRole} from "../utils/display.ts";

export default function CaseDetailsPage() {
    const {caseId} = useParams();
    const {role} = useOutletContext<AppOutletContext>();
    const [caseDetail, setCaseDetail] = useState<CaseDetailDto | null>(null);
    const [people, setPeople] = useState<PersonOptionDto[]>([]);
    const [departmentUnits, setDepartmentUnits] = useState<DepartmentUnitOptionDto[]>([]);
    const [selectedStage, setSelectedStage] = useState<CaseStage>("INVESTIGATION");
    const [selectedUnitId, setSelectedUnitId] = useState("");
    const [isUpdatingCase, setIsUpdatingCase] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const participantForm = useMemo<CaseParticipantCreateRequest>(() => ({personId: 0, casePersonType: "VICTIM"}), []);
    const {form, updateField, setForm} = useFormState<CaseParticipantCreateRequest>(participantForm);

    const loadCase = async (id: number) => {
        const details = await getCaseDetails(id);
        setCaseDetail(details);
        setSelectedStage(details.caseStage);
    };

    useEffect(() => {
        const id = Number(caseId);
        if (!Number.isInteger(id)) {
            setError("Invalid case selected");
            setIsLoading(false);
            return;
        }

        const loadPage = async () => {
            try {
                setIsLoading(true);
                setError("");
                const [details, peopleOptions, units] = await Promise.all([getCaseDetails(id), getPeople(), getDepartmentUnits()]);
                setCaseDetail(details);
                setPeople(peopleOptions);
                setDepartmentUnits(units);
                setSelectedStage(details.caseStage);
                const selectedUnit = units.find((unit) => unit.name === details.currentInvestigatingUnitName);
                setSelectedUnitId(selectedUnit ? String(selectedUnit.id) : "");
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load case details");
            } finally {
                setIsLoading(false);
            }
        };

        void loadPage();
    }, [caseId]);

    const handleParticipantSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = Number(caseId);
        if (!Number.isInteger(id)) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await addCaseParticipant(id, form);
            await loadCase(id);
            setForm(participantForm);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to add participant");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCaseUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = Number(caseId);
        if (!Number.isInteger(id)) {
            return;
        }

        try {
            setIsUpdatingCase(true);
            setError("");

            const stageRequest: CaseStageUpdateRequest = {
                stage: selectedStage,
                closedOn: selectedStage === "CLOSED" ? new Date().toISOString().slice(0, 10) : null
            };

            await updateCaseStage(id, stageRequest);
            if (selectedUnitId) {
                await updateCaseInvestigatingUnit(id, {departmentUnitId: Number(selectedUnitId)});
            }

            await loadCase(id);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to update case details");
        } finally {
            setIsUpdatingCase(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                actions={(
                    <>
                        <Link className={secondaryButtonClassName} to="/app/cases">Back to cases</Link>
                        {role === "OFFICER" ? <Link className={primaryButtonClassName} to={`/app/requests?caseId=${caseId}`}>Submit request</Link> : null}
                        {role === "LAWYER" ? <Link className={primaryButtonClassName} to={`/app/hearings?caseId=${caseId}`}>Request representation</Link> : null}
                    </>
                )}
                description="Review case status, the linked FIR, investigating unit ownership, and everyone attached to the file."
                eyebrow="Case details"
                title={caseDetail ? caseDetail.caseNumber : "Case record"}
            />

            {isLoading ? <LoadingBlock label="Loading case details" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load this case" /> : null}

            {!isLoading && caseDetail ? (
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <SectionCard description="Status, dates, and the current investigating unit responsible for this case." title="Case overview">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Status</p>
                                <div className="mt-2"><StatusBadge label={formatEnumLabel(caseDetail.caseStage)} tone={caseDetail.caseStage === "CLOSED" ? "slate" : caseDetail.caseStage === "TRIAL" ? "amber" : "blue"} /></div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Investigating unit</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{caseDetail.currentInvestigatingUnitName ?? "Not assigned"}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Opened on</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{formatDate(caseDetail.openedOn)}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Court</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{caseDetail.courtName ?? "Not assigned"}</p>
                            </div>
                        </div>

                        {role === "OFFICER" || role === "ADMIN" ? (
                            <form className="mt-5 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3" onSubmit={handleCaseUpdateSubmit}>
                                <label className="block text-sm font-medium text-slate-700">
                                    Case stage
                                    <select className={inputClassName} onChange={(event) => setSelectedStage(event.target.value as CaseStage)} value={selectedStage}>
                                        {CaseStageOptions.map((option) => (
                                            <option key={option} value={option}>{formatEnumLabel(option)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                    Investigating unit
                                    <select className={inputClassName} onChange={(event) => setSelectedUnitId(event.target.value)} value={selectedUnitId}>
                                        <option value="">Select unit</option>
                                        {departmentUnits.map((unit) => (
                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="md:col-span-3">
                                    <button className={primaryButtonClassName} disabled={isUpdatingCase} type="submit">
                                        {isUpdatingCase ? "Saving updates" : "Update case status and unit"}
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </SectionCard>

                    <SectionCard description="The FIR that originated this case." title="Linked FIR">
                        <dl className="space-y-4 text-sm text-slate-700">
                            <div>
                                <dt className="font-medium text-slate-500">FIR number</dt>
                                <dd className="mt-1 text-base font-semibold text-slate-900">{caseDetail.fir.firNumber}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">FIR type</dt>
                                <dd className="mt-1">{formatEnumLabel(caseDetail.fir.firType)}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">Registered on</dt>
                                <dd className="mt-1">{formatDateTime(caseDetail.fir.registrationDateTime)}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">Accused</dt>
                                <dd className="mt-1">{caseDetail.fir.accusedName || "Not set"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">Origin unit</dt>
                                <dd className="mt-1">{caseDetail.fir.originUnitName ?? "Not set"}</dd>
                            </div>
                        </dl>
                    </SectionCard>

                    <SectionCard className="xl:col-span-2" description="Victims, accused, and witnesses linked to this case." title="Participants">
                        {caseDetail.participants.length === 0 ? <EmptyState description="No participant has been attached to this case yet." title="No participants recorded" /> : null}
                        {caseDetail.participants.length > 0 ? (
                            <div className={tableContainerClassName}>
                                <table className={tableClassName}>
                                    <thead>
                                        <tr>
                                            <th className={tableHeadCellClassName}>Person</th>
                                            <th className={tableHeadCellClassName}>Role</th>
                                            <th className={tableHeadCellClassName}>Contact</th>
                                            <th className={tableHeadCellClassName}>Added on</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {caseDetail.participants.map((participant) => (
                                            <tr key={participant.casePersonId}>
                                                <td className={tableCellClassName}>{participant.fullName}</td>
                                                <td className={tableCellClassName}>{formatParticipantRole(participant.casePersonType)}</td>
                                                <td className={tableCellClassName}>{participant.contactPrimary}</td>
                                                <td className={tableCellClassName}>{formatDate(participant.addedOn)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}

                        {role === "OFFICER" ? (
                            <form className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3" onSubmit={handleParticipantSubmit}>
                                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                    Participant
                                    <select className={inputClassName} onChange={(event) => updateField("personId", Number(event.target.value))} value={form.personId || ""}>
                                        <option value="">Select a person</option>
                                        {people.map((person) => (
                                            <option key={person.personId} value={person.personId}>{person.fullName}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700">
                                    Role type
                                    <select className={inputClassName} onChange={(event) => updateField("casePersonType", event.target.value as CaseParticipantCreateRequest["casePersonType"])} value={form.casePersonType}>
                                        {CaseParticipantTypeOptions.map((option) => (
                                            <option key={option} value={option}>{formatParticipantRole(option)}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="md:col-span-3">
                                    <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                                        {isSubmitting ? "Adding participant" : "Add participant"}
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </SectionCard>
                </div>
            ) : null}
        </section>
    );
}

