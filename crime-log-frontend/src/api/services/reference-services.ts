import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {AgencyOptionDto, DepartmentUnitOptionDto, PersonOptionDto} from "../dtos/reference.ts";

export const getDepartmentUnits = async (): Promise<DepartmentUnitOptionDto[]> => {
    try {
        const res = await api.get<ApiResponse<DepartmentUnitOptionDto[]>>("/department-units");
        return requireApiData(res.data, "Failed to load department units");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load department units"));
    }
};

export const getAgencies = async (): Promise<AgencyOptionDto[]> => {
    try {
        const res = await api.get<ApiResponse<AgencyOptionDto[]>>("/agencies");
        return requireApiData(res.data, "Failed to load agencies");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load agencies"));
    }
};

export const getPeople = async (): Promise<PersonOptionDto[]> => {
    try {
        const res = await api.get<ApiResponse<PersonOptionDto[]>>("/persons");
        return requireApiData(res.data, "Failed to load people");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load people"));
    }
};

