import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {FirDetailDto, FirRegisterRequest, FirSummaryDto} from "../dtos/fir.ts";

export const getFirs = async (): Promise<FirSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<FirSummaryDto[]>>("/fir");
        return requireApiData(res.data, "Failed to load FIRs");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load FIRs"));
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

