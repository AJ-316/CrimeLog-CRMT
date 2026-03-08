import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {CaseDetailDto, CaseParticipantCreateRequest, CaseParticipantDto, CaseSummaryDto, CreateCaseRequest} from "../dtos/case.ts";

export const getCases = async (): Promise<CaseSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<CaseSummaryDto[]>>("/cases");
        return requireApiData(res.data, "Failed to load cases");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load cases"));
    }
};

export const getCaseDetails = async (caseId: number): Promise<CaseDetailDto> => {
    try {
        const res = await api.get<ApiResponse<CaseDetailDto>>(`/cases/${caseId}`);
        return requireApiData(res.data, "Failed to load case details");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load case details"));
    }
};

export const createCase = async (request: CreateCaseRequest): Promise<CaseSummaryDto> => {
    try {
        const res = await api.post<ApiResponse<CaseSummaryDto>>("/cases", request);
        return requireApiData(res.data, "Failed to create case");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to create case"));
    }
};

export const getCaseParticipants = async (caseId: number): Promise<CaseParticipantDto[]> => {
    try {
        const res = await api.get<ApiResponse<CaseParticipantDto[]>>(`/cases/${caseId}/persons`);
        return requireApiData(res.data, "Failed to load case participants");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load case participants"));
    }
};

export const addCaseParticipant = async (caseId: number, request: CaseParticipantCreateRequest): Promise<CaseParticipantDto> => {
    try {
        const res = await api.post<ApiResponse<CaseParticipantDto>>(`/cases/${caseId}/persons`, request);
        return requireApiData(res.data, "Failed to add participant");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to add participant"));
    }
};

export const getAssignedCases = async (lawyerUserId: number): Promise<CaseSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<CaseSummaryDto[]>>(`/cases/assigned?lawyerUserId=${lawyerUserId}`);
        return requireApiData(res.data, "Failed to load assigned cases");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load assigned cases"));
    }
};

