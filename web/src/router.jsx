import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/login";
import Register from "./pages/login/register";

import Dashboard from "./pages/dashboard/dashboard";
import Tickets from "./composants/ticket/tickets";

import TicketCreatePanel from "./composants/TicketCreatePanel/TicketCreatePanel";
import TicketDetailsPanel from "./composants/TicketDetailsPanel/TicketDetailsPanel";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:projectId/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        {/* Create ticket */}
        <Route
          path="/dashboard/:projectId/tickets/new"
          element={
            <ProtectedRoute>
              <TicketCreatePanel />
            </ProtectedRoute>
          }
        />

        {/* Ticket details */}
        <Route
          path="/dashboard/:projectId/tickets/:ticketId"
          element={
            <ProtectedRoute>
              <TicketDetailsPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
