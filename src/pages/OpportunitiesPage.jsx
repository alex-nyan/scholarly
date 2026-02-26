import { useEffect, useMemo, useState } from "react";
import { getAcceptedSubmissions } from "../data/submissionsStore";
import { MOCK_SCHOLARSHIPS } from "../data/mockScholarships";

function scholarshipToOpportunity(scholarship) {
  const amountLabel =
    scholarship.amount === 0 ? "Full coverage" : `Up to $${scholarship.amount.toLocaleString()}`;
  const message = [
    scholarship.name,
    scholarship.description,
    `Funding: ${amountLabel} (${scholarship.fundingType})`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: scholarship.id,
    message,
    source: scholarship.location || "Scholarship",
    permalink_url: scholarship.url || null,
    created_time: null,
    submitted: false,
    category: "Scholarship",
  };
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
  const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setAcceptedSubmissions(getAcceptedSubmissions());
    const onStorage = () => setAcceptedSubmissions(getAcceptedSubmissions());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const feedOpportunities = useMemo(
    () => (Array.isArray(MOCK_SCHOLARSHIPS) ? MOCK_SCHOLARSHIPS.map(scholarshipToOpportunity) : []),
    []
  );

  const opportunities = useMemo(() => {
    const fromFeed = feedOpportunities;
    const fromSubmissions = acceptedSubmissions.map(submissionToOpportunity);
    return [...fromSubmissions, ...fromFeed];
  }, [acceptedSubmissions, feedOpportunities]);

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
          <p className="eyebrow">Youth opportunities</p>
          <h1>Myanmar Opportunities</h1>
          <p className="subtitle">
            Showing demo opportunities sourced from the Path Finder scholarship dataset
            and community submissions.
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
        <span>{filtered.length} opportunities</span>
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
        {filtered.length === 0 && (
          <div className="empty">
            No opportunities match your filter.
          </div>
        )}
      </section>
    </div>
  );
}
