import React from "react";
import { Routes, Route } from "react-router-dom";

// Import components
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import JobList from "@/pages/jobs/JobList";
import JobDetails from "@/pages/jobs/JobDetails";
import CreateJob from "@/pages/jobs/CreateJob";
import ApplicationPage from "@/components/applications/Application";
import CompanyProfile from "@/pages/companies/CompanyProfile";
import CompanyRegister from "@/pages/companies/CompanyRegister";
import NotFound from "@/pages/NotFound";

// Import route protection
import PrivateRoute from "@/components/common/PrivateRoute";
import PublicRoute from "@/components/common/PublicRoute";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          {/* Public routes - only for non-authenticated users */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          {/* Private routes - only for authenticated users */}
          <Route
            path="/my-applications"
            element={
              <PrivateRoute>
                <ApplicationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-company"
            element={
              <PrivateRoute>
                <CompanyRegister />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <PrivateRoute>
                <CreateJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs/:id/edit"
            element={
              <PrivateRoute>
                <CreateJob />
              </PrivateRoute>
            }
          />
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
