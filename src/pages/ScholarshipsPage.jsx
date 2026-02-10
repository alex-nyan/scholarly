import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SCHOLARSHIPS_URL = "/scholarships.json";

function normalizeScholarships(payload) {
  if (!payload || !Array.isArray(payload.results)) return [];
  return payload.results.map((item, index) => ({
    ...item,
    id: index,
  }));
}

export default function ScholarshipsPage() {
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
          <Link
            to={`/scholarships/${item.id}`}
            className="scholarship-card"
            key={item.id}
          >
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
        ))}
        {!status.loading && !status.error && filtered.length === 0 && (
          <div className="empty">No scholarships match your filters.</div>
        )}
      </section>
    </div>
  );
}
