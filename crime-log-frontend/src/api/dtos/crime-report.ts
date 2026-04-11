import type {AlertSeverity, CrimeReportStatus, Role} from "../types.ts";

export interface CrimeReportTimelineDto {
    status: CrimeReportStatus;
    note: string | null;
    changedByUserId: number;
    changedByName: string;
    changedByRole: Role;
    createdAt: string;
}

export interface CrimeReportSummaryDto {
    reportId: number;
    title: string;
    location: string;
    status: CrimeReportStatus;
    reporterUserId: number;
    reporterName: string;
    incidentDateTime: string | null;
    createdAt: string;
    updatedAt: string;
    acknowledgedAt: string | null;
    publicBroadcasted: boolean;
}

export interface CrimeReportDetailDto {
    reportId: number;
    title: string;
    description: string;
    location: string;
    status: CrimeReportStatus;
    reporterUserId: number;
    reporterName: string;
    incidentDateTime: string | null;
    createdAt: string;
    updatedAt: string;
    acknowledgedAt: string | null;
    acknowledgedByName: string | null;
    publicBroadcasted: boolean;
    publicBroadcastedAt: string | null;
    publicBroadcastedByName: string | null;
    timeline: CrimeReportTimelineDto[];
}

export interface CreateCrimeReportRequest {
    title: string;
    description: string;
    location: string;
    incidentDateTime: string | null;
}

export interface UpdateCrimeReportStatusRequest {
    status: CrimeReportStatus;
    note?: string | null;
}

export interface BroadcastCrimeReportRequest {
    message?: string | null;
    severity?: AlertSeverity | null;
}
