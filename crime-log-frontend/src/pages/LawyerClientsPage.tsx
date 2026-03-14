import {useEffect, useState} from "react";
import type {CaseDetailDto, CaseSummaryDto} from "../api/dtos/case.ts";
import {getAssignedCases, getCaseDetails} from "../api/services/case-services.ts";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {getSessionUserId} from "../utils/auth-session.ts";
import {formatEnumLabel, formatParticipantRole} from "../utils/display.ts";

export default function LawyerClientsPage() {
    const userId = getSessionUserId();
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadClients = async () => {
            if (!userId) {
                setError("Unable to determine the signed-in lawyer.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");
                const assignedCases = await getAssignedCases(userId);
                setCases(assignedCases);
                if (assignedCases.length > 0) {
                    setSelectedCase(await getCaseDetails(assignedCases[0].caseId));
                }
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load assigned cases");
            } finally {
                setIsLoading(false);
            }
        };

        void loadClients();
    }, [userId]);

    const handleSelectCase = async (caseItem: CaseSummaryDto) => {
        try {
            setSelectedCase(await getCaseDetails(caseItem.caseId));
        } catch (selectionError) {
            setError(selectionError instanceof Error ? selectionError.message : "Failed to load case");
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description="Review the cases assigned to this lawyer together with participant roles and current case status."
                eyebrow="Lawyer clients"
                title="Assigned matters"
            />

            {isLoading ? <LoadingBlock label="Loading assigned matters" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load assigned matters" /> : null}

            {!isLoading && !error ? (
                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <SectionCard description="Select a matter to review the participants involved in the case." title="Assigned cases">
                        {cases.length === 0 ? <EmptyState description="No matter is assigned to this lawyer yet." title="No assigned cases" /> : null}
                        {cases.length > 0 ? (
                            <div className={tableContainerClassName}>
                                <table className={tableClassName}>
                                    <thead>
                                        <tr>
                                            <th className={tableHeadCellClassName}>Case</th>
                                            <th className={tableHeadCellClassName}>Status</th>
                                            <th className={tableHeadCellClassName}>Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {cases.map((caseItem) => (
                                            <tr className="cursor-pointer transition hover:bg-slate-50" key={caseItem.caseId} onClick={() => void handleSelectCase(caseItem)}>
                                                <td className={tableCellClassName}>
                                                    <div className="font-semibold text-slate-900">{caseItem.caseNumber}</div>
                                                    <div className="mt-1 text-xs text-slate-500">{caseItem.firNumber ?? "No FIR linked"}</div>
                                                </td>
                                                <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(caseItem.caseStage)} tone={caseItem.caseStage === "TRIAL" ? "amber" : "blue"} /></td>
                                                <td className={tableCellClassName}>{caseItem.currentInvestigatingUnitName ?? "Not assigned"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </SectionCard>

                    <SectionCard description="Participants and case status for the selected client matter." title={selectedCase ? selectedCase.caseNumber : "Matter details"}>
                        {!selectedCase ? <EmptyState description="Select a case from the assigned list to review participants." title="No matter selected" /> : null}
                        {selectedCase ? (
                            <div className="space-y-5">
                                <div className="flex flex-wrap gap-3">
                                    <StatusBadge label={formatEnumLabel(selectedCase.caseStage)} tone={selectedCase.caseStage === "TRIAL" ? "amber" : "blue"} />
                                    <StatusBadge label={selectedCase.currentInvestigatingUnitName ?? "Unit not assigned"} tone="slate" />
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p className="font-medium text-slate-500">Linked FIR</p>
                                    <p className="mt-2 text-base font-semibold text-slate-900">{selectedCase.fir.firNumber}</p>
                                    <p className="mt-2">Accused: {selectedCase.fir.accusedName || "Not set"}</p>
                                </div>
                                <div className={tableContainerClassName}>
                                    <table className={tableClassName}>
                                        <thead>
                                            <tr>
                                                <th className={tableHeadCellClassName}>Participant</th>
                                                <th className={tableHeadCellClassName}>Role</th>
                                                <th className={tableHeadCellClassName}>Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {selectedCase.participants.map((participant) => (
                                                <tr key={participant.casePersonId}>
                                                    <td className={tableCellClassName}>{participant.fullName}</td>
                                                    <td className={tableCellClassName}>{formatParticipantRole(participant.casePersonType)}</td>
                                                    <td className={tableCellClassName}>{participant.contactPrimary}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}
                    </SectionCard>
                </div>
            ) : null}
        </section>
    );
}

