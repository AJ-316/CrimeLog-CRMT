import "./App.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./components/Home.tsx";
import Dashboard from "./components/Dashboard.tsx";
import AppShell from "./components/app/AppShell.tsx";
import RequireAuth from "./components/app/RequireAuth.tsx";
import TestComponent from "./TestComponent.tsx";
import FIRListPage from "./pages/FIRListPage.tsx";
import FIRDetailsPage from "./pages/FIRDetailsPage.tsx";
import CreateFIRPage from "./pages/CreateFIRPage.tsx";
import CaseListPage from "./pages/CaseListPage.tsx";
import CaseDetailsPage from "./pages/CaseDetailsPage.tsx";
import CreateCasePage from "./pages/CreateCasePage.tsx";
import RequestsPage from "./pages/RequestsPage.tsx";
import ApprovalsPage from "./pages/ApprovalsPage.tsx";
import LawyerClientsPage from "./pages/LawyerClientsPage.tsx";
import LawyerHearingsPage from "./pages/LawyerHearingsPage.tsx";
import AuditPage from "./pages/AuditPage.tsx";
import RequireRole from "./components/app/RequireRole.tsx";
import AccessDeniedPage from "./pages/AccessDeniedPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Navigate replace to="/?auth=login" />} />
                <Route path="/register" element={<Navigate replace to="/?auth=register" />} />

                <Route element={<RequireAuth />}>
                    <Route path="/access-denied" element={<AccessDeniedPage />} />

                    <Route path="/app" element={<AppShell />}>
                        <Route index element={<Dashboard />} />

                        <Route element={<RequireRole allowedRoles={["OFFICER"]} />}>
                            <Route path="fir" element={<FIRListPage />} />
                            <Route path="fir/new" element={<CreateFIRPage />} />
                            <Route path="fir/:firId" element={<FIRDetailsPage />} />
                            <Route path="cases/new" element={<CreateCasePage />} />
                            <Route path="requests" element={<RequestsPage />} />
                        </Route>

                        <Route element={<RequireRole allowedRoles={["OFFICER", "LAWYER"]} />}>
                            <Route path="cases" element={<CaseListPage />} />
                            <Route path="cases/:caseId" element={<CaseDetailsPage />} />
                        </Route>

                        <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
                            <Route path="approvals" element={<ApprovalsPage />} />
                            <Route path="audit" element={<AuditPage />} />
                        </Route>

                        <Route element={<RequireRole allowedRoles={["LAWYER"]} />}>
                            <Route path="clients" element={<LawyerClientsPage />} />
                            <Route path="hearings" element={<LawyerHearingsPage />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/test" element={<TestComponent />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
