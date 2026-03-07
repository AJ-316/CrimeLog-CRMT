import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import type {LoginRequest, RegisterRequest} from "../dtos/auth.ts";
import axios from "axios";

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
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

const requireApiData = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
    if (!response.success || response.data === null) {
        throw new Error(response.message || fallbackMessage);
    }

    return response.data;
};

export const register = async (request: RegisterRequest): Promise<string> => {
    try {
        console.log("Registration request:");
        console.log(JSON.stringify(request, null, 2));
        const res = await api.post<ApiResponse<string>>(`/auth/register/${request.role.toLowerCase()}`, request);
        return requireApiData(res.data, "Registration failed");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Registration failed"));
    }
};

export const login = async (request: LoginRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<{ token: string }>>("/auth/login", request);
        const data = requireApiData(res.data, "Login failed");

        localStorage.setItem("token", data.token);
        return "Successfully logged in";

    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Login failed"));
    }
};
