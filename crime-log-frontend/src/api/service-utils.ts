import axios from "axios";
import type {ApiResponse} from "./api.ts";

const validationHelpMessage = "Please review the form fields and use the required format before submitting. Secondary contact is optional, and if you enter it, use international format like +919876543210.";

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

export const getFriendlyRegistrationErrorMessage = (error: unknown): string => {
    const message = getApiErrorMessage(error, "Registration failed");

    if ((message.includes("contactSecondary") || message.includes("contact_secondary")) && message.includes("cannot be null")) {
        return "Leave Secondary contact blank, or enter it in international format like +919876543210.";
    }

    if (message.includes("contactSecondary") && message.includes("must match")) {
        return "Secondary contact is optional. Leave it blank, or enter it in international format like +919876543210.";
    }

    if (message.includes("Validation failed for classes") || message.includes("ConstraintViolation")) {
        return validationHelpMessage;
    }

    return message;
};

export const requireApiData = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
    if (!response.success || response.data === null) {
        throw new Error(response.message || fallbackMessage);
    }

    return response.data;
};

