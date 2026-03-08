import {useEffect, useState} from "react";
import {Link, useOutletContext, useParams} from "react-router-dom";
import type {FirDetailDto} from "../api/dtos/fir.ts";
import {getFir} from "../api/services/fir-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    primaryButtonClassName,
    secondaryButtonClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatAddress, formatDateTime, formatEnumLabel} from "../utils/display.ts";

export default function FIRDetailsPage() {
    const {firId} = useParams();
    const {role} = useOutletContext<AppOutletContext>();
    const [fir, setFir] = useState<FirDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = Number(firId);
        if (!Number.isInteger(id)) {
            setError("Invalid FIR selected");
            setIsLoading(false);
            return;
        }

        const loadFir = async () => {
            try {
                setIsLoading(true);
                setError("");
                setFir(await getFir(id));
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load FIR details");
            } finally {
                setIsLoading(false);
            }
        };

        void loadFir();
    }, [firId]);

    return (
        <section className="space-y-6">
            <PageHeader
                actions={(
                    <>
                        <Link className={secondaryButtonClassName} to="/app/fir">Back to FIRs</Link>
                        {fir && role === "OFFICER" && !fir.caseId ? (
                            <Link className={primaryButtonClassName} to={`/app/cases/new?firId=${fir.firId}`}>Create case</Link>
                        ) : null}
                        {fir?.caseId ? (
                            <Link className={primaryButtonClassName} to={`/app/cases/${fir.caseId}`}>Open case</Link>
                        ) : null}
                    </>
                )}
                description="View the complete FIR record, accused details, incident location, and linked case progress."
                eyebrow="FIR details"
                title={fir ? fir.firNumber : "FIR record"}
            />

            {isLoading ? <LoadingBlock label="Loading FIR details" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load this FIR" /> : null}

            {!isLoading && fir ? (
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <SectionCard description="Core FIR registration details and current case linkage." title="Overview">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">FIR type</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{formatEnumLabel(fir.firType)}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Registered on</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDateTime(fir.registrationDateTime)}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Origin unit</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{fir.originUnitName ?? "Not set"}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Investigating unit</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{fir.initialInvestigatingUnitName ?? "Not assigned"}</p>
                            </div>
                        </div>
                        <div className="mt-5">
                            {fir.caseNumber ? (
                                <StatusBadge label={`Linked case ${fir.caseNumber}`} tone="emerald" />
                            ) : (
                                <StatusBadge label="No case linked" tone="amber" />
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard description="Accused identity and contact details captured at registration." title="Accused information">
                        <dl className="space-y-4 text-sm text-slate-700">
                            <div>
                                <dt className="font-medium text-slate-500">Name</dt>
                                <dd className="mt-1 text-base font-semibold text-slate-900">{fir.accusedName || "Not set"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">Primary contact</dt>
                                <dd className="mt-1">{fir.accusedContact || "Not set"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-slate-500">Address</dt>
                                <dd className="mt-1 leading-6">{formatAddress(fir.accusedAddress)}</dd>
                            </div>
                        </dl>
                    </SectionCard>

                    <SectionCard className="xl:col-span-2" description="Incident timing, place, and statement recorded in the FIR." title="Incident record">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Incident date and time</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{formatDateTime(fir.incidentDateTime)}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">Incident place</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">{formatAddress(fir.incidentPlace)}</p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">Incident description</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{fir.incidentDescription || "Not set"}</p>
                        </div>
                    </SectionCard>
                </div>
            ) : null}
        </section>
    );
}

