import type {LawyerRole, RequestType, ReviewStatus} from "../types.ts";

export interface RequestSummaryDto {
    requestId: number;
    requestType: RequestType;
    caseId: number;
    caseNumber: string | null;
    firId: number;
    requesterName: string;
    status: ReviewStatus;
    reason: string | null;
    createdAt: string | null;
    reviewedAt: string | null;
    targetLabel: string | null;
}

export interface RequestReviewDto {
    reviewerUserId: number;
    status: Extract<ReviewStatus, "APPROVED" | "REJECTED">;
}

interface BaseActionRequest {
    requestType: RequestType;
    requestedByUserId: number;
    caseId: number;
    firId: number;
    status: "PENDING";
    reason: string;
    reviewedAt: null;
    reviewedByUserId: null;
}

export interface TransferUnitRequestDto extends BaseActionRequest {
    requestType: "TRANSFER_UNIT";
    targetUnitId: number;
}

export interface TransferAgencyRequestDto extends BaseActionRequest {
    requestType: "TRANSFER_AGENCY";
    targetAgencyId: number;
}

export interface SubmitChargeSheetRequestDto extends BaseActionRequest {
    requestType: "SUBMIT_CHARGE_SHEET";
}

export interface LawyerCaseRequestDto extends BaseActionRequest {
    requestType: "LAWYER_CASE_REQUEST";
    lawyerRole: LawyerRole;
}

export type ActionRequestDto =
    | TransferUnitRequestDto
    | TransferAgencyRequestDto
    | SubmitChargeSheetRequestDto
    | LawyerCaseRequestDto;

