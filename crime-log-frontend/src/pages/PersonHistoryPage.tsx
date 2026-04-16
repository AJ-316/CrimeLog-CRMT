import {useCallback, useEffect, useMemo, useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import type {PersonCriminalHistoryDto} from "../api/dtos/person-history.ts";
import type {PersonOptionDto} from "../api/dtos/reference.ts";
import {deletePerson, getPersonHistory} from "../api/services/person-services.ts";
import {getPeople} from "../api/services/reference-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    dangerButtonClassName as destructiveButtonClassName,
    inputClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatDate, formatEnumLabel, formatParticipantRole} from "../utils/display.ts";

type SortKey = "name" | "nationalId" | "total" | "active" | "closed";

interface PersonDirectoryRow {
    person: PersonOptionDto;
    history: PersonCriminalHistoryDto;
}

export default function PersonHistoryPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const [rows, setRows] = useState<PersonDirectoryRow[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
    const [suspectOnly, setSuspectOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortAscending, setSortAscending] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const canManagePeople = role === "ADMIN" || role === "OFFICER";

    const loadDirectory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const people = await getPeople();
            const historyResponses = await Promise.all(people.map(async (person) => ({
                person,
                history: await getPersonHistory(person.personId, suspectOnly)
            })));

            setRows(historyResponses);
            if (historyResponses.length === 0) {
                setSelectedPersonId(null);
                return;
            }

            setSelectedPersonId((currentValue) => {
                if (currentValue && historyResponses.some((row) => row.person.personId === currentValue)) {
                    return currentValue;
                }

                return null;
            });
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load people directory");
        } finally {
            setIsLoading(false);
        }
    }, [role, suspectOnly]);

    useEffect(() => {
        void loadDirectory();
    }, [loadDirectory]);

    const description = useMemo(() => {
        if (suspectOnly) {
            return "Showing suspect-only case links to quickly review accused-side criminal history.";
        }

        return "Showing every involvement role across cases, including victim, witness, and accused links.";
    }, [suspectOnly]);

    const selectedRow = useMemo(
        () => rows.find((row) => row.person.personId === selectedPersonId) ?? null,
        [rows, selectedPersonId]
    );

    const filteredRows = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const matchingRows = rows.filter((row) => {
            if (!query) {
                return true;
            }

            const name = row.person.fullName.toLowerCase();
            const nationalId = row.person.nationalId.toLowerCase();
            return name.includes(query) || nationalId.includes(query);
        });

        const sortedRows = [...matchingRows].sort((a, b) => {
            const factor = sortAscending ? 1 : -1;
            switch (sortKey) {
                case "name":
                    return a.person.fullName.localeCompare(b.person.fullName) * factor;
                case "nationalId":
                    return a.person.nationalId.localeCompare(b.person.nationalId) * factor;
                case "total":
                    return (a.history.totalInvolvements - b.history.totalInvolvements) * factor;
                case "active":
                    return (a.history.activeCases - b.history.activeCases) * factor;
                case "closed":
                    return (a.history.closedCases - b.history.closedCases) * factor;
                default:
                    return 0;
            }
        });

        return sortedRows;
    }, [rows, searchQuery, sortKey, sortAscending]);

    const handleDelete = async (personId: number, fullName: string) => {
        if (!canManagePeople) {
            return;
        }

        const confirmed = window.confirm(`Delete ${fullName}? This cannot be undone.`);
        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            setError("");
            await deletePerson(personId);
            await loadDirectory();
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete person");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                actions={role === "ADMIN" || role === "OFFICER" ? <Link className={primaryButtonClassName} to="/app/persons/new">Add person</Link> : undefined}
                description="Browse every person in one list, search and sort records, toggle suspect-only history mode, and update person profiles."
                eyebrow={role === "LAWYER" ? "Client history" : "Criminal records"}
                title="People directory"
            />

            <SectionCard description="Search, sort, and switch history mode for all people in the registry." title="People filters">
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                        Search
                        <input
                            className={inputClassName}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by name or national ID"
                            value={searchQuery}
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Sort by
                        <select className={inputClassName} onChange={(event) => setSortKey(event.target.value as SortKey)} value={sortKey}>
                            <option value="name">Name</option>
                            <option value="nationalId">National ID</option>
                            <option value="total">Total cases</option>
                            <option value="active">Active cases</option>
                            <option value="closed">Closed cases</option>
                        </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Direction
                        <select className={inputClassName} onChange={(event) => setSortAscending(event.target.value === "asc")} value={sortAscending ? "asc" : "desc"}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                </div>
                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input
                        checked={suspectOnly}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        onChange={(event) => setSuspectOnly(event.target.checked)}
                        type="checkbox"
                    />
                    Suspect-only mode
                </label>
            </SectionCard>

            {error ? <EmptyState description={error} title="Unable to load people directory" /> : null}
            {isLoading ? <LoadingBlock label="Loading people directory" /> : null}

            {!isLoading ? (
                <SectionCard description={description} title="People list">
                    {filteredRows.length === 0 ? (
                        <EmptyState description="No matching people found for the current filters." title="No results" />
                    ) : (
                        <div className={tableContainerClassName}>
                            <table className={tableClassName}>
                                <thead>
                                    <tr>
                                        <th className={tableHeadCellClassName}>Person</th>
                                        <th className={tableHeadCellClassName}>National ID</th>
                                        <th className={tableHeadCellClassName}>Total</th>
                                        <th className={tableHeadCellClassName}>Active</th>
                                        <th className={tableHeadCellClassName}>Closed</th>
                                        <th className={tableHeadCellClassName}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {filteredRows.map((row) => (
                                        <tr
                                            className={`${row.person.personId === selectedPersonId ? "bg-blue-50/60" : ""} cursor-pointer transition hover:bg-blue-50/40`}
                                            key={row.person.personId}
                                            onClick={() => setSelectedPersonId(row.person.personId)}
                                        >
                                            <td className={tableCellClassName}>{row.person.fullName}</td>
                                            <td className={tableCellClassName}>{row.person.nationalId}</td>
                                            <td className={tableCellClassName}>{row.history.totalInvolvements}</td>
                                            <td className={tableCellClassName}>{row.history.activeCases}</td>
                                            <td className={tableCellClassName}>{row.history.closedCases}</td>
                                            <td className={tableCellClassName}>
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        className={secondaryButtonClassName}
                                                        to={`/app/people/${row.person.personId}${suspectOnly ? "?mode=suspect" : ""}`}
                                                    >
                                                        View history
                                                    </Link>
                                                    {canManagePeople ? (
                                                        <>
                                                            <Link
                                                                className={primaryButtonClassName}
                                                                to={`/app/people/${row.person.personId}/edit${suspectOnly ? "?mode=suspect" : ""}`}
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                className={destructiveButtonClassName}
                                                                disabled={isDeleting}
                                                                onClick={() => void handleDelete(row.person.personId, row.person.fullName)}
                                                                type="button"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>
            ) : null}

            {!isLoading && selectedRow ? (
                <>
                    {selectedRow.history.totalInvolvements === 0 ? (
                        <SectionCard className="scroll-mt-24" description="No case history is linked to this person yet." title={selectedRow.history.fullName}>
                            <EmptyState description="This person does not have any linked FIR or case records in the database right now." title="No history available" />
                        </SectionCard>
                    ) : (
                        <>
                            <SectionCard className="scroll-mt-24" description={description} title={selectedRow.history.fullName}>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">National ID</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.history.nationalId}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">Total linked cases</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">{selectedRow.history.totalInvolvements}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">Active</p>
                                        <p className="mt-2 text-xl font-semibold text-blue-700">{selectedRow.history.activeCases}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">Closed</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-700">{selectedRow.history.closedCases}</p>
                                    </div>
                                </div>
                                {canManagePeople ? (
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link className={primaryButtonClassName} to={`/app/people/${selectedRow.person.personId}/edit${suspectOnly ? "?mode=suspect" : ""}`}>
                                            Edit profile
                                        </Link>
                                        <button className={destructiveButtonClassName} disabled={isDeleting} onClick={() => void handleDelete(selectedRow.person.personId, selectedRow.person.fullName)} type="button">
                                            {isDeleting ? "Deleting" : "Delete person"}
                                        </button>
                                    </div>
                                ) : null}
                            </SectionCard>

                            <SectionCard description="Case-level history for the selected person." title="Case involvements">
                                {selectedRow.history.involvements.length === 0 ? (
                                    <EmptyState description="This person has a history record, but no linked case entries are present in the selected mode." title="No involvements found" />
                                ) : (
                            <div className={tableContainerClassName}>
                                <table className={tableClassName}>
                                    <thead>
                                        <tr>
                                            <th className={tableHeadCellClassName}>Case</th>
                                            <th className={tableHeadCellClassName}>Role</th>
                                            <th className={tableHeadCellClassName}>Status</th>
                                            <th className={tableHeadCellClassName}>Investigating unit</th>
                                            <th className={tableHeadCellClassName}>FIR</th>
                                            <th className={tableHeadCellClassName}>Linked on</th>
                                            <th className={tableHeadCellClassName}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {selectedRow.history.involvements.map((involvement) => (
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
                                                <td className={tableCellClassName}>{formatDate(involvement.linkedOn)}</td>
                                                <td className={tableCellClassName}>
                                                    <Link className={secondaryButtonClassName} to={`/app/cases/${involvement.caseId}`}>Open case</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                                )}
                            </SectionCard>
                        </>
                    )}
                </>
            ) : !isLoading ? (
                <SectionCard description="Click any person row to preview the detailed history panel." title="Select a person">
                    <EmptyState description="No person is selected yet. Choose a row in the people list to view the history details here." title="Nothing selected" />
                </SectionCard>
            ) : null}
        </section>
    );
}
