import {useEffect, useMemo, useState} from "react";
import {Link, useOutletContext, useParams, useSearchParams} from "react-router-dom";
import type {PersonDto} from "../api/dtos/personDto.ts";
import type {PersonCriminalHistoryDto} from "../api/dtos/person-history.ts";
import {getPerson, getPersonHistory} from "../api/services/person-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    primaryButtonClassName,
    secondaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatDate, formatEnumLabel, formatParticipantRole} from "../utils/display.ts";

const formatAddress = (address: PersonDto["birthPlace"] | null | undefined): string => {
    if (!address) {
        return "Not available";
    }

    const parts = [address.street, address.city, address.state, address.postalCode, address.countryCode]
        .map((value) => value?.trim())
        .filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Not available";
};

const buildFullName = (person: PersonDto): string => {
    const parts = [person.firstName, person.middleName, person.lastName]
        .map((value) => (value ?? "").trim())
        .filter(Boolean);
    return parts.join(" ");
};

const resolveProfilePhotoSrc = (person: PersonDto): string | null => {
    if (person.profilePhotoData?.trim() && person.profilePhotoContentType?.trim()) {
        return `data:${person.profilePhotoContentType};base64,${person.profilePhotoData}`;
    }

    const photoPath = person.profilePhotoPath?.trim();
    if (!photoPath) {
        return null;
    }

    if (photoPath.startsWith("http://") || photoPath.startsWith("https://") || photoPath.startsWith("/")) {
        return photoPath;
    }

    return `/${photoPath}`;
};

