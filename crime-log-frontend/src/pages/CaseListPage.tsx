import {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import type {CaseSummaryDto} from "../api/dtos/case.ts";
import type {DepartmentUnitOptionDto} from "../api/dtos/reference.ts";
import type {CaseStage} from "../api/types.ts";
import {CaseStageOptions} from "../api/types.ts";
import {getAssignedCases, getCases, searchCases} from "../api/services/case-services.ts";
import {getDepartmentUnits} from "../api/services/reference-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    inputClassName,
    primaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {getSessionUserId} from "../utils/auth-session.ts";
import {formatDate, formatEnumLabel} from "../utils/display.ts";

export default function CaseListPage() {
    const navigate = useNavigate();
    const {role} = useOutletContext<AppOutletContext>();
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [units, setUnits] = useState<DepartmentUnitOptionDto[]>([]);
    const [stageFilter, setStageFilter] = useState<CaseStage | "">("");
    const [unitFilter, setUnitFilter] = useState("");
    const [caseNumberFilter, setCaseNumberFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCases = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            if (role === "LAWYER") {
                const userId = getSessionUserId();
                const assigned = userId ? await getAssignedCases(userId) : [];
                const filtered = assigned.filter((caseItem) => {
                    const stageMatches = !stageFilter || caseItem.caseStage === stageFilter;
                    const numberMatches = !caseNumberFilter.trim() || caseItem.caseNumber.toLowerCase().includes(caseNumberFilter.trim().toLowerCase());
                    return stageMatches && numberMatches;
                });
                setCases(filtered);
                return;
            }

            if (stageFilter || unitFilter || caseNumberFilter.trim()) {
                setCases(await searchCases({
                    stage: stageFilter || undefined,
                    investigatingUnitId: unitFilter ? Number(unitFilter) : undefined,
                    caseNumber: caseNumberFilter.trim() || undefined
                }));
                return;
            }

            setCases(await getCases());
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load cases");
        } finally {
            setIsLoading(false);
        }
    }, [role, stageFilter, unitFilter, caseNumberFilter]);

    useEffect(() => {
        void loadCases();
    }, [loadCases]);

    useEffect(() => {
        if (role === "LAWYER") {
            setUnits([]);
            return;
        }

        const loadUnits = async () => {
            try {
                setUnits(await getDepartmentUnits());
            } catch {
                setUnits([]);
            }
        };

        void loadUnits();
    }, [role]);

    return (
        <section className="space-y-6">
            <PageHeader
                actions={role === "OFFICER" ? <Link className={primaryButtonClassName} to="/app/cases/new">Create case</Link> : undefined}
                description="Review current case status, open case records, and move into investigation details or participant management."
                eyebrow={role === "LAWYER" ? "Lawyer case view" : "Case management"}
                title={role === "LAWYER" ? "Assigned cases" : "Case register"}
            />

            <SectionCard description="Select a case to open full details and participant information." title="Cases">
                <div className="mb-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Case number
                        <input
                            className={inputClassName}
                            onChange={(event) => setCaseNumberFilter(event.target.value)}
                            placeholder="Search by case number"
                            value={caseNumberFilter}
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Stage
                        <select className={inputClassName} onChange={(event) => setStageFilter(event.target.value as CaseStage | "")} value={stageFilter}>
                            <option value="">All stages</option>
                            {CaseStageOptions.map((stage) => (
                                <option key={stage} value={stage}>{formatEnumLabel(stage)}</option>
                            ))}
                        </select>
                    </label>
                    {role !== "LAWYER" ? (
                        <label className="block text-sm font-medium text-slate-700">
                            Investigating unit
                            <select className={inputClassName} onChange={(event) => setUnitFilter(event.target.value)} value={unitFilter}>
                                <option value="">All units</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                        </label>
                    ) : (
                        <div className="flex items-end">
                            <p className="text-xs text-slate-500">Lawyer view supports case number and stage filters on assigned cases.</p>
                        </div>
                    )}
                </div>

                {isLoading ? <LoadingBlock label="Loading cases" /> : null}
                {!isLoading && error ? <EmptyState description={error} title="Unable to load cases" /> : null}
                {!isLoading && !error && cases.length === 0 ? (
                    <EmptyState
                        action={role === "OFFICER" ? <Link className={primaryButtonClassName} to="/app/cases/new">Create case</Link> : undefined}
                        description={role === "LAWYER" ? "No case is assigned to this lawyer yet." : "No case has been opened yet."}
                        title="No cases found"
                    />
                ) : null}
                {!isLoading && !error && cases.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>Case</th>
                                    <th className={tableHeadCellClassName}>Status</th>
                                    <th className={tableHeadCellClassName}>FIR</th>
                                    <th className={tableHeadCellClassName}>Investigating unit</th>
                                    <th className={tableHeadCellClassName}>Opened</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {cases.map((caseItem) => (
                                    <tr
                                        className="cursor-pointer transition hover:bg-slate-50"
                                        key={caseItem.caseId}
                                        onClick={() => navigate(`/app/cases/${caseItem.caseId}`)}
                                    >
                                        <td className={tableCellClassName}>
                                            <div className="font-semibold text-slate-900">{caseItem.caseNumber}</div>
                                            <div className="mt-1 text-xs text-slate-500">{caseItem.courtName ?? "Court not assigned"}</div>
                                        </td>
                                        <td className={tableCellClassName}>
                                            <StatusBadge label={formatEnumLabel(caseItem.caseStage)} tone={caseItem.caseStage === "CLOSED" ? "slate" : caseItem.caseStage === "TRIAL" ? "amber" : "blue"} />
                                        </td>
                                        <td className={tableCellClassName}>{caseItem.firNumber ?? "Not linked"}</td>
                                        <td className={tableCellClassName}>{caseItem.currentInvestigatingUnitName ?? "Not assigned"}</td>
                                        <td className={tableCellClassName}>{formatDate(caseItem.openedOn)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </SectionCard>
        </section>
    );
}

