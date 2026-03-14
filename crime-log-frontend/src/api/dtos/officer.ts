import type {PersonDto} from "./personDto.ts";
import type {ActiveStatus, UnitRole, UnitType} from "../types.ts";

export interface OfficerDashboardDTO {
    officerName: string
    officerUnit: string,
    personDto: PersonDto
}

export interface OfficerProfileDto {
    badgeNumber: string;
    role: UnitRole;
    agencyId: number;
    departmentUnitId: number;
    unitCode: string;
    unitType: UnitType;
    departmentUnitName: string;
    joiningDate: string;
    activeStatus: ActiveStatus;
}