export default function PersonDetailsPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const {personId: personIdParam} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [person, setPerson] = useState<PersonDto | null>(null);
    const [history, setHistory] = useState<PersonCriminalHistoryDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageBroken, setImageBroken] = useState(false);

    const personId = Number(personIdParam);
    const suspectOnly = searchParams.get("mode") === "suspect";
    const canManagePeople = role === "ADMIN" || role === "OFFICER";

    useEffect(() => {
        setImageBroken(false);
    }, [person?.profilePhotoPath, person?.profilePhotoData, person?.profilePhotoContentType]);

    useEffect(() => {
        if (!Number.isInteger(personId) || personId <= 0) {
            setError("Invalid person ID.");
            setIsLoading(false);
            return;
        }

        const loadPersonDetails = async () => {
            try {
                setIsLoading(true);
                setError("");
                const [personResponse, historyResponse] = await Promise.all([
                    getPerson(personId),
                    getPersonHistory(personId, suspectOnly)
                ]);
                setPerson(personResponse);
                setHistory(historyResponse);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load person history");
            } finally {
                setIsLoading(false);
            }
        };

        void loadPersonDetails();
    }, [personId, suspectOnly]);

    const fullName = useMemo(() => {
        if (!person) {
            return "Person details";
        }

        const composedName = buildFullName(person);
        return composedName || "Person details";
    }, [person]);

    const profilePhotoSrc = useMemo(() => {
        if (!person) {
            return null;
        }

        return resolveProfilePhotoSrc(person);
    }, [person]);

    const fallbackInitials = useMemo(() => {
        const sourceName = history?.fullName ?? fullName;
        const initials = sourceName
            .split(" ")
            .map((part) => part.trim())
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");

        return initials || "NA";
    }, [fullName, history?.fullName]);

    const handleModeChange = (checked: boolean) => {
        if (checked) {
            setSearchParams({mode: "suspect"});
            return;
        }

        setSearchParams({});
    };

    return (
        <section className="space-y-6">
            <PageHeader
                actions={(
                    <>
                        {canManagePeople ? (
                            <Link className={primaryButtonClassName} to={`/app/people/${personId}/edit${suspectOnly ? "?mode=suspect" : ""}`}>
                                Edit person
                            </Link>
                        ) : null}
                        <Link className={secondaryButtonClassName} to="/app/people">Back to people list</Link>
                    </>
                )}
                description="Complete profile view with personal data, contacts, addresses, and every linked case involvement."
                eyebrow="Person history"
                title={fullName}
            />

            <SectionCard description="Switch between all involvements and suspect-only mode for this person." title="History mode">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input
                        checked={suspectOnly}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        onChange={(event) => handleModeChange(event.target.checked)}
                        type="checkbox"
                    />
                    Suspect-only mode
                </label>
            </SectionCard>

            {isLoading ? <LoadingBlock label="Loading person details" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load person history" /> : null}

            {!isLoading && !error && person && history ? (
                <>
                        <SectionCard description="Identity snapshot and profile photo." title="Profile overview">
                            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                                <div className="flex justify-center lg:justify-start">
                                    {profilePhotoSrc && !imageBroken ? (
                                        <img
                                            alt={`${fullName} profile`}
                                            className="h-48 w-48 rounded-3xl border border-slate-200 object-cover shadow-sm"
                                            onError={() => setImageBroken(true)}
                                            src={profilePhotoSrc}
                                        />
                                    ) : (
                                        <div className="flex h-48 w-48 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-4xl font-semibold text-slate-500 shadow-sm">
                                            {fallbackInitials}
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">National ID</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{person.nationalId || "Not available"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Date of birth</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{formatDate(person.dateOfBirth)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gender</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{formatEnumLabel(person.gender)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nationality</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{person.nationalityCode || "Not available"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Primary contact</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{person.contactPrimary || "Not available"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Secondary contact</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{person.contactSecondary || "Not available"}</p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard description="Detailed address records captured for this person." title="Address details">
                            <div className="grid gap-4 lg:grid-cols-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Birth place</p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{formatAddress(person.birthPlace)}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Permanent address</p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{formatAddress(person.permanentAddress)}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current address</p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{formatAddress(person.currentAddress)}</p>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard description="Summary of all linked cases in the selected mode." title="History summary">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-blue-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-blue-700">Total involvements</p>
                                    <p className="mt-2 text-2xl font-semibold text-blue-900">{history.totalInvolvements}</p>
                                </div>
                                <div className="rounded-2xl bg-amber-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Active cases</p>
                                    <p className="mt-2 text-2xl font-semibold text-amber-900">{history.activeCases}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-100 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-700">Closed cases</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{history.closedCases}</p>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard description="Case-by-case involvement timeline for this person." title="Case involvements">
                            {history.involvements.length === 0 ? (
                                <EmptyState description="No case history is linked to this person in the selected mode." title="No case history" />
                            ) : (
                                <div className={tableContainerClassName}>
                                    <table className={tableClassName}>
                                        <thead>
                                            <tr>
                                                <th className={tableHeadCellClassName}>Case</th>
                                                <th className={tableHeadCellClassName}>Role</th>
                                                <th className={tableHeadCellClassName}>Stage</th>
                                                <th className={tableHeadCellClassName}>Investigating unit</th>
                                                <th className={tableHeadCellClassName}>FIR</th>
                                                <th className={tableHeadCellClassName}>Opened</th>
                                                <th className={tableHeadCellClassName}>Closed</th>
                                                <th className={tableHeadCellClassName}>Linked on</th>
                                                <th className={tableHeadCellClassName}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {history.involvements.map((involvement) => (
                                                <tr key={`${involvement.caseId}-${involvement.linkedOn ?? involvement.involvementType}`}>
                                                    <td className={tableCellClassName}>{involvement.caseNumber}</td>
                                                    <td className={tableCellClassName}>{formatParticipantRole(involvement.involvementType)}</td>
                                                    <td className={tableCellClassName}>
                                                        <StatusBadge
                                                            label={formatEnumLabel(involvement.caseStage)}
                                                            tone={involvement.caseStage === "CLOSED" ? "slate" : involvement.caseStage === "TRIAL" ? "amber" : "blue"}
                                                        />
                                                    </td>
                                                    <td className={tableCellClassName}>{involvement.investigatingUnitName ?? "Not assigned"}</td>
                                                    <td className={tableCellClassName}>{involvement.firNumber ?? "Not linked"}</td>
                                                    <td className={tableCellClassName}>{formatDate(involvement.openedOn)}</td>
                                                    <td className={tableCellClassName}>{formatDate(involvement.closedOn)}</td>
                                                    <td className={tableCellClassName}>{formatDate(involvement.linkedOn)}</td>
                                                    <td className={tableCellClassName}>
                                                        <Link className={primaryButtonClassName} to={`/app/cases/${involvement.caseId}`}>Open case</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </SectionCard>
                </>
            ) : null}
        </section>
    );
}
