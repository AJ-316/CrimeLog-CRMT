import axios from "axios";
import {getAuthToken} from "../utils/auth-session.ts";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    const url = config.url ?? "";

    const isAuthRoute =
        url.startsWith("/auth/") ||
        url.startsWith("auth/") ||
        url.includes("/api/auth/");

    if (!isAuthRoute && token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;