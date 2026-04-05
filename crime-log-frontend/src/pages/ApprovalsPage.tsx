import {useEffect, useState} from "react";
import type {RequestSummaryDto} from "../api/dtos/request.ts";
import type {UserSummaryDto} from "../api/dtos/user.ts";
import {approveUser, getPendingUsers} from "../api/services/user-services.ts";
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
    const [pendingUsers, setPendingUsers] = useState<UserSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeRequestId, setActiveRequestId] = useState<number | null>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);

    const loadPendingApprovals = async () => {
        try {
            setIsLoading(true);
            setError("");
            const [pendingRequestResults, pendingUserResults] = await Promise.all([getPendingRequests(), getPendingUsers()]);
            setRequests(pendingRequestResults);
            setPendingUsers(pendingUserResults);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load pending approvals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadPendingApprovals();
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
            await loadPendingApprovals();
        } catch (reviewError) {
            setError(reviewError instanceof Error ? reviewError.message : "Failed to update request");
        } finally {
            setActiveRequestId(null);
        }
    };

    const handleApproveUser = async (userId: number) => {
        try {
            setActiveUserId(userId);
            setError("");
            await approveUser(userId);
            await loadPendingApprovals();
        } catch (approveError) {
            setError(approveError instanceof Error ? approveError.message : "Failed to approve user");
        } finally {
            setActiveUserId(null);
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

            <SectionCard description="Newly registered people stay pending until an admin approves the account." title="Pending people">
                {isLoading ? <LoadingBlock label="Loading pending people" /> : null}
                {!isLoading && !error && pendingUsers.length === 0 ? <EmptyState description="There are no people waiting for approval right now." title="People queue is clear" /> : null}
                {!isLoading && !error && pendingUsers.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>Person</th>
                                    <th className={tableHeadCellClassName}>Email</th>
                                    <th className={tableHeadCellClassName}>Role</th>
                                    <th className={tableHeadCellClassName}>Status</th>
                                    <th className={tableHeadCellClassName}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {pendingUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td className={tableCellClassName}>{user.fullName}</td>
                                        <td className={tableCellClassName}>{user.email}</td>
                                        <td className={tableCellClassName}>{formatEnumLabel(user.role)}</td>
                                        <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(user.accountStatus)} tone="amber" /></td>
                                        <td className={tableCellClassName}>
                                            <button
                                                className={secondaryButtonClassName}
                                                disabled={activeUserId === user.userId}
                                                onClick={() => void handleApproveUser(user.userId)}
                                                type="button"
                                            >
                                                Approve
                                            </button>
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

