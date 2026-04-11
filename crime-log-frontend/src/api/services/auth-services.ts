import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import type {LoginRequest, RegisterRequest} from "../dtos/auth.ts";
import {getApiErrorMessage, getFriendlyRegistrationErrorMessage, requireApiData} from "../service-utils.ts";
import {setAuthToken} from "../../utils/auth-session.ts";

export const register = async (request: RegisterRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>(`/auth/register/${request.role.toLowerCase()}`, request);
        return requireApiData(res.data, "Registration failed");
    } catch (error) {
        throw new Error(getFriendlyRegistrationErrorMessage(error));
    }
};

export const login = async (request: LoginRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<{ token: string; }>>("/auth/login", request);
        const data = requireApiData(res.data, "Login failed");

        setAuthToken(data.token);
        return "Successfully logged in";

    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Login failed"));
    }
};
