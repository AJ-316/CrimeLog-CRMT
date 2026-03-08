import type {CaseParticipantType, CaseStage, FirType} from "../types.ts";

export interface CaseSummaryDto {
    caseId: number;
    caseNumber: string;
    caseStage: CaseStage;
    courtName: string | null;
    openedOn: string | null;
    closedOn: string | null;
    currentInvestigatingUnitName: string | null;
    firId: number | null;
    firNumber: string | null;
}

export interface CaseParticipantDto {
    casePersonId: number;
    personId: number;
    fullName: string;
    casePersonType: CaseParticipantType;
    contactPrimary: string;
    addedOn: string | null;
}

export interface CaseDetailFirDto {
    firId: number;
    firNumber: string;
    firType: FirType;
    registrationDateTime: string;
    accusedName: string;
    originUnitName: string | null;
    initialInvestigatingUnitName: string | null;
    incidentDateTime: string | null;
    incidentCity: string | null;
    caseId: number | null;
    caseNumber: string | null;
}

export interface CaseDetailDto {
    caseId: number;
    caseNumber: string;
    caseStage: CaseStage;
    courtName: string | null;
    openedOn: string | null;
    closedOn: string | null;
    currentInvestigatingUnitName: string | null;
    fir: CaseDetailFirDto;
    participants: CaseParticipantDto[];
}

export interface CreateCaseRequest {
    caseNumber: string;
    firId: number;
    currentInvestigatingUnitId: number | null;
}

export interface CaseParticipantCreateRequest {
    personId: number;
    casePersonType: CaseParticipantType;
}

