import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login";
import { NotFound } from "@/pages/not-found";
import { FederalLearning } from "@/pages/federal-learning";
import { ThreatLogs } from "@/pages/threat-logs";
import { NetworkLogs } from "@/pages/network-logs";
import Analytics from "@/pages/analytics";
import Forensics from "@/pages/forensics";
import Incidents from "@/pages/incidents";
import Investigation from "@/pages/investigation";
import Reports from "@/pages/reports";
import Threats from "@/pages/threats";
import { Settings } from "@/pages/settings";

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/federal-learning" element={<RequireAuth><FederalLearning /></RequireAuth>} />
          <Route path="/federated-learning" element={<RequireAuth><FederalLearning /></RequireAuth>} />
          <Route path="/threat-logs" element={<RequireAuth><ThreatLogs /></RequireAuth>} />
          <Route path="/network-logs" element={<RequireAuth><NetworkLogs /></RequireAuth>} />
          <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="/forensics" element={<RequireAuth><Forensics /></RequireAuth>} />
          <Route path="/incidents" element={<RequireAuth><Incidents /></RequireAuth>} />
          <Route path="/investigation" element={<RequireAuth><Investigation /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path="/threats" element={<RequireAuth><Threats /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;