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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Navigate replace to="/?auth=login" />} />
                <Route path="/register" element={<Navigate replace to="/?auth=register" />} />

                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<AppShell />}>
                        <Route index element={<Dashboard />} />
                        <Route path="fir" element={<FIRListPage />} />
                        <Route path="fir/new" element={<CreateFIRPage />} />
                        <Route path="fir/:firId" element={<FIRDetailsPage />} />
                        <Route path="cases" element={<CaseListPage />} />
                        <Route path="cases/new" element={<CreateCasePage />} />
                        <Route path="cases/:caseId" element={<CaseDetailsPage />} />
                        <Route path="requests" element={<RequestsPage />} />
                        <Route path="approvals" element={<ApprovalsPage />} />
                        <Route path="clients" element={<LawyerClientsPage />} />
                        <Route path="hearings" element={<LawyerHearingsPage />} />
                        <Route path="audit" element={<AuditPage />} />
                    </Route>
                </Route>

                <Route path="/test" element={<TestComponent />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
