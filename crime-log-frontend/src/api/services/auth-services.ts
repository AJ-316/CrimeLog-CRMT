import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import type {LoginRequest, RegisterRequest} from "../dtos/auth.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import {setAuthSession} from "../../utils/auth-session.ts";
import type {Role} from "../types.ts";

export const register = async (request: RegisterRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>(`/auth/register/${request.role.toLowerCase()}`, request);
        return requireApiData(res.data, "Registration failed");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Registration failed"));
    }
};

export const login = async (request: LoginRequest): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<{ token: string; userId: number; role: Role }>>("/auth/login", request);
        const data = requireApiData(res.data, "Login failed");

        setAuthSession(data.token, data.userId, data.role);
        return "Successfully logged in";

    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Login failed"));
    }
};
