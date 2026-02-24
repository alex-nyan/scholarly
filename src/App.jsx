import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import PathFinderQuiz from "./pages/PathFinderQuiz";
import SubmitOpportunityPage from "./pages/SubmitOpportunityPage";
import AdminPage from "./pages/AdminPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import ScholarshipDetailPage from "./pages/ScholarshipDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import { Navigate } from "react-router-dom";

function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <AdminPage />;
}

function Nav() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/");
  }

  return (
    <nav className="app-nav">
      <Link to="/" className="nav-logo">
        Scholarly
      </Link>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/scholarships">Scholarships</NavLink>
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        {!loading && (
          user ? (
            <div className="nav-user-wrap">
              <button
                type="button"
                className="nav-user-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
              >
                {user.email}
              </button>
              {menuOpen && (
                <>
                  <div className="nav-user-backdrop" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="nav-user-menu">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                    <button type="button" onClick={handleLogout}>Log out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-login">Log in</Link>
              <Link to="/signup" className="btn btn-nav-signup">Sign up</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
            <Route path="/pathfinder" element={<PathFinderQuiz />} />
            <Route path="/submit" element={<SubmitOpportunityPage />} />
            <Route path="/admin" element={<AdminRoute />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
