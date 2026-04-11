import type {AlertSeverity, Role} from "../types.ts";

export interface AlertDto {
    alertId: number;
    message: string;
    severity: AlertSeverity;
    active: boolean;
    createdByUserId: number;
    createdByRole: Role;
    createdAt: string;
}

export interface CreateAlertRequest {
    message: string;
    severity: AlertSeverity;
}
