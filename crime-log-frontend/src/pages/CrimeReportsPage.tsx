import {useCallback, useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useOutletContext} from "react-router-dom";
import type {CrimeReportDetailDto, CrimeReportSummaryDto, CreateCrimeReportRequest} from "../api/dtos/crime-report.ts";
import {broadcastCrimeReport, getAllCrimeReports, getMyCrimeReports, submitCrimeReport, updateCrimeReportStatus} from "../api/services/crime-report-services.ts";
import {AlertSeverityOptions, type AlertSeverity, type CrimeReportStatus} from "../api/types.ts";
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
    tableHeadCellClassName,
    textareaClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";

const severityTone: Record<AlertSeverity, string> = {
    LOW: "text-emerald-700",
    MEDIUM: "text-amber-700",
    HIGH: "text-orange-700",
    CRITICAL: "text-rose-700"
};

const statusTone: Record<CrimeReportStatus, "slate" | "blue" | "amber" | "emerald" | "rose"> = {
    SENT_TO_POLICE: "slate",
    UNDER_REVIEW: "blue",
    INVESTIGATING: "amber",
    SUSPECT_IDENTIFIED: "rose",
    CRIMINAL_CAUGHT: "emerald",
    CLOSED: "slate"
};

export default function CrimeReportsPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const canManage = role === "ADMIN" || role === "OFFICER";
    const canSubmit = role === "PUBLIC";

    const [myReports, setMyReports] = useState<CrimeReportSummaryDto[]>([]);
    const [allReports, setAllReports] = useState<CrimeReportSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReviewing, setIsReviewing] = useState<number | null>(null);
    const [isBroadcasting, setIsBroadcasting] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [reportForm, setReportForm] = useState<CreateCrimeReportRequest>({
        title: "",
        description: "",
        location: "",
        incidentDateTime: null
    });
    const [broadcastSeverity, setBroadcastSeverity] = useState<AlertSeverity>("HIGH");
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [detail, setDetail] = useState<CrimeReportDetailDto | null>(null);

    const reports = useMemo(() => (canManage ? allReports : myReports), [allReports, canManage, myReports]);

    const loadReports = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const [mine, all] = await Promise.all([getMyCrimeReports(), canManage ? getAllCrimeReports() : Promise.resolve([] as CrimeReportSummaryDto[])]);
            setMyReports(mine);
            setAllReports(all);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load crime reports");
        } finally {
            setIsLoading(false);
        }
    }, [canManage]);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const handleSubmitReport = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location.trim()) {
            setError("Please complete the crime report details.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            const createdReport = await submitCrimeReport({
                title: reportForm.title.trim(),
                description: reportForm.description.trim(),
                location: reportForm.location.trim(),
                incidentDateTime: reportForm.incidentDateTime || null
            });
            setDetail(createdReport);
            setReportForm({title: "", description: "", location: "", incidentDateTime: null});
            await loadReports();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to submit crime report");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (reportId: number, status: CrimeReportStatus, note?: string) => {
        try {
            setIsReviewing(reportId);
            setError("");
            const updated = await updateCrimeReportStatus(reportId, {status, note: note?.trim() || null});
            setDetail(updated);
            await loadReports();
        } catch (statusError) {
            setError(statusError instanceof Error ? statusError.message : "Failed to update report status");
        } finally {
            setIsReviewing(null);
        }
    };

    const handleBroadcast = async (reportId: number) => {
        try {
            setIsBroadcasting(reportId);
            setError("");
            const updated = await broadcastCrimeReport(reportId, {
                message: broadcastMessage.trim() || null,
                severity: broadcastSeverity
            });
            setDetail(updated);
            setBroadcastMessage("");
            setBroadcastSeverity("HIGH");
            await loadReports();
        } catch (broadcastError) {
            setError(broadcastError instanceof Error ? broadcastError.message : "Failed to broadcast report");
        } finally {
            setIsBroadcasting(null);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description={canSubmit
                    ? "Submit a private crime report that is visible only to police, admin, and you."
                    : "Review crime reports, move them through investigation stages, and broadcast public alerts when needed."}
                eyebrow={canSubmit ? "Crime reporting" : "Reported cases"}
                title={canSubmit ? "Report a crime" : "Reported cases"}
            />

            {canSubmit ? (
                <form onSubmit={handleSubmitReport}>
                    <SectionCard description="Tell us what happened. Only you, police, and admin can view the submitted report." title="Submit report">
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Title
                                <input className={inputClassName} onChange={(event) => setReportForm((current) => ({...current, title: event.target.value}))} value={reportForm.title} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Location
                                <input className={inputClassName} onChange={(event) => setReportForm((current) => ({...current, location: event.target.value}))} value={reportForm.location} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                Description
                                <textarea className={textareaClassName} onChange={(event) => setReportForm((current) => ({...current, description: event.target.value}))} value={reportForm.description} />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Incident date and time
                                <input className={inputClassName} onChange={(event) => setReportForm((current) => ({...current, incidentDateTime: event.target.value || null}))} type="datetime-local" value={reportForm.incidentDateTime ?? ""} />
                            </label>
                        </div>
                        <div className="mt-5">
                            <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                                {isSubmitting ? "Sending report" : "Send to police"}
                            </button>
                        </div>
                    </SectionCard>
                </form>
            ) : null}

            {canManage ? (
                <SectionCard description="Set a default public alert message and severity. Use the broadcast action on any report to publish it to all users." title="Broadcast defaults">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                            Broadcast message
                            <textarea className={textareaClassName} onChange={(event) => setBroadcastMessage(event.target.value)} placeholder="Police have acknowledged a public report near Central Market. Avoid the area and follow official instructions." value={broadcastMessage} />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Severity
                            <select className={inputClassName} onChange={(event) => setBroadcastSeverity(event.target.value as AlertSeverity)} value={broadcastSeverity}>
                                {AlertSeverityOptions.map((option) => (
                                    <option key={option} value={option}>{formatEnumLabel(option)}</option>
                                ))}
                            </select>
                        </label>
                        <div className="flex items-end">
                            <p className={`rounded-2xl px-4 py-3 text-sm font-medium ${severityTone[broadcastSeverity]} bg-slate-50`}>
                                Selected severity: {formatEnumLabel(broadcastSeverity)}
                            </p>
                        </div>
                    </div>
                </SectionCard>
            ) : null}

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

            <SectionCard description={canManage ? "All crime reports are listed newest first." : "Track your submitted reports and the latest status updates."} title={canSubmit ? "My reports" : "Reported cases"}>
                {isLoading ? <LoadingBlock label="Loading crime reports" /> : null}
                {!isLoading && !error && reports.length === 0 ? (
                    <EmptyState description={canSubmit ? "You have not submitted a report yet." : "There are no crime reports waiting for review."} title={canSubmit ? "No reports submitted" : "No reported cases"} />
                ) : null}
                {!isLoading && !error && reports.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>Report</th>
                                    <th className={tableHeadCellClassName}>Location</th>
                                    {canManage ? <th className={tableHeadCellClassName}>Reporter</th> : null}
                                    <th className={tableHeadCellClassName}>Status</th>
                                    <th className={tableHeadCellClassName}>Submitted</th>
                                    <th className={tableHeadCellClassName}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {reports.map((report) => (
                                    <tr key={report.reportId}>
                                        <td className={tableCellClassName}>
                                            <div className="font-semibold text-slate-900">{report.title}</div>
                                            <div className="mt-1 text-xs text-slate-500">{report.publicBroadcasted ? "Broadcasted to public alerts" : "Private report"}</div>
                                        </td>
                                        <td className={tableCellClassName}>{report.location}</td>
                                        {canManage ? <td className={tableCellClassName}>{report.reporterName}</td> : null}
                                        <td className={tableCellClassName}><StatusBadge label={formatEnumLabel(report.status)} tone={statusTone[report.status]} /></td>
                                        <td className={tableCellClassName}>{formatDateTime(report.createdAt)}</td>
                                        <td className={tableCellClassName}>
                                            <div className="flex flex-wrap gap-2">
                                                <Link className={secondaryButtonClassName} to={`/app/reports/${report.reportId}`}>View timeline</Link>
                                                {canManage ? (
                                                    <>
                                                        <button className={secondaryButtonClassName} disabled={isReviewing === report.reportId} onClick={() => void handleStatusUpdate(report.reportId, "UNDER_REVIEW", "Report acknowledged and moved under review")} type="button">Acknowledge</button>
                                                        <button className={secondaryButtonClassName} disabled={isReviewing === report.reportId} onClick={() => void handleStatusUpdate(report.reportId, "INVESTIGATING", "Investigation started")} type="button">Investigating</button>
                                                        <button className={secondaryButtonClassName} disabled={isReviewing === report.reportId} onClick={() => void handleStatusUpdate(report.reportId, "SUSPECT_IDENTIFIED", "Suspect identified")} type="button">Suspect identified</button>
                                                        <button className={secondaryButtonClassName} disabled={isReviewing === report.reportId} onClick={() => void handleStatusUpdate(report.reportId, "CRIMINAL_CAUGHT", "Suspect apprehended")} type="button">Criminal caught</button>
                                                        <button className={secondaryButtonClassName} disabled={isBroadcasting === report.reportId} onClick={() => void handleBroadcast(report.reportId)} type="button">Broadcast</button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </SectionCard>

            {detail ? (
                <SectionCard description="Latest submitted or updated report details." title="Latest report snapshot">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">Title</p>
                            <p className="mt-2 text-base font-semibold text-slate-900">{detail.title}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">Status</p>
                            <div className="mt-2"><StatusBadge label={formatEnumLabel(detail.status)} tone={statusTone[detail.status]} /></div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">Broadcast</p>
                            <p className="mt-2 text-base font-semibold text-slate-900">{detail.publicBroadcasted ? "Visible in alerts" : "Private"}</p>
                        </div>
                    </div>
                </SectionCard>
            ) : null}
        </section>
    );
}
