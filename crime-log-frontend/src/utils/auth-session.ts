import type {Role} from "../api/types.ts";

const validRoles: readonly Role[] = ["ADMIN", "LAWYER", "OFFICER", "PUBLIC"];

const isRole = (value: unknown): value is Role =>
    typeof value === "string" && validRoles.includes(value as Role);

const decodeBase64Url = (value: string): string | null => {
    try {
        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        return window.atob(padded);
    } catch {
        return null;
    }
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
    const parts = token.split(".");
    if (parts.length < 2) {
        return null;
    }

    const decodedPayload = decodeBase64Url(parts[1]);
    if (!decodedPayload) {
        return null;
    }

    try {
        return JSON.parse(decodedPayload) as Record<string, unknown>;
    } catch {
        return null;
    }
};

const getRoleFromClaims = (claims: Record<string, unknown>): Role | null => {
    if (isRole(claims.role)) {
        return claims.role;
    }

    if (Array.isArray(claims.roles)) {
        const role = claims.roles.find(isRole);
        return role ?? null;
    }

    if (Array.isArray(claims.authorities)) {
        const authority = claims.authorities.find((item) => {
            if (typeof item !== "string") {
                return false;
            }

            const normalized = item.startsWith("ROLE_") ? item.slice(5) : item;
            return isRole(normalized);
        });

        if (typeof authority === "string") {
            const normalized = authority.startsWith("ROLE_") ? authority.slice(5) : authority;
            return isRole(normalized) ? normalized : null;
        }
    }

    return null;
};

export const getAuthToken = (): string | null => localStorage.getItem("token");

export const hasAuthToken = (): boolean => Boolean(getAuthToken());

export const getRoleFromToken = (): Role | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return isRole(payload.role) ? payload.role : null;
};

export const getSessionRole = (): Role => {
    const storedRole = getRoleFromToken();
    if (storedRole) {
        return storedRole;
    }

    const token = getAuthToken();
    if (token) {
        const claims = parseJwtPayload(token);
        const tokenRole = claims ? getRoleFromClaims(claims) : null;
        if (tokenRole) {
            return tokenRole;
        }
    }

    return "PUBLIC";
};

export const getSessionUserId = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const parsedValue = Number(payload.uid);
    return Number.isInteger(parsedValue) ? parsedValue : null;
};

export const clearAuthSession = (): void => {
    localStorage.removeItem("token");
};
