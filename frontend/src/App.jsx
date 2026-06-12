import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProblemsPage from "./pages/admin/AdminProblemsPage";
import AdminAddProblemPage from "./pages/admin/AdminAddProblemPage";
import AdminEditProblemPage from "./pages/admin/AdminEditProblemPage";

function App() {
  const { isSignedIn, isAdmin, isLoaded } = useAuth();

  if (!isLoaded) return null;

  // Where to send authenticated users
  const home = isAdmin ? "/admin" : "/dashboard";

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={home} />} />
        <Route path="/login" element={!isSignedIn ? <LoginPage /> : <Navigate to={home} />} />
        <Route path="/signup" element={!isSignedIn ? <SignupPage /> : <Navigate to={home} />} />

        {/* Student-only routes — admins get sent to /admin */}
        <Route path="/dashboard" element={!isSignedIn ? <Navigate to="/login" /> : isAdmin ? <Navigate to="/admin" /> : <DashboardPage />} />
        <Route path="/problems" element={!isSignedIn ? <Navigate to="/login" /> : isAdmin ? <Navigate to="/admin" /> : <ProblemsPage />} />
        <Route path="/problem/:id" element={!isSignedIn ? <Navigate to="/login" /> : isAdmin ? <Navigate to="/admin" /> : <ProblemPage />} />
        <Route path="/session/:id" element={!isSignedIn ? <Navigate to="/login" /> : isAdmin ? <Navigate to="/admin" /> : <SessionPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminProblemsPage />} />
          <Route path="problems" element={<AdminProblemsPage />} />
          <Route path="problems/add" element={<AdminAddProblemPage />} />
          <Route path="problems/edit/:id" element={<AdminEditProblemPage />} />
        </Route>
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
