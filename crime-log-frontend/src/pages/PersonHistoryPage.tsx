import {useEffect, useMemo, useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import type {PersonCriminalHistoryDto} from "../api/dtos/person-history.ts";
import type {PersonOptionDto} from "../api/dtos/reference.ts";
import {getPersonHistory} from "../api/services/person-services.ts";
import {getPeople} from "../api/services/reference-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    inputClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName,
    primaryButtonClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatDate, formatEnumLabel, formatParticipantRole} from "../utils/display.ts";

export default function PersonHistoryPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const [people, setPeople] = useState<PersonOptionDto[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<number>(0);
    const [suspectOnly, setSuspectOnly] = useState(false);
    const [history, setHistory] = useState<PersonCriminalHistoryDto | null>(null);
    const [isLoadingPeople, setIsLoadingPeople] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPeople = async () => {
            try {
                setIsLoadingPeople(true);
                setError("");
                const result = await getPeople();
                setPeople(result);
                if (result.length > 0) {
                    setSelectedPersonId(result[0].personId);
                }
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load people");
            } finally {
                setIsLoadingPeople(false);
            }
        };

        void loadPeople();
    }, []);

    useEffect(() => {
        if (!selectedPersonId) {
            setHistory(null);
            return;
        }

        const loadHistory = async () => {
            try {
                setIsLoadingHistory(true);
                setError("");
                setHistory(await getPersonHistory(selectedPersonId, suspectOnly));
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load history");
            } finally {
                setIsLoadingHistory(false);
            }
        };

        void loadHistory();
    }, [selectedPersonId, suspectOnly]);

    const description = useMemo(() => {
        if (suspectOnly) {
            return "Showing suspect-only case links to quickly review accused-side criminal history.";
        }

        return "Showing every involvement role across cases, including victim, witness, and accused links.";
    }, [suspectOnly]);

    return (
        <section className="space-y-6">
            <PageHeader
                actions={role === "ADMIN" || role === "OFFICER" ? <Link className={primaryButtonClassName} to="/app/persons/new">Add person</Link> : undefined}
                description="Track criminal records by person, switch between all involvements and suspect-only history, and inspect linked cases."
                eyebrow={role === "LAWYER" ? "Client history" : "Criminal records"}
                title="Person history"
            />

            <SectionCard description="Choose a person and scope to load their case history profile." title="History filters">
                {isLoadingPeople ? <LoadingBlock label="Loading people" /> : null}
                {!isLoadingPeople ? (
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                        <label className="block text-sm font-medium text-slate-700">
                            Person
                            <select
                                className={inputClassName}
                                onChange={(event) => setSelectedPersonId(Number(event.target.value))}
                                value={selectedPersonId || ""}
                            >
                                {people.length === 0 ? <option value="">No people available</option> : null}
                                {people.map((person) => (
                                    <option key={person.personId} value={person.personId}>
                                        {person.fullName} ({person.nationalId})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                            <input
                                checked={suspectOnly}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                                onChange={(event) => setSuspectOnly(event.target.checked)}
                                type="checkbox"
                            />
                            Suspect-only mode
                        </label>
                    </div>
                ) : null}
            </SectionCard>

            {error ? <EmptyState description={error} title="Unable to load person history" /> : null}
            {isLoadingHistory ? <LoadingBlock label="Loading person history" /> : null}

            {!isLoadingHistory && history ? (
                <>
                    <SectionCard description={description} title={history.fullName}>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">National ID</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{history.nationalId}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Total linked cases</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{history.totalInvolvements}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Active</p>
                                <p className="mt-2 text-xl font-semibold text-blue-700">{history.activeCases}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Closed</p>
                                <p className="mt-2 text-xl font-semibold text-slate-700">{history.closedCases}</p>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard description="Case-level history for the selected person." title="Case involvements">
                        {history.involvements.length === 0 ? (
                            <EmptyState description="No case records are linked for this person in the selected mode." title="No involvements found" />
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
                                                <td className={tableCellClassName}>{formatDate(involvement.linkedOn)}</td>
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
