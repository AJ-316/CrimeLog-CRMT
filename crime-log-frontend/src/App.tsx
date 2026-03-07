import "./App.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./components/Home.tsx";
import Dashboard from "./components/Dashboard.tsx";
import AppShell from "./components/app/AppShell.tsx";
import RequireAuth from "./components/app/RequireAuth.tsx";
import TemplatePage from "./components/app/TemplatePage.tsx";
import TestComponent from "./TestComponent.tsx";

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
                        <Route path="activity" element={<TemplatePage
                            description="Review the latest report movement, updates, and shared activity across the workspace."
                            eyebrow="Common"
                            highlights={["Recent report movement", "Assigned updates", "Team-visible timeline"]}
                            note="This page will bring together the updates that matter most across reports, reviews, and team activity."
                            title="Activity Feed"
                        />} />
                        <Route path="settings" element={<TemplatePage
                            description="Manage profile preferences, session access, and the settings that shape your workspace."
                            eyebrow="Common"
                            highlights={["Profile preferences", "Security sessions", "Notification rules"]}
                            note="Use this area to control your personal details, access preferences, and notification choices."
                            title="Settings"
                        />} />
                        <Route path="reports" element={<TemplatePage
                            description="Return to the reports you have filed, continue updates, and keep track of their progress."
                            eyebrow="Public"
                            highlights={["Submitted reports", "Draft follow-ups", "Escalation requests"]}
                            note="This page will collect the reports you have filed and make follow-up actions easier to manage."
                            title="My Reports"
                        />} />
                        <Route path="cases" element={<TemplatePage
                            description="Check case progress, status changes, and the latest information shared with you."
                            eyebrow="Public"
                            highlights={["Case tracking", "Status milestones", "Communication log"]}
                            note="Use this space to follow important milestones and stay informed about visible case updates."
                            title="Case Updates"
                        />} />
                        <Route path="clients" element={<TemplatePage
                            description="Organize client work, open matters, and the details you need before each next step."
                            eyebrow="Lawyer"
                            highlights={["Client roster", "Matter stages", "Document readiness"]}
                            note="This area will help you keep client information, matter progress, and supporting records close at hand."
                            title="Clients"
                        />} />
                        <Route path="hearings" element={<TemplatePage
                            description="Review upcoming hearings, preparation tasks, and linked case milestones in one view."
                            eyebrow="Lawyer"
                            highlights={["Upcoming hearings", "Prep checklist", "Court milestones"]}
                            note="This page will help you stay ready for court dates, filings, and important hearing deadlines."
                            title="Hearings"
                        />} />
                        <Route path="assignments" element={<TemplatePage
                            description="Stay focused on active assignments, incoming priorities, and the work that needs immediate attention."
                            eyebrow="Officer"
                            highlights={["Assigned incidents", "Response priorities", "Task ownership"]}
                            note="This section will surface your active duties, priorities, and the next actions expected from your unit."
                            title="Assignments"
                        />} />
                        <Route path="field-notes" element={<TemplatePage
                            description="Capture field observations, linked notes, and important context connected to each incident."
                            eyebrow="Officer"
                            highlights={["Observation log", "Evidence notes", "Shift continuity"]}
                            note="Use this page to keep field notes organized, searchable, and connected to the right incidents."
                            title="Field Notes"
                        />} />
                        <Route path="approvals" element={<TemplatePage
                            description="Review pending access requests, account approvals, and role changes in one clear queue."
                            eyebrow="Admin"
                            highlights={["Access queue", "Role requests", "Approval history"]}
                            note="This space will help administrators review incoming access changes and keep approvals moving."
                            title="User Approvals"
                        />} />
                        <Route path="audit" element={<TemplatePage
                            description="Monitor platform events, track important changes, and maintain oversight with confidence."
                            eyebrow="Admin"
                            highlights={["Security events", "System changes", "Oversight checks"]}
                            note="Use this area to review important events, investigate changes, and maintain platform accountability."
                            title="System Audit"
                        />} />
                    </Route>
                </Route>

                <Route path="/test" element={<TestComponent />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
