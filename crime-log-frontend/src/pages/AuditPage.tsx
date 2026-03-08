import {useEffect, useState} from "react";
import type {CaseSummaryDto} from "../api/dtos/case.ts";
import type {FirSummaryDto} from "../api/dtos/fir.ts";
import type {RequestSummaryDto} from "../api/dtos/request.ts";
import {getCases} from "../api/services/case-services.ts";
import {getFirs} from "../api/services/fir-services.ts";
import {getPendingRequests} from "../api/services/request-services.ts";
import {EmptyState, LoadingBlock, PageHeader, SectionCard} from "../components/app/WorkspaceUi.tsx";

export default function AuditPage() {
    const [firs, setFirs] = useState<FirSummaryDto[]>([]);
    const [cases, setCases] = useState<CaseSummaryDto[]>([]);
    const [requests, setRequests] = useState<RequestSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAuditView = async () => {
            try {
                setIsLoading(true);
                setError("");
                const [firResults, caseResults, requestResults] = await Promise.all([getFirs(), getCases(), getPendingRequests()]);
                setFirs(firResults);
                setCases(caseResults);
                setRequests(requestResults);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load audit view");
            } finally {
                setIsLoading(false);
            }
        };

        void loadAuditView();
    }, []);

    return (
        <section className="space-y-6">
            <PageHeader
                description="Monitor operational volume across FIRs, case records, and approval traffic from a single administrator view."
                eyebrow="Admin audit"
                title="Operational audit"
            />

            {isLoading ? <LoadingBlock label="Loading audit metrics" /> : null}
            {!isLoading && error ? <EmptyState description={error} title="Unable to load audit metrics" /> : null}
            {!isLoading && !error ? (
                <div className="grid gap-4 md:grid-cols-3">
                    <SectionCard description="Registered FIR records currently visible in the workspace." title="Total FIRs">
                        <p className="text-4xl font-semibold tracking-tight text-slate-950">{firs.length}</p>
                    </SectionCard>
                    <SectionCard description="Cases currently tracked through the case management module." title="Total cases">
                        <p className="text-4xl font-semibold tracking-tight text-slate-950">{cases.length}</p>
                    </SectionCard>
                    <SectionCard description="Pending approval items waiting for an administrator decision." title="Pending approvals">
                        <p className="text-4xl font-semibold tracking-tight text-slate-950">{requests.length}</p>
                    </SectionCard>
                </div>
            ) : null}
        </section>
    );
}

