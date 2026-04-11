import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import type {FirSummaryDto} from "../api/dtos/fir.ts";
import type {FirType} from "../api/types.ts";
import {FirTypeOptions} from "../api/types.ts";
import {getFirs, searchFirs} from "../api/services/fir-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
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
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatDateTime, formatEnumLabel} from "../utils/display.ts";
import {getCurrentOfficerProfile} from "../api/services/officer-services.ts";
import type {OfficerProfileDto} from "../api/dtos/officer.ts";

export default function FIRListPage() {
    const navigate = useNavigate();
    const outletContext = useOutletContext<AppOutletContext | undefined>();
    const role = outletContext?.role ?? "PUBLIC";
    const [firs, setFirs] = useState<FirSummaryDto[]>([]);
    const [officerProfile, setOfficerProfile] = useState<OfficerProfileDto | null>(null);
    const [queryFilter, setQueryFilter] = useState("");
    const [firTypeFilter, setFirTypeFilter] = useState<FirType | "">("");
    const [linkedFilter, setLinkedFilter] = useState("");
    const [registeredFrom, setRegisteredFrom] = useState("");
    const [registeredTo, setRegisteredTo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFirs = async () => {
            try {
                setIsLoading(true);
                setError("");

                const hasSearchFilters =
                    Boolean(queryFilter.trim()) ||
                    Boolean(firTypeFilter) ||
                    Boolean(linkedFilter) ||
                    Boolean(registeredFrom) ||
                    Boolean(registeredTo);

                const firPromise = hasSearchFilters
                    ? searchFirs({
                        query: queryFilter.trim() || undefined,
                        firType: firTypeFilter || undefined,
                        linkedToCase: linkedFilter === "" ? undefined : linkedFilter === "true",
                        registeredFrom: registeredFrom ? new Date(registeredFrom).toISOString() : undefined,
                        registeredTo: registeredTo ? new Date(registeredTo).toISOString() : undefined
                    })
                    : getFirs();

                const profilePromise = role === "OFFICER"
                    ? getCurrentOfficerProfile()
                    : Promise.resolve(null);

                const [firList, profile] = await Promise.all([firPromise, profilePromise]);
                setOfficerProfile(profile);
                setFirs(firList);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load FIRs");
            } finally {
                setIsLoading(false);
            }
        };

        void loadFirs();
    }, [queryFilter, firTypeFilter, linkedFilter, registeredFrom, registeredTo, role]);

    const visibleFirs = useMemo(() => {
        if (role !== "OFFICER" || !officerProfile) {
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
                <div className="mb-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Keyword
                        <input
                            className={inputClassName}
                            onChange={(event) => setQueryFilter(event.target.value)}
                            placeholder="FIR number, accused name, description"
                            value={queryFilter}
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        FIR type
                        <select className={inputClassName} onChange={(event) => setFirTypeFilter(event.target.value as FirType | "")} value={firTypeFilter}>
                            <option value="">All types</option>
                            {FirTypeOptions.map((firType) => (
                                <option key={firType} value={firType}>{formatEnumLabel(firType)}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Linked to case
                        <select className={inputClassName} onChange={(event) => setLinkedFilter(event.target.value)} value={linkedFilter}>
                            <option value="">All</option>
                            <option value="true">Linked only</option>
                            <option value="false">Unlinked only</option>
                        </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Registered from
                        <input className={inputClassName} onChange={(event) => setRegisteredFrom(event.target.value)} type="datetime-local" value={registeredFrom} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Registered to
                        <input className={inputClassName} onChange={(event) => setRegisteredTo(event.target.value)} type="datetime-local" value={registeredTo} />
                    </label>
                    <div className="flex items-end">
                        <p className="text-xs text-slate-500">Filters run live and use the new FIR search API.</p>
                    </div>
                </div>

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
