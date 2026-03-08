import {useCallback, useEffect, useMemo, useState, type FormEvent} from "react";
import {useSearchParams} from "react-router-dom";
import type {CaseSummaryDto} from "../api/dtos/case.ts";
import type {ActionRequestDto, RequestSummaryDto} from "../api/dtos/request.ts";
import {getCases} from "../api/services/case-services.ts";
import {getMyRequests, submitActionRequest} from "../api/services/request-services.ts";
import {LawyerRoleOptions} from "../api/types.ts";
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
    tableHeadCellClassName,
    textareaClassName
} from "../components/app/WorkspaceUi.tsx";
import {getSessionUserId} from "../utils/auth-session.ts";
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";

interface RepresentationForm {
    caseId: number;
    lawyerRole: "DEFENSE" | "PROSECUTOR";
    reason: string;
}

export default function LawyerHearingsPage() {
    const [searchParams] = useSearchParams();
    const userId = getSessionUserId();
    const requestedCaseId = Number(searchParams.get("caseId"));
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [requests, setRequests] = useState<RequestSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState<RepresentationForm>({
        caseId: Number.isInteger(requestedCaseId) ? requestedCaseId : 0,
        lawyerRole: "DEFENSE",
        reason: ""
    });

    const selectedCase = useMemo(() => cases.find((item) => item.caseId === form.caseId) ?? null, [cases, form.caseId]);

    const loadPage = useCallback(async () => {
        if (!userId) {
            setError("Unable to determine the signed-in lawyer.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            const [caseResults, requestResults] = await Promise.all([getCases(), getMyRequests(userId)]);
            setCases(caseResults);
            setRequests(requestResults.filter((request) => request.requestType === "LAWYER_CASE_REQUEST"));
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load lawyer request workspace");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void loadPage();
    }, [loadPage]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userId || !selectedCase?.firId) {
            setError("Please select a case before requesting representation.");
            return;
        }

        const payload: ActionRequestDto = {
            requestType: "LAWYER_CASE_REQUEST",
            requestedByUserId: userId,
            caseId: selectedCase.caseId,
            firId: selectedCase.firId,
            status: "PENDING",
            reason: form.reason,
            reviewedAt: null,
            reviewedByUserId: null,
            lawyerRole: form.lawyerRole
        };

        try {
            setIsSubmitting(true);
            setError("");
            await submitActionRequest(payload);
            setForm((current) => ({...current, reason: ""}));
            await loadPage();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to request representation");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description="Review case status across the register and submit representation requests for the matters you want to take up."
                eyebrow="Lawyer hearings"
                title="Representation requests"
            />

            {isLoading ? <LoadingBlock label="Loading representation workspace" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load representation workspace" /> : null}

            {!isLoading && !error ? (
                <>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <SectionCard description="Select a case, choose your role, and explain the basis for the representation request." title="Request representation">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                    Case
                                    <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, caseId: Number(event.target.value)}))} value={form.caseId || ""}>
                                        <option value="">Select a case</option>
                                        {cases.map((caseItem) => (
                                            <option key={caseItem.caseId} value={caseItem.caseId}>{caseItem.caseNumber} • {formatEnumLabel(caseItem.caseStage)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700">
                                    Lawyer role
                                    <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, lawyerRole: event.target.value as RepresentationForm["lawyerRole"]}))} value={form.lawyerRole}>
                                        {LawyerRoleOptions.map((option) => (
                                            <option key={option} value={option}>{formatEnumLabel(option)}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <label className="mt-5 block text-sm font-medium text-slate-700">
                                Reason
                                <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({...current, reason: event.target.value}))} value={form.reason} />
                            </label>
                            <div className="mt-5">
                                <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                                    {isSubmitting ? "Submitting request" : "Submit request"}
                                </button>
                            </div>
                        </SectionCard>
                    </form>

                    <SectionCard description="Open cases available for review alongside your submitted representation requests." title="Case and request overview">
                        <div className="grid gap-6 xl:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">Case register</h3>
                                {cases.length === 0 ? <EmptyState description="No case is available for representation review right now." title="No cases available" /> : (
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
                                                    <tr key={caseItem.caseId}>
                                                        <td className={tableCellClassName}>{caseItem.caseNumber}</td>
                                                        <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(caseItem.caseStage)} tone={caseItem.caseStage === "TRIAL" ? "amber" : "blue"} /></td>
                                                        <td className={tableCellClassName}>{caseItem.currentInvestigatingUnitName ?? "Not assigned"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">My representation requests</h3>
                                {requests.length === 0 ? <EmptyState description="No representation request has been submitted from this lawyer account yet." title="No requests submitted" /> : (
                                    <div className={tableContainerClassName}>
                                        <table className={tableClassName}>
                                            <thead>
                                                <tr>
                                                    <th className={tableHeadCellClassName}>Case</th>
                                                    <th className={tableHeadCellClassName}>Requested role</th>
                                                    <th className={tableHeadCellClassName}>Status</th>
                                                    <th className={tableHeadCellClassName}>Submitted</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {requests.map((request) => (
                                                    <tr key={request.requestId}>
                                                        <td className={tableCellClassName}>{request.caseNumber ?? `Case #${request.caseId}`}</td>
                                                        <td className={tableCellClassName}>{request.targetLabel ?? "Not set"}</td>
                                                        <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(request.status)} tone={request.status === "APPROVED" ? "emerald" : request.status === "REJECTED" ? "rose" : "amber"} /></td>
                                                        <td className={tableCellClassName}>{formatDateTime(request.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SectionCard>
                </>
            ) : null}
        </section>
    );
}
