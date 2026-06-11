import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import CommandCenter from "./pages/CommandCenter";
import CRM from "./pages/CRM";
import LeadDetails from "./pages/LeadDetails";
import HR from "./pages/HR";
import Projects from "./pages/Projects";
import Finance from "./pages/Finance";
import Notifications from "./pages/Notifications";
import Audit from "./pages/Audit";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Login from "./pages/Login";

import {
  AuthContext,
  getCurrentUser,
  getSession,
  type DemoUser,
} from "./lib/auth";

import {
  SidebarProvider,
  SidebarInset,
} from "./components/ui/sidebar";

import { AppSidebar } from "./components/layout/AppSidebar";
import { Topbar } from "./components/layout/Topbar";

function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-background">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/command" element={<CommandCenter />} />

            <Route path="/crm" element={<CRM />} />

            <Route
              path="/crm/:leadId"
              element={<LeadDetails />}
            />

            <Route path="/hr" element={<HR />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/finance" element={<Finance />} />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route path="/audit" element={<Audit />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/about" element={<About />} />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  const [user, setUser] =
    useState<DemoUser | null>(getCurrentUser());

  const refresh = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    const handler = () => refresh();

    window.addEventListener(
      "flowpilot:auth",
      handler
    );

    return () => {
      window.removeEventListener(
        "flowpilot:auth",
        handler
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        refresh,
      }}
    >
      <Routes>
        {/* Root Redirect */}
        <Route
          path="/"
          element={
            getSession() ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            getSession() ? (
              <ProtectedLayout />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}