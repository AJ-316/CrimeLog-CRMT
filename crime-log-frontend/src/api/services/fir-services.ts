import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {FirDetailDto, FirRegisterRequest, FirSearchParams, FirSummaryDto} from "../dtos/fir.ts";

export const getFirs = async (): Promise<FirSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<FirSummaryDto[]>>("/fir");
        return requireApiData(res.data, "Failed to load FIRs");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load FIRs"));
    }
};

export const searchFirs = async (params: FirSearchParams): Promise<FirSummaryDto[]> => {
    try {
        const searchParams = new URLSearchParams();
        if (params.query?.trim()) searchParams.set("query", params.query.trim());
        if (params.firType) searchParams.set("firType", params.firType);
        if (typeof params.linkedToCase === "boolean") searchParams.set("linkedToCase", String(params.linkedToCase));
        if (params.registeredFrom) searchParams.set("registeredFrom", params.registeredFrom);
        if (params.registeredTo) searchParams.set("registeredTo", params.registeredTo);

        const suffix = searchParams.toString();
        const res = await api.get<ApiResponse<FirSummaryDto[]>>(`/fir/search${suffix ? `?${suffix}` : ""}`);
        return requireApiData(res.data, "Failed to search FIRs");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to search FIRs"));
    }
};

export const getFir = async (firId: number): Promise<FirDetailDto> => {
    try {
        const res = await api.get<ApiResponse<FirDetailDto>>(`/fir/${firId}`);
        return requireApiData(res.data, "Failed to load FIR details");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load FIR details"));
    }
};

export const createFir = async (request: FirRegisterRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>("/fir", request);
        return requireApiData(res.data, "Failed to create FIR");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to create FIR"));
    }
};

