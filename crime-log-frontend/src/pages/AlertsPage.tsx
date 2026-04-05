import {useEffect, useMemo, useState, type FormEvent} from "react";
import {useOutletContext} from "react-router-dom";
import type {AlertDto} from "../api/dtos/alert.ts";
import {createAlert, getAlerts} from "../api/services/alert-services.ts";
import {AlertSeverityOptions, type AlertSeverity} from "../api/types.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    inputClassName,
    primaryButtonClassName,
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

export default function AlertsPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const [alerts, setAlerts] = useState<AlertDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertSeverity>("MEDIUM");

    const canCreate = role === "ADMIN" || role === "OFFICER";

    const sortedAlerts = useMemo(() => [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [alerts]);

    const loadAlerts = async () => {
        try {
            setIsLoading(true);
            setError("");
            setAlerts(await getAlerts());
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load alerts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadAlerts();
    }, []);

    const handleCreateAlert = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!message.trim()) {
            setError("Alert message is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await createAlert({message: message.trim(), severity});
            setMessage("");
            setSeverity("MEDIUM");
            await loadAlerts();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to create alert");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description={canCreate
                    ? "Create public safety alerts and monitor all active notifications published to users."
                    : "Review active public safety notifications published by administrators and officers."}
                eyebrow="Public safety alerts"
                title="Alerts"
            />

            {canCreate ? (
                <form onSubmit={handleCreateAlert}>
                    <SectionCard description="Publish a new alert for public users. Keep it short and action-oriented." title="Create alert">
                        <div className="grid gap-4 md:grid-cols-3">
                            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                Alert message
                                <textarea
                                    className={textareaClassName}
                                    onChange={(event) => setMessage(event.target.value)}
                                    placeholder="There is a robbery reported near Central Bank, Sector 12. Stay alert and avoid the area."
                                    value={message}
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Severity
                                <select className={inputClassName} onChange={(event) => setSeverity(event.target.value as AlertSeverity)} value={severity}>
                                    {AlertSeverityOptions.map((option) => (
                                        <option key={option} value={option}>{formatEnumLabel(option)}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-5">
                            <button className={primaryButtonClassName} disabled={isSubmitting} type="submit">
                                {isSubmitting ? "Publishing alert" : "Publish alert"}
                            </button>
                        </div>
                    </SectionCard>
                </form>
            ) : null}

            <SectionCard description="Alerts are shown newest first." title="Active alerts">
                {isLoading ? <LoadingBlock label="Loading alerts" /> : null}
                {!isLoading && error ? <EmptyState description={error} title="Unable to load alerts" /> : null}
                {!isLoading && !error && sortedAlerts.length === 0 ? (
                    <EmptyState description="No public alerts are active right now." title="No active alerts" />
                ) : null}
                {!isLoading && !error && sortedAlerts.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>Message</th>
                                    <th className={tableHeadCellClassName}>Severity</th>
                                    <th className={tableHeadCellClassName}>Published by</th>
                                    <th className={tableHeadCellClassName}>Published at</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {sortedAlerts.map((alert) => (
                                    <tr key={alert.alertId}>
                                        <td className={tableCellClassName}>{alert.message}</td>
                                        <td className={`${tableCellClassName} font-semibold ${severityTone[alert.severity]}`}>{formatEnumLabel(alert.severity)}</td>
                                        <td className={tableCellClassName}>{formatEnumLabel(alert.createdByRole)}</td>
                                        <td className={tableCellClassName}>{formatDateTime(alert.createdAt)}</td>
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
