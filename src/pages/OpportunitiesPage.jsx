import { useEffect, useMemo, useState } from "react";
import { getAcceptedSubmissions } from "../data/submissionsStore";

const DEFAULT_URL = "/opportunities.json";

function normalizeOpportunities(payload) {
  if (!payload || !Array.isArray(payload.results)) {
    return [];
  }
  return payload.results;
}

/** Map accepted submission to same shape as feed item for display. */
function submissionToOpportunity(sub) {
  const message = [sub.title, sub.description].filter(Boolean).join("\n\n");
  return {
    id: sub.id,
    message,
    source: sub.organizationName || "Community",
    permalink_url: sub.link || null,
    created_time: sub.createdAt,
    submitted: true,
    category: sub.category,
  };
}

export default function OpportunitiesPage() {
  const [feedOpportunities, setFeedOpportunities] = useState([]);
  const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    source: DEFAULT_URL,
  });

  useEffect(() => {
    let isMounted = true;
    setStatus((s) => ({ ...s, loading: true, error: "" }));
    fetch(DEFAULT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${DEFAULT_URL}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setFeedOpportunities(normalizeOpportunities(payload));
        setStatus({ loading: false, error: "", source: DEFAULT_URL });
      })
      .catch((error) => {
        if (!isMounted) return;
        setFeedOpportunities([]);
        setStatus({ loading: false, error: error.message, source: DEFAULT_URL });
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setAcceptedSubmissions(getAcceptedSubmissions());
    const onStorage = () => setAcceptedSubmissions(getAcceptedSubmissions());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const opportunities = useMemo(() => {
    const fromFeed = feedOpportunities.map((item) => ({ ...item, submitted: false }));
    const fromSubmissions = acceptedSubmissions.map(submissionToOpportunity);
    return [...fromSubmissions, ...fromFeed];
  }, [feedOpportunities, acceptedSubmissions]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return opportunities;
    return opportunities.filter((item) => {
      const message = item.message || "";
      const source = item.source || "";
      const category = item.category || "";
      return (
        message.toLowerCase().includes(needle) ||
        source.toLowerCase().includes(needle) ||
        category.toLowerCase().includes(needle)
      );
    });
  }, [opportunities, query]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Youth volunteering feed</p>
          <h1>Myanmar Opportunities</h1>
          <p className="subtitle">
            Showing public Facebook Page posts. Update{" "}
            <code>public/opportunities.json</code> after running the fetcher.
          </p>
        </div>
        <div className="search">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            placeholder="Volunteer, youth, internship..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>

      <section className="status">
        {status.loading && <span>Loading data...</span>}
        {!status.loading && status.error && (
          <span className="error">{status.error}</span>
        )}
        {!status.loading && !status.error && (
          <span>{filtered.length} opportunities</span>
        )}
      </section>

      <section className="grid">
        {filtered.map((item, index) => (
          <article
            className={`card ${item.submitted ? "card--submitted" : ""}`}
            key={item.id || `${item.permalink_url}-${index}`}
          >
            <div className="card-header">
              <h2>{item.source || "Unknown source"}</h2>
              <div className="card-meta">
                {item.submitted && (
                  <span className="card-badge">Community</span>
                )}
                {item.created_time && (
                  <time dateTime={item.created_time}>
                    {new Date(item.created_time).toLocaleDateString()}
                  </time>
                )}
              </div>
            </div>
            <p className="message">{item.message}</p>
            {item.permalink_url && (
              <a
                className="link"
                href={item.permalink_url}
                target="_blank"
                rel="noreferrer"
              >
                {item.submitted ? "View link" : "View original post"}
              </a>
            )}
          </article>
        ))}
        {!status.loading && !status.error && filtered.length === 0 && (
          <div className="empty">
            No opportunities match your filter.
          </div>
        )}
      </section>
    </div>
  );
}
