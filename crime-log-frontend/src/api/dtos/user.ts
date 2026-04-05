import type {AccountStatus, Role} from "../types.ts";

export interface UserSummaryDto {
    userId: number;
    fullName: string;
    email: string;
    role: Role;
    accountStatus: AccountStatus;
}