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
