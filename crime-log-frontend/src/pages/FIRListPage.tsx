import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import type {FirSummaryDto} from "../api/dtos/fir.ts";
import {getFirs} from "../api/services/fir-services.ts";
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
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";
import {getCurrentOfficerProfile} from "../api/services/officer-services.ts";
import type {OfficerProfileDto} from "../api/dtos/officer.ts";

export default function FIRListPage() {
    const navigate = useNavigate();
    const {role} = useOutletContext<AppOutletContext>();
    const [firs, setFirs] = useState<FirSummaryDto[]>([]);
    const [officerProfile, setOfficerProfile] = useState<OfficerProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFirs = async () => {
            try {
                setIsLoading(true);
                setError("");
                const [firList, profile] = await Promise.all([getFirs(), getCurrentOfficerProfile()]);
                setOfficerProfile(profile);
                setFirs(firList);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load FIRs");
            } finally {
                setIsLoading(false);
            }
        };

        void loadFirs();
    }, []);

    const visibleFirs = useMemo(() => {
        if (!officerProfile) {
            return firs;
        }

        return firs.filter((fir) => fir.initialInvestigatingUnitId === officerProfile.departmentUnitId);
    }, [firs, officerProfile]);

    const canCreateFir = role === "OFFICER" && officerProfile?.unitType === "POLICE_STATION";

    return (
        <section className="space-y-6">
            <PageHeader
                actions={canCreateFir ? <Link className={primaryButtonClassName} to="/app/fir/new">Create FIR</Link> : undefined}
                description="Review registered FIRs, track which entries already moved into case management, and open full details with one click."
                eyebrow="Officer FIR Module"
                title="First information reports"
            />

            <SectionCard description="Each row opens the complete FIR record." title="FIR register">
                {isLoading ? <LoadingBlock label="Loading FIR register" /> : null}
                {!isLoading && error ? <EmptyState description={error} title="Unable to load FIRs" /> : null}
                {!isLoading && !error && !canCreateFir && role === "OFFICER" ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        FIR creation is only allowed for officers posted to police station units.
                    </div>
                ) : null}
                {!isLoading && !error && visibleFirs.length === 0 ? (
                    <EmptyState
                        action={canCreateFir ? <Link className={primaryButtonClassName} to="/app/fir/new">Create FIR</Link> : undefined}
                        description="No FIR is assigned to your current department unit."
                        title="FIR register is empty"
                    />
                ) : null}
                {!isLoading && !error && visibleFirs.length > 0 ? (
                    <div className={tableContainerClassName}>
                        <table className={tableClassName}>
                            <thead>
                                <tr>
                                    <th className={tableHeadCellClassName}>FIR</th>
                                    <th className={tableHeadCellClassName}>Type</th>
                                    <th className={tableHeadCellClassName}>Accused</th>
                                    <th className={tableHeadCellClassName}>Registered</th>
                                    <th className={tableHeadCellClassName}>Investigating unit</th>
                                    <th className={tableHeadCellClassName}>Case</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {visibleFirs.map((fir) => (
                                    <tr
                                        className="cursor-pointer transition hover:bg-slate-50"
                                        key={fir.firId}
                                        onClick={() => navigate(`/app/fir/${fir.firId}`)}
                                    >
                                        <td className={tableCellClassName}>
                                            <div className="font-semibold text-slate-900">{fir.firNumber}</div>
                                            <div className="mt-1 text-xs text-slate-500">{fir.originUnitName ?? "Origin unit not set"}</div>
                                        </td>
                                        <td className={tableCellClassName}>{formatEnumLabel(fir.firType)}</td>
                                        <td className={tableCellClassName}>{fir.accusedName || "Not set"}</td>
                                        <td className={tableCellClassName}>{formatDateTime(fir.registrationDateTime)}</td>
                                        <td className={tableCellClassName}>{fir.initialInvestigatingUnitName ?? "Not assigned"}</td>
                                        <td className={tableCellClassName}>
                                            {fir.caseNumber ? (
                                                <StatusBadge label={fir.caseNumber} tone="emerald" />
                                            ) : (
                                                <StatusBadge label="No case" tone="amber" />
                                            )}
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
