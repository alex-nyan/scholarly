import { useEffect, useMemo, useState } from "react";
import { getAcceptedSubmissions } from "../data/submissionsStore";
import { MOCK_SCHOLARSHIPS } from "../data/mockScholarships";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FUNDING_LABELS = {
  full: "Full scholarship",
  partial: "Partial award",
  stipend: "Monthly stipend",
};

const FUNDING_ORDER = { full: 0, partial: 1, stipend: 2 };

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "amount", label: "Highest Amount" },
  { value: "funding", label: "Funding Type" },
  { value: "recent", label: "Most Recent" },
];

const ALL_CATEGORIES = [
  "Scholarship",
  "Volunteering",
  "Internship",
  "Event",
  "Workshop",
  "Other",
];

// ---------------------------------------------------------------------------
// Data mappers — retain full structured shape, no blob joining
// ---------------------------------------------------------------------------

function scholarshipToOpportunity(s) {
  return {
    id: s.id,
    title: s.name,
    description: s.description,
    source: s.location || "Scholarship",
    permalink_url: s.url || null,
    created_time: null,
    submitted: false,
    category: "Scholarship",
    fundingType: s.fundingType,
    amount: s.amount,
    eligibilityTags: s.eligibilityTags || [],
  };
}

function submissionToOpportunity(sub) {
  return {
    id: sub.id,
    title: sub.title,
    description: sub.description,
    source: sub.organizationName || "Community",
    permalink_url: sub.link || null,
    created_time: sub.createdAt,
    submitted: true,
    category: sub.category || "Other",
    fundingType: null,
    amount: null,
    eligibilityTags: [],
  };
}

// ---------------------------------------------------------------------------
// Card components
// ---------------------------------------------------------------------------

function ScholarshipCard({ item }) {
  const amountLabel =
    item.amount === 0 ? "Full coverage" : `Up to $${item.amount.toLocaleString()}`;

  return (
    <article className="card">
      <div className="card-header">
        <h2 className="card-title">{item.title}</h2>
        <div className="card-meta">
          {item.fundingType && (
            <span className="card-badge card-badge--funding">
              {FUNDING_LABELS[item.fundingType] ?? item.fundingType}
            </span>
          )}
          <span className="card-badge card-badge--amount">{amountLabel}</span>
        </div>
      </div>
      <p className="card-source">📍 {item.source}</p>
      {item.description && (
        <p className="card-description">{item.description}</p>
      )}
      {item.permalink_url && (
        <a
          className="link"
          href={item.permalink_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more →
        </a>
      )}
    </article>
  );
}

function SubmissionCard({ item }) {
  return (
    <article className="card card--submitted">
      <div className="card-header">
        <h2 className="card-title">{item.title}</h2>
        <div className="card-meta">
          <span className="card-badge">Community</span>
          {item.category && (
            <span className="card-badge card-badge--category">{item.category}</span>
          )}
          {item.created_time && (
            <time dateTime={item.created_time}>
              {new Date(item.created_time).toLocaleDateString()}
            </time>
          )}
        </div>
      </div>
      <p className="card-source">{item.source}</p>
      {item.description && (
        <p className="card-description">{item.description}</p>
      )}
      {item.permalink_url && (
        <a
          className="link"
          href={item.permalink_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View link →
        </a>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function OpportunitiesPage() {
  const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategory] = useState("");
  const [fundingFilter, setFunding] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setAcceptedSubmissions(getAcceptedSubmissions());
    const onStorage = () => setAcceptedSubmissions(getAcceptedSubmissions());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const opportunities = useMemo(() => {
    const fromScholarships = Array.isArray(MOCK_SCHOLARSHIPS)
      ? MOCK_SCHOLARSHIPS.map(scholarshipToOpportunity)
      : [];
    const fromSubmissions = acceptedSubmissions.map(submissionToOpportunity);
    return [...fromSubmissions, ...fromScholarships];
  }, [acceptedSubmissions]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return opportunities.filter((item) => {
      if (needle) {
        const haystack = [item.title, item.description, item.source, item.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (fundingFilter) {
        if (!item.fundingType || item.fundingType !== fundingFilter) return false;
      }
      return true;
    });
  }, [opportunities, query, categoryFilter, fundingFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "amount") {
      list.sort((a, b) => {
        if (a.amount === null && b.amount === null) return 0;
        if (a.amount === null) return 1;
        if (b.amount === null) return -1;
        if (a.amount === 0 && b.amount !== 0) return -1;
        if (b.amount === 0 && a.amount !== 0) return 1;
        return b.amount - a.amount;
      });
    } else if (sortBy === "funding") {
      list.sort((a, b) => {
        const oa = a.fundingType != null ? (FUNDING_ORDER[a.fundingType] ?? 99) : 99;
        const ob = b.fundingType != null ? (FUNDING_ORDER[b.fundingType] ?? 99) : 99;
        return oa - ob;
      });
    } else if (sortBy === "recent") {
      list.sort((a, b) => {
        if (!a.created_time && !b.created_time) return 0;
        if (!a.created_time) return 1;
        if (!b.created_time) return -1;
        return new Date(b.created_time) - new Date(a.created_time);
      });
    }
    return list;
  }, [filtered, sortBy]);

  const hasActiveFilters = query || categoryFilter || fundingFilter || sortBy !== "default";

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setFunding("");
    setSortBy("default");
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Youth opportunities</p>
          <h1>Myanmar Opportunities</h1>
          <p className="subtitle">
            Showing demo opportunities sourced from the Path Finder scholarship
            dataset and community submissions.
          </p>
        </div>
      </header>

      <section className="opportunities-filters">
        <div className="filter-row">
          <div className="search">
            <label htmlFor="opp-search">Search</label>
            <input
              id="opp-search"
              placeholder="Scholarship, internship, volunteer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="opp-category">Category</label>
            <select
              id="opp-category"
              value={categoryFilter}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="opp-funding">Funding type</label>
            <select
              id="opp-funding"
              value={fundingFilter}
              onChange={(e) => setFunding(e.target.value)}
            >
              <option value="">All types</option>
              {Object.entries(FUNDING_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="opp-sort">Sort by</label>
            <select
              id="opp-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-status">
          <span>
            {sorted.length} {sorted.length === 1 ? "opportunity" : "opportunities"}
          </span>
          {hasActiveFilters && (
            <button type="button" className="btn-clear-filters" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </section>

      <section className="grid">
        {sorted.map((item) =>
          item.submitted
            ? <SubmissionCard key={item.id} item={item} />
            : <ScholarshipCard key={item.id} item={item} />
        )}
        {sorted.length === 0 && (
          <div className="empty">No opportunities match your filter.</div>
        )}
      </section>
    </div>
  );
}