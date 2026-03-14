import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {ActionRequestDto, RequestReviewDto, RequestSummaryDto} from "../dtos/request.ts";

export const getPendingRequests = async (): Promise<RequestSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<RequestSummaryDto[]>>("/requests/pending");
        return requireApiData(res.data, "Failed to load pending requests");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load pending requests"));
    }
};

export const getMyRequests = async (userId: number): Promise<RequestSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<RequestSummaryDto[]>>(`/requests/mine?userId=${userId}`);
        return requireApiData(res.data, "Failed to load requests");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load requests"));
    }
};

export const reviewRequest = async (requestId: number, review: RequestReviewDto): Promise<string> => {
    try {
        const res = await api.patch<ApiResponse<string>>(`/requests/${requestId}`, review);
        return requireApiData(res.data, "Failed to update request");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update request"));
    }
};

export const submitActionRequest = async (request: ActionRequestDto): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>("/action/request", request);
        return requireApiData(res.data, "Failed to submit request");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to submit request"));
    }
};

