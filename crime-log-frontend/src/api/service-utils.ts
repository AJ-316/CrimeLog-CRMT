import axios from "axios";
import type {ApiResponse} from "./api.ts";

export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiResponse<unknown> | undefined;
        if (apiError?.message) {
            return apiError.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
};

export const requireApiData = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
    if (!response.success || response.data === null) {
        throw new Error(response.message || fallbackMessage);
    }

    return response.data;
};

