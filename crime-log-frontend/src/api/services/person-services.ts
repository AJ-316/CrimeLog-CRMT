import api from "../client.ts";
import type {ApiResponse} from "../api.ts";
import {getApiErrorMessage, requireApiData} from "../service-utils.ts";
import type {PersonCriminalHistoryDto} from "../dtos/person-history.ts";
import type {PersonDto} from "../dtos/personDto.ts";

export const createPerson = async (request: PersonDto): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>("/persons", request);
        return requireApiData(res.data, "Failed to create person");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to create person"));
    }
};

export const getPerson = async (personId: number): Promise<PersonDto> => {
    try {
        const res = await api.get<ApiResponse<PersonDto>>(`/persons/${personId}`);
        return requireApiData(res.data, "Failed to load person");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load person"));
    }
};

export const updatePerson = async (personId: number, request: PersonDto): Promise<string> => {
    try {
        const res = await api.put<ApiResponse<string>>(`/persons/${personId}`, request);
        return requireApiData(res.data, "Failed to update person");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update person"));
    }
};

export const deletePerson = async (personId: number): Promise<string> => {
    try {
        const res = await api.post<ApiResponse<string>>(`/persons/${personId}/delete`);
        return requireApiData(res.data, "Failed to delete person");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to delete person"));
    }
};

export const getPersonHistory = async (personId: number, suspectOnly: boolean): Promise<PersonCriminalHistoryDto> => {
    const endpoint = suspectOnly
        ? `/persons/${personId}/history/suspect`
        : `/persons/${personId}/history`;

    try {
        const res = await api.get<ApiResponse<PersonCriminalHistoryDto>>(endpoint);
        return requireApiData(res.data, "Failed to load person history");
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to load person history"));
    }
};
