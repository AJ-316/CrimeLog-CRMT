import type {FirType} from "../types.ts";
import type {AddressDto} from "./addressDto.ts";

export interface FirSummaryDto {
    firId: number;
    firNumber: string;
    firType: FirType;
    registrationDateTime: string;
    accusedName: string;
    originUnitName: string | null;
    initialInvestigatingUnitId: number | null;
    initialInvestigatingUnitName: string | null;
    incidentDateTime: string | null;
    incidentCity: string | null;
    caseId: number | null;
    caseNumber: string | null;
}

export interface FirDetailDto {
    firId: number;
    firNumber: string;
    firType: FirType;
    registrationDateTime: string;
    createdDateTime: string;
    accusedName: string;
    accusedContact: string | null;
    accusedAddress: AddressDto | null;
    originUnitName: string | null;
    initialInvestigatingUnitName: string | null;
    incidentPlace: AddressDto | null;
    incidentDateTime: string | null;
    incidentDescription: string | null;
    caseId: number | null;
    caseNumber: string | null;
}

export interface FirRegisterRequest {
    firNumber: string;
    firType: FirType;
    registrationDateTime: string;
    accusedFirstName?: string | null;
    accusedMiddleName?: string | null;
    accusedLastName?: string | null;
    accusedContact?: string | null;
    accusedDescription?: string | null;
    accusedAddress?: AddressDto | null;
    initialInvestigatingUnitId: number;
    officerIdCreatedBy: number;
    incidentPlace?: AddressDto | null;
    incidentDateTime?: string | null;
    incidentDescription?: string | null;
}
