import type {CaseParticipantType, CaseStage} from "../types.ts";

export interface PersonCaseInvolvementDto {
    caseId: number;
    caseNumber: string;
    caseStage: CaseStage;
    involvementType: CaseParticipantType;
    openedOn: string | null;
    closedOn: string | null;
    investigatingUnitName: string | null;
    firNumber: string | null;
    linkedOn: string | null;
}

export interface PersonCriminalHistoryDto {
    personId: number;
    fullName: string;
    nationalId: string;
    totalInvolvements: number;
    activeCases: number;
    closedCases: number;
    involvements: PersonCaseInvolvementDto[];
}
