import {useCallback, useEffect, useMemo, useState, type FormEvent} from "react";
import {useSearchParams} from "react-router-dom";
import type {CaseSummaryDto} from "../api/dtos/case.ts";
import type {AgencyOptionDto, DepartmentUnitOptionDto} from "../api/dtos/reference.ts";
import type {ActionRequestDto, RequestSummaryDto} from "../api/dtos/request.ts";
import {getCases} from "../api/services/case-services.ts";
import {getAgencies, getDepartmentUnits} from "../api/services/reference-services.ts";
import {getMyRequests, submitActionRequest} from "../api/services/request-services.ts";
import {OfficerRequestTypeOptions, type RequestType} from "../api/types.ts";
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

interface OfficerRequestForm {
    requestType: RequestType;
    caseId: number;
    reason: string;
    targetUnitId: number | null;
    targetAgencyId: number | null;
}

export default function RequestsPage() {
    const [searchParams] = useSearchParams();
    const userId = getSessionUserId();
    const requestedCaseId = Number(searchParams.get("caseId"));
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [units, setUnits] = useState<DepartmentUnitOptionDto[]>([]);
    const [agencies, setAgencies] = useState<AgencyOptionDto[]>([]);
    const [requests, setRequests] = useState<RequestSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState<OfficerRequestForm>({
        requestType: "TRANSFER_UNIT",
        caseId: Number.isInteger(requestedCaseId) ? requestedCaseId : 0,
        reason: "",
        targetUnitId: null,
        targetAgencyId: null
    });

    const selectedCase = useMemo(() => cases.find((item) => item.caseId === form.caseId) ?? null, [cases, form.caseId]);

    const loadPage = useCallback(async () => {
        if (!userId) {
            setError("Unable to determine the signed-in officer.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            const [caseResults, unitResults, agencyResults, myRequests] = await Promise.all([
                getCases(),
                getDepartmentUnits(),
                getAgencies(),
                getMyRequests(userId)
            ]);
            setCases(caseResults);
            setUnits(unitResults);
            setAgencies(agencyResults);
            setRequests(myRequests);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load request data");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void loadPage();
    }, [loadPage]);

    const buildRequest = (): ActionRequestDto | null => {
        if (!userId || !selectedCase?.firId) {
            return null;
        }

        const baseRequest = {
            requestedByUserId: userId,
            caseId: form.caseId,
            firId: selectedCase.firId,
            status: "PENDING" as const,
            reason: form.reason,
            reviewedAt: null,
            reviewedByUserId: null
        };

        switch (form.requestType) {
            case "TRANSFER_UNIT":
                return form.targetUnitId ? {...baseRequest, requestType: "TRANSFER_UNIT", targetUnitId: form.targetUnitId} : null;
            case "TRANSFER_AGENCY":
                return form.targetAgencyId ? {...baseRequest, requestType: "TRANSFER_AGENCY", targetAgencyId: form.targetAgencyId} : null;
            case "SUBMIT_CHARGE_SHEET":
                return {...baseRequest, requestType: "SUBMIT_CHARGE_SHEET"};
            default:
                return null;
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const requestPayload = buildRequest();
        if (!requestPayload) {
            setError("Please complete the request details before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await submitActionRequest(requestPayload);
            setForm((currentForm) => ({...currentForm, reason: "", targetUnitId: null, targetAgencyId: null}));
            await loadPage();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description="Submit transfer or charge-sheet requests against an active case and track the approval outcome."
                eyebrow="Officer requests"
                title="Requests"
            />

            {isLoading ? <LoadingBlock label="Loading requests" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load request workspace" /> : null}

            {!isLoading && !error ? (
                <>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <SectionCard description="Choose the action, linked case, and routing target when one is required." title="Submit request">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <label className="block text-sm font-medium text-slate-700">
                                    Request type
                                    <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, requestType: event.target.value as RequestType, targetUnitId: null, targetAgencyId: null}))} value={form.requestType}>
                                        {OfficerRequestTypeOptions.map((option) => (
                                            <option key={option} value={option}>{formatEnumLabel(option)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
                                    Case
                                    <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, caseId: Number(event.target.value)}))} value={form.caseId || ""}>
                                        <option value="">Select a case</option>
                                        {cases.map((caseItem) => (
                                            <option key={caseItem.caseId} value={caseItem.caseId}>{caseItem.caseNumber} • {caseItem.firNumber ?? "No FIR"}</option>
                                        ))}
                                    </select>
                                </label>
                                {form.requestType === "TRANSFER_UNIT" ? (
                                    <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                                        Target unit
                                        <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, targetUnitId: event.target.value ? Number(event.target.value) : null}))} value={form.targetUnitId ?? ""}>
                                            <option value="">Select a department unit</option>
                                            {units.map((unit) => (
                                                <option key={unit.id} value={unit.id}>{unit.name} • {unit.agencyName}</option>
                                            ))}
                                        </select>
                                    </label>
                                ) : null}
                                {form.requestType === "TRANSFER_AGENCY" ? (
                                    <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
                                        Target agency
                                        <select className={inputClassName} onChange={(event) => setForm((current) => ({...current, targetAgencyId: event.target.value ? Number(event.target.value) : null}))} value={form.targetAgencyId ?? ""}>
                                            <option value="">Select an agency</option>
                                            {agencies.map((agency) => (
                                                <option key={agency.id} value={agency.id}>{agency.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                ) : null}
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

                    <SectionCard description="Track the status of requests submitted from the officer workspace." title="Submitted requests">
                        {requests.length === 0 ? <EmptyState description="No request has been submitted from this account yet." title="No requests submitted" /> : null}
                        {requests.length > 0 ? (
                            <div className={tableContainerClassName}>
                                <table className={tableClassName}>
                                    <thead>
                                        <tr>
                                            <th className={tableHeadCellClassName}>Request</th>
                                            <th className={tableHeadCellClassName}>Case</th>
                                            <th className={tableHeadCellClassName}>Target</th>
                                            <th className={tableHeadCellClassName}>Status</th>
                                            <th className={tableHeadCellClassName}>Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {requests.map((request) => (
                                            <tr key={request.requestId}>
                                                <td className={tableCellClassName}>
                                                    <div className="font-semibold text-slate-900">{formatEnumLabel(request.requestType)}</div>
                                                    <div className="mt-1 text-xs text-slate-500">{request.reason || "No reason provided"}</div>
                                                </td>
                                                <td className={tableCellClassName}>{request.caseNumber ?? `Case #${request.caseId}`}</td>
                                                <td className={tableCellClassName}>{request.targetLabel ?? "Not applicable"}</td>
                                                <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(request.status)} tone={request.status === "APPROVED" ? "emerald" : request.status === "REJECTED" ? "rose" : "amber"} /></td>
                                                <td className={tableCellClassName}>{formatDateTime(request.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </SectionCard>
                </>
            ) : null}
        </section>
    );
}
