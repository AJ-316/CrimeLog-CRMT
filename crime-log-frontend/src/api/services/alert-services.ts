import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {AlertDto, CreateAlertRequest} from "../dtos/alert.ts";

export const getAlerts = async (): Promise<AlertDto[]> => {
    try {
        const res = await api.get<ApiResponse<AlertDto[]>>("/alerts");
        return requireApiData(res.data, "Failed to load alerts");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load alerts"));
    }
};

export const createAlert = async (request: CreateAlertRequest): Promise<AlertDto> => {
    try {
        const res = await api.post<ApiResponse<AlertDto>>("/alerts", request);
        return requireApiData(res.data, "Failed to create alert");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to create alert"));
    }
};

export const updateAlert = async (alertId: number, request: CreateAlertRequest): Promise<AlertDto> => {
    try {
        const res = await api.patch<ApiResponse<AlertDto>>(`/alerts/${alertId}`, request);
        return requireApiData(res.data, "Failed to update alert");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update alert"));
    }
};

export const deleteAlert = async (alertId: number): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>(`/alerts/${alertId}/delete`);
        return requireApiData(res.data, "Failed to delete alert");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to delete alert"));
    }
};
