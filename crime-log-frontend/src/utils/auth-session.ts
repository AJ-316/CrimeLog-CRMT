import type {Role} from "../api/types.ts";

const validRoles: readonly Role[] = ["ADMIN", "LAWYER", "OFFICER", "PUBLIC"];
const TOKEN_STORAGE_KEY = "token";
const ROLE_STORAGE_KEY = "role";
const USER_ID_STORAGE_KEY = "uid";

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

const getUidFromClaims = (claims: Record<string, unknown>): number | null => {
    const uid = claims.uid;
    const parsedValue = typeof uid === "number" ? uid : Number(uid);
    return Number.isInteger(parsedValue) ? parsedValue : null;
};

export const getAuthToken = (): string | null =>
    sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? localStorage.getItem(TOKEN_STORAGE_KEY);

export const hasAuthToken = (): boolean => Boolean(getAuthToken());

export const setAuthToken = (token: string): void => {
    const claims = parseJwtPayload(token);
    const tokenRole = claims ? getRoleFromClaims(claims) : null;
    const tokenUid = claims ? getUidFromClaims(claims) : null;

    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    if (tokenRole) {
        sessionStorage.setItem(ROLE_STORAGE_KEY, tokenRole);
    } else {
        sessionStorage.removeItem(ROLE_STORAGE_KEY);
    }

    if (tokenUid !== null) {
        sessionStorage.setItem(USER_ID_STORAGE_KEY, String(tokenUid));
    } else {
        sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    }
};

export const setPreferredRole = (role: Role): void => {
    sessionStorage.setItem(ROLE_STORAGE_KEY, role);
};

export const setAuthSession = (token: string, userId: number, role: Role): void => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem(USER_ID_STORAGE_KEY, String(userId));
    setPreferredRole(role);
};

export const getPreferredRole = (): Role | null => {
    const storedRole = sessionStorage.getItem(ROLE_STORAGE_KEY);
    return isRole(storedRole) ? storedRole : null;
};

export const getRoleFromToken = (): Role | null => {
    const token = getAuthToken();
    if (!token) {
        return null;
    }

    const claims = parseJwtPayload(token);
    return claims ? getRoleFromClaims(claims) : null;
};

export const getSessionRole = (): Role => {
    const storedRole = getPreferredRole();
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
    const storedUserId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
    if (storedUserId) {
        const parsedStoredValue = Number(storedUserId);
        if (Number.isInteger(parsedStoredValue)) {
            return parsedStoredValue;
        }
    }

    const token = getAuthToken();
    if (!token) {
        return null;
    }

    const claims = parseJwtPayload(token);
    return claims ? getUidFromClaims(claims) : null;
};

export const clearAuthSession = (): void => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(ROLE_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};
