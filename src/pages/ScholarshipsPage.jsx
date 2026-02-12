import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SCHOLARSHIPS_URL = "/scholarships.json";

function normalizeScholarships(payload) {
  if (!payload || !Array.isArray(payload.results)) return [];
  return payload.results.map((item, index) => ({
    ...item,
    id: index,
  }));
}

// Score scholarship for personalization (education_level match; optional age from text)
function scoreForProfile(scholarship, profile) {
  if (!profile) return 0;
  let score = 0;
  const userLevel = (profile.education_level || "").toLowerCase();
  const schLevel = (scholarship.education_level || "").toLowerCase();
  const text = `${scholarship.message || ""} ${scholarship.eligibility || ""}`.toLowerCase();

  if (userLevel && schLevel) {
    if (schLevel === "any" || schLevel === "any education") score += 1;
    else {
      const schLevels = schLevel.split(",").map((s) => s.trim());
      if (schLevels.some((l) => l.includes(userLevel) || userLevel.includes(l))) score += 2;
    }
  }

  if (profile.age != null && text) {
    if (text.includes("high school") && profile.age >= 14 && profile.age <= 19) score += 1;
    if (text.includes("undergraduate") && profile.age >= 17 && profile.age <= 25) score += 1;
    if (text.includes("graduate") && profile.age >= 22) score += 1;
  }
  return score;
}

function ScholarshipCard({ item }) {
  return (
    <Link to={`/scholarships/${item.id}`} className="scholarship-card">
      <div className="scholarship-card-header">
        <span className="scholarship-card-source">{item.source}</span>
        {item.education_level && (
          <span className="scholarship-card-tag">{item.education_level}</span>
        )}
      </div>
      <h2 className="scholarship-card-title">{item.message || "Untitled"}</h2>
      {(item.deadline || item.amount) && (
        <div className="scholarship-card-meta">
          {item.amount && <span>{item.amount}</span>}
          {item.deadline && <span>{item.deadline}</span>}
        </div>
      )}
      {item.permalink_url && (
        <span className="scholarship-card-cta">View details →</span>
      )}
    </Link>
  );
}

export default function ScholarshipsPage() {
  const { user, profile } = useAuth();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let isMounted = true;
    setStatus((s) => ({ ...s, loading: true, error: "" }));
    fetch(SCHOLARSHIPS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load scholarships");
        return res.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setList(normalizeScholarships(payload));
        setStatus({ loading: false, error: "" });
      })
      .catch((err) => {
        if (!isMounted) return;
        setList([]);
        setStatus({ loading: false, error: err.message });
      });
    return () => { isMounted = false; };
  }, []);

  const sources = useMemo(() => {
    const set = new Set(list.map((s) => s.source).filter(Boolean));
    return Array.from(set).sort();
  }, [list]);

  const educationLevels = useMemo(() => {
    const set = new Set(list.map((s) => s.education_level).filter(Boolean));
    return Array.from(set).sort();
  }, [list]);

  const [educationFilter, setEducationFilter] = useState("");

  const filtered = useMemo(() => {
    let out = list;
    const needle = query.trim().toLowerCase();
    if (needle) {
      out = out.filter(
        (s) =>
          (s.message || "").toLowerCase().includes(needle) ||
          (s.source || "").toLowerCase().includes(needle) ||
          (s.education_level || "").toLowerCase().includes(needle) ||
          (s.eligibility || "").toLowerCase().includes(needle)
      );
    }
    if (sourceFilter) {
      out = out.filter((s) => s.source === sourceFilter);
    }
    if (educationFilter) {
      out = out.filter((s) => s.education_level === educationFilter);
    }
    return out;
  }, [list, query, sourceFilter, educationFilter]);

  const recommended = useMemo(() => {
    if (!user || !profile) return [];
    const withScores = list.map((s) => ({ ...s, _score: scoreForProfile(s, profile) }));
    return withScores.filter((s) => s._score > 0).sort((a, b) => b._score - a._score);
  }, [list, user, profile]);

  const showRecommended = user && recommended.length > 0;

  return (
    <div className="page scholarships-page">
      <header className="hero scholarships-hero">
        <div>
          <p className="eyebrow">Scholarship database</p>
          <h1>Scholarships</h1>
          <p className="subtitle">
            Browse funding opportunities from scraped sources. Click a card to view details and visit the official page.
          </p>
        </div>
        <div className="scholarships-controls">
          <div className="search">
            <label htmlFor="scholarship-search">Search</label>
            <input
              id="scholarship-search"
              placeholder="Title, provider..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="search">
            <label htmlFor="scholarship-source">Provider</label>
            <select
              id="scholarship-source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All providers</option>
              {sources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
          <div className="search">
            <label htmlFor="scholarship-education">Education level</label>
            <select
              id="scholarship-education"
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
            >
              <option value="">Any level</option>
              {educationLevels.map((lev) => (
                <option key={lev} value={lev}>{lev}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {user && !profile?.education_level && (
        <section className="recommended-cta">
          <Link to="/profile" className="btn btn-secondary">
            Set your profile (age & education) to see personalized recommendations →
          </Link>
        </section>
      )}

      {showRecommended && (
        <section className="recommended-section">
          <h2 className="recommended-title">Recommended for you</h2>
          <p className="recommended-subtitle">
            Based on your profile (age, education level).
          </p>
          <div className="scholarships-grid recommended-grid">
            {recommended.slice(0, 12).map((item) => (
              <ScholarshipCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      )}

      <section className="status">
        {status.loading && <span>Loading scholarships...</span>}
        {!status.loading && status.error && (
          <span className="error">{status.error}</span>
        )}
        {!status.loading && !status.error && (
          <span>{filtered.length} scholarship{filtered.length !== 1 ? "s" : ""}</span>
        )}
      </section>

      <section className="scholarships-grid">
        {filtered.map((item) => (
          <ScholarshipCard item={item} key={item.id} />
        ))}
        {!status.loading && !status.error && filtered.length === 0 && (
          <div className="empty">No scholarships match your filters.</div>
        )}
      </section>
    </div>
  );
}
