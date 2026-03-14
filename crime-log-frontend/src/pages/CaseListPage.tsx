import {useEffect, useState} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import type {CaseSummaryDto} from "../api/dtos/case.ts";
import {getAssignedCases, getCases} from "../api/services/case-services.ts";
import {getCurrentOfficerProfile} from "../api/services/officer-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    primaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {getSessionUserId} from "../utils/auth-session.ts";
import {formatDate, formatEnumLabel} from "../utils/display.ts";
import type {OfficerProfileDto} from "../api/dtos/officer.ts";

export default function CaseListPage() {
    const navigate = useNavigate();
    const {role} = useOutletContext<AppOutletContext>();
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [officerProfile, setOfficerProfile] = useState<OfficerProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCases = async () => {
            try {
                setIsLoading(true);
                setError("");
                const userId = getSessionUserId();
                const [result, profile] = await Promise.all([
                    role === "LAWYER" && userId ? getAssignedCases(userId) : getCases(),
                    role === "OFFICER" ? getCurrentOfficerProfile() : Promise.resolve(null)
                ]);
                setCases(result);
                setOfficerProfile(profile);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load cases");
            } finally {
                setIsLoading(false);
            }
        };

        void loadCases();
    }, [role]);

    const canCreateCase = role === "OFFICER" && officerProfile?.unitType === "POLICE_STATION";

    return (
        <section className="space-y-6">
            <PageHeader
                actions={canCreateCase ? <Link className={primaryButtonClassName} to="/app/cases/new">Create case</Link> : undefined}
                description="Review current case status, open case records, and move into investigation details or participant management."
                eyebrow={role === "LAWYER" ? "Lawyer case view" : "Case management"}
                title={role === "LAWYER" ? "Assigned cases" : "Case register"}
            />

            <SectionCard description="Select a case to open full details and participant information." title="Cases">
                {isLoading ? <LoadingBlock label="Loading cases" /> : null}
                {!isLoading && error ? <EmptyState description={error} title="Unable to load cases" /> : null}
                {!isLoading && !error && role === "OFFICER" && !canCreateCase ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Case creation is only allowed for officers posted to police station units.
                    </div>
                ) : null}
                {!isLoading && !error && cases.length === 0 ? (
                    <EmptyState
                        action={canCreateCase ? <Link className={primaryButtonClassName} to="/app/cases/new">Create case</Link> : undefined}
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

