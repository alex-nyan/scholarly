import { useEffect, useMemo, useState } from "react";

const DEFAULT_URL = "/opportunities.json";

function normalizeOpportunities(payload) {
  if (!payload || !Array.isArray(payload.results)) {
    return [];
  }
  return payload.results;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    source: DEFAULT_URL,
  });

  useEffect(() => {
    let isMounted = true;
    setStatus({ loading: true, error: "", source: DEFAULT_URL });
    fetch(DEFAULT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${DEFAULT_URL}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setOpportunities(normalizeOpportunities(payload));
        setStatus({ loading: false, error: "", source: DEFAULT_URL });
      })
      .catch((error) => {
        if (!isMounted) return;
        setOpportunities([]);
        setStatus({ loading: false, error: error.message, source: DEFAULT_URL });
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return opportunities;
    return opportunities.filter((item) => {
      const message = item.message || "";
      const source = item.source || "";
      return (
        message.toLowerCase().includes(needle) ||
        source.toLowerCase().includes(needle)
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
          <article className="card" key={`${item.permalink_url}-${index}`}>
            <div className="card-header">
              <h2>{item.source || "Unknown source"}</h2>
              {item.created_time && (
                <time dateTime={item.created_time}>
                  {new Date(item.created_time).toLocaleDateString()}
                </time>
              )}
            </div>
            <p className="message">{item.message}</p>
            {item.permalink_url && (
              <a
                className="link"
                href={item.permalink_url}
                target="_blank"
                rel="noreferrer"
              >
                View original post
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
