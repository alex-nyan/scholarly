import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import PathFinderQuiz from "./pages/PathFinderQuiz";
import SubmitOpportunityPage from "./pages/SubmitOpportunityPage";
import AdminPage from "./pages/AdminPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityPostPage from "./pages/CommunityPostPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav">
        <Link to="/" className="nav-logo">
          Scholarly
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/opportunities">Opportunities</NavLink>
          <NavLink to="/pathfinder">Path Finder</NavLink>
          <NavLink to="/community">Community</NavLink>
          <NavLink to="/submit">Submit</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/pathfinder" element={<PathFinderQuiz />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityPostPage />} />
          <Route path="/submit" element={<SubmitOpportunityPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
