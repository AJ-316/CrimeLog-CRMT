import {Navigate, Outlet} from "react-router-dom";
import {hasAuthToken} from "../../utils/auth-session.ts";

export default function RequireAuth() {
    if (!hasAuthToken()) {
        return <Navigate replace to="/?auth=login" />;
    }

    return <Outlet />;
}

