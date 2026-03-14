import {Navigate, Outlet, useLocation, useOutletContext} from "react-router-dom";
import type {Role} from "../../api/types.ts";
import {getSessionRole} from "../../utils/auth-session.ts";
import type {AppOutletContext} from "./AppShell.tsx";

interface RequireRoleProps {
    allowedRoles: readonly Role[];
}

export default function RequireRole({allowedRoles}: RequireRoleProps) {
    const location = useLocation();
    const role = getSessionRole();
    const outletContext = useOutletContext<AppOutletContext>();

    if (!allowedRoles.includes(role)) {
        return <Navigate replace state={{from: location.pathname}} to="/access-denied" />;
    }

    return <Outlet context={outletContext} />;
}
