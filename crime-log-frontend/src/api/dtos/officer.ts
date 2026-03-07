import type {PersonDto} from "./personDto.ts";

export interface OfficerDashboardDTO {
    officerName: string
    officerUnit: string,
    personDto: PersonDto
}