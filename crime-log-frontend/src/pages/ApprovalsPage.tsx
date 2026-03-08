import {useEffect, useState} from "react";
import type {RequestSummaryDto} from "../api/dtos/request.ts";
import {getPendingRequests, reviewRequest} from "../api/services/request-services.ts";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    dangerButtonClassName,
    secondaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {getSessionUserId} from "../utils/auth-session.ts";
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";

export default function ApprovalsPage() {
    const reviewerUserId = getSessionUserId();
    const [requests, setRequests] = useState<RequestSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeRequestId, setActiveRequestId] = useState<number | null>(null);

    const loadPendingRequests = async () => {
        try {
            setIsLoading(true);
            setError("");
            setRequests(await getPendingRequests());
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load pending requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadPendingRequests();
    }, []);

    const handleReview = async (requestId: number, status: "APPROVED" | "REJECTED") => {
        if (!reviewerUserId) {
            setError("Unable to determine the signed-in admin.");
            return;
        }

        try {
            setActiveRequestId(requestId);
            setError("");
            await reviewRequest(requestId, {reviewerUserId, status});
            await loadPendingRequests();
        } catch (reviewError) {
            setError(reviewError instanceof Error ? reviewError.message : "Failed to update request");
        } finally {
            setActiveRequestId(null);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description="Review pending operational requests, approve valid actions, and reject requests that should not proceed."
                eyebrow="Admin approvals"
                title="Approval queue"
            />

            <SectionCard description="Pending requests are listed with their case, requester, target, and current review state." title="Pending requests">
                {isLoading ? <LoadingBlock label="Loading approval queue" /> : null}
                {!isLoading && error ? <EmptyState description={error} title="Unable to load approvals" /> : null}
                {!isLoading && !error && requests.length === 0 ? <EmptyState description="There is no request waiting for approval right now." title="Approval queue is clear" /> : null}
                {!isLoading && !error && requests.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>Request</th>
                                    <th className={tableHeadCellClassName}>Case</th>
                                    <th className={tableHeadCellClassName}>Requester</th>
                                    <th className={tableHeadCellClassName}>Target</th>
                                    <th className={tableHeadCellClassName}>Submitted</th>
                                    <th className={tableHeadCellClassName}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {requests.map((request) => (
                                    <tr key={request.requestId}>
                                        <td className={tableCellClassName}>
                                            <div className="font-semibold text-slate-900">{formatEnumLabel(request.requestType)}</div>
                                            <div className="mt-1 text-xs text-slate-500">{request.reason || "No reason provided"}</div>
                                        </td>
                                        <td className={tableCellClassName}>
                                            <div>{request.caseNumber ?? `Case #${request.caseId}`}</div>
                                            <div className="mt-1"><StatusBadge label={formatEnumLabel(request.status)} tone="amber" /></div>
                                        </td>
                                        <td className={tableCellClassName}>{request.requesterName}</td>
                                        <td className={tableCellClassName}>{request.targetLabel ?? "Not applicable"}</td>
                                        <td className={tableCellClassName}>{formatDateTime(request.createdAt)}</td>
                                        <td className={tableCellClassName}>
                                            <div className="flex flex-wrap gap-2">
                                                <button className={secondaryButtonClassName} disabled={activeRequestId === request.requestId} onClick={() => void handleReview(request.requestId, "APPROVED")} type="button">Approve</button>
                                                <button className={dangerButtonClassName} disabled={activeRequestId === request.requestId} onClick={() => void handleReview(request.requestId, "REJECTED")} type="button">Reject</button>
                                            </div>
                                        </td>
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

