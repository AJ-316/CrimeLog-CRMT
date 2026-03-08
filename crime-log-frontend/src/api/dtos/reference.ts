import type {AgencyType} from "../types.ts";

export interface DepartmentUnitOptionDto {
    id: number;
    name: string;
    unitCode: string;
    agencyName: string;
}

export interface AgencyOptionDto {
    id: number;
    name: string;
    agencyType: AgencyType;
}

export interface PersonOptionDto {
    personId: number;
    fullName: string;
    nationalId: string;
}

