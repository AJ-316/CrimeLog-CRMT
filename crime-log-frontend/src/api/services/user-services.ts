import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {UserSummaryDto} from "../dtos/user.ts";

export const getPendingUsers = async (): Promise<UserSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<UserSummaryDto[]>>("/users/pending");
        return requireApiData(res.data, "Failed to load pending users");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load pending users"));
    }
};

export const approveUser = async (userId: number): Promise<string> => {
    try {
        const res = await api.patch<ApiResponse<string>>(`/users/${userId}/approve`);
        return requireApiData(res.data, "Failed to approve user");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to approve user"));
    }
};