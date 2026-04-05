import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {
    BroadcastCrimeReportRequest,
    CrimeReportDetailDto,
    CrimeReportSummaryDto,
    CreateCrimeReportRequest,
    UpdateCrimeReportStatusRequest
} from "../dtos/crime-report.ts";

export const submitCrimeReport = async (request: CreateCrimeReportRequest): Promise<CrimeReportDetailDto> => {
    try {
        const res = await api.post<ApiResponse<CrimeReportDetailDto>>("/crime-reports", request);
        return requireApiData(res.data, "Failed to submit crime report");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to submit crime report"));
    }
};

export const getMyCrimeReports = async (): Promise<CrimeReportSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<CrimeReportSummaryDto[]>>("/crime-reports/mine");
        return requireApiData(res.data, "Failed to load your crime reports");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load your crime reports"));
    }
};

export const getAllCrimeReports = async (): Promise<CrimeReportSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<CrimeReportSummaryDto[]>>("/crime-reports");
        return requireApiData(res.data, "Failed to load reported cases");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load reported cases"));
    }
};

export const getCrimeReport = async (reportId: number): Promise<CrimeReportDetailDto> => {
    try {
        const res = await api.get<ApiResponse<CrimeReportDetailDto>>(`/crime-reports/${reportId}`);
        return requireApiData(res.data, "Failed to load crime report");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load crime report"));
    }
};

export const updateCrimeReportStatus = async (reportId: number, request: UpdateCrimeReportStatusRequest): Promise<CrimeReportDetailDto> => {
    try {
        const res = await api.patch<ApiResponse<CrimeReportDetailDto>>(`/crime-reports/${reportId}/status`, request);
        return requireApiData(res.data, "Failed to update crime report status");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update crime report status"));
    }
};

export const broadcastCrimeReport = async (reportId: number, request: BroadcastCrimeReportRequest): Promise<CrimeReportDetailDto> => {
    try {
        const res = await api.post<ApiResponse<CrimeReportDetailDto>>(`/crime-reports/${reportId}/broadcast`, request);
        return requireApiData(res.data, "Failed to broadcast crime report");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to broadcast crime report"));
    }
};
