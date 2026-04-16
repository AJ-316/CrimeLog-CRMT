import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {UserSummaryDto} from "../dtos/user.ts";
import type {AccountStatus} from "../types.ts";

export const getUsers = async (): Promise<UserSummaryDto[]> => {
    try {
        const res = await api.get<ApiResponse<UserSummaryDto[]>>("/users");
        return requireApiData(res.data, "Failed to load users");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load users"));
    }
};

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

export const rejectUser = async (userId: number): Promise<string> => {
    try {
        const res = await api.patch<ApiResponse<string>>(`/users/${userId}/reject`);
        return requireApiData(res.data, "Failed to reject user");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to reject user"));
    }
};

export const updateUserStatus = async (userId: number, status: AccountStatus): Promise<string> => {
    try {
        const res = await api.patch<ApiResponse<string>>(`/users/${userId}/status`, {status});
        return requireApiData(res.data, "Failed to update user status");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update user status"));
    }
};

export const deletePendingUser = async (userId: number): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>(`/users/${userId}/delete`);
        return requireApiData(res.data, "Failed to delete user");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to delete user"));
    }
};