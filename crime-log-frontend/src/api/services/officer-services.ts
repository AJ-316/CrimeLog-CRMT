import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import type {OfficerProfileDto} from "../dtos/officer.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";

export const getCurrentOfficerProfile = async (): Promise<OfficerProfileDto> => {
    try {
        const res = await api.get<ApiResponse<OfficerProfileDto>>("/officer/me");
        return requireApiData(res.data, "Failed to load officer profile");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load officer profile"));
    }
};

