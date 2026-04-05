import {useEffect, useState} from "react";
import {Link, useParams, useOutletContext} from "react-router-dom";
import type {CrimeReportDetailDto} from "../api/dtos/crime-report.ts";
import {getCrimeReport} from "../api/services/crime-report-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge
} from "../components/app/WorkspaceUi.tsx";
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";

const statusTone: Record<string, "slate" | "blue" | "amber" | "emerald" | "rose"> = {
    SENT_TO_POLICE: "slate",
    UNDER_REVIEW: "blue",
    INVESTIGATING: "amber",
    SUSPECT_IDENTIFIED: "rose",
    CRIMINAL_CAUGHT: "emerald",
    CLOSED: "slate"
};

export default function CrimeReportDetailsPage() {
    const {reportId} = useParams();
    const {role} = useOutletContext<AppOutletContext>();
    const [report, setReport] = useState<CrimeReportDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = Number(reportId);
        if (!Number.isInteger(id)) {
            setError("Invalid crime report selected");
            setIsLoading(false);
            return;
        }

        const loadReport = async () => {
            try {
                setIsLoading(true);
                setError("");
                setReport(await getCrimeReport(id));
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load crime report");
            } finally {
                setIsLoading(false);
            }
        };

        void loadReport();
    }, [reportId]);

    return (
        <section className="space-y-6">
            <PageHeader
                actions={<Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" to="/app/reports">Back to reports</Link>}
                description={role === "PUBLIC" ? "Track the progress of a report you submitted." : "Review the full report trail and investigation notes."}
                eyebrow="Crime report"
                title={report ? report.title : "Report details"}
            />

            {isLoading ? <LoadingBlock label="Loading report details" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load this report" /> : null}

            {!isLoading && report ? (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                            <p className="text-sm font-medium text-slate-500">Current status</p>
                            <div className="mt-3"><StatusBadge label={formatEnumLabel(report.status)} tone={statusTone[report.status]} /></div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                            <p className="text-sm font-medium text-slate-500">Reporter</p>
                            <p className="mt-3 text-lg font-semibold text-slate-900">{report.reporterName}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                            <p className="text-sm font-medium text-slate-500">Broadcast</p>
                            <p className="mt-3 text-lg font-semibold text-slate-900">{report.publicBroadcasted ? "Shared with public" : "Private report"}</p>
                        </div>
                    </div>

                    <SectionCard title="Report information" description="The original crime report submitted by the public user.">
                        <dl className="grid gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Location</dt>
                                <dd className="mt-1 text-base text-slate-900">{report.location}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Incident time</dt>
                                <dd className="mt-1 text-base text-slate-900">{report.incidentDateTime ? formatDateTime(report.incidentDateTime) : "Not provided"}</dd>
                            </div>
                            <div className="md:col-span-2">
                                <dt className="text-sm font-medium text-slate-500">Description</dt>
                                <dd className="mt-1 whitespace-pre-wrap text-base leading-7 text-slate-900">{report.description}</dd>
                            </div>
                        </dl>
                    </SectionCard>

                    <SectionCard title="Timeline" description="Status updates and review notes added by police or admin.">
                        <div className="space-y-4">
                            {report.timeline.length === 0 ? <EmptyState description="No timeline entries are available yet." title="No timeline" /> : null}
                            {report.timeline.map((entry) => (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={`${entry.status}-${entry.createdAt}`}>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <StatusBadge label={formatEnumLabel(entry.status)} tone={statusTone[entry.status]} />
                                            <p className="text-sm font-semibold text-slate-900">{entry.changedByName}</p>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatEnumLabel(entry.changedByRole)}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">{formatDateTime(entry.createdAt)}</p>
                                    </div>
                                    {entry.note ? <p className="mt-3 text-sm leading-7 text-slate-700">{entry.note}</p> : null}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </>
            ) : null}
        </section>
    );
}
