import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const SCHOLARSHIPS_URL = "/scholarships.json";

function normalizeScholarships(payload) {
  if (!payload || !Array.isArray(payload.results)) return [];
  return payload.results.map((item, index) => ({ ...item, id: index }));
}

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    fetch(SCHOLARSHIPS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load scholarships");
        return res.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        const list = normalizeScholarships(payload);
        const numId = parseInt(id, 10);
        if (Number.isNaN(numId) || numId < 0 || numId >= list.length) {
          setScholarship(null);
          setError("Scholarship not found.");
        } else {
          setScholarship(list[numId]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setScholarship(null);
        setError(err.message);
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="page scholarship-detail-page">
        <p className="status">Loading…</p>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="page scholarship-detail-page">
        <p className="error">{error || "Scholarship not found."}</p>
        <Link to="/scholarships" className="link">← Back to Scholarships</Link>
      </div>
    );
  }

  return (
    <div className="page scholarship-detail-page">
      <nav className="scholarship-detail-breadcrumb">
        <Link to="/scholarships" className="link">Scholarships</Link>
        <span className="scholarship-detail-sep">/</span>
        <span className="scholarship-detail-current" aria-current="page">
          {scholarship.message ? `${scholarship.message.slice(0, 50)}${scholarship.message.length > 50 ? "…" : ""}` : "Detail"}
        </span>
      </nav>

      <article className="scholarship-detail-card">
        <div className="scholarship-detail-meta">
          <span className="scholarship-detail-badge">{scholarship.source}</span>
          {scholarship.education_level && (
            <span className="scholarship-detail-badge scholarship-detail-badge--level">
              {scholarship.education_level}
            </span>
          )}
        </div>
        <h1 className="scholarship-detail-title">{scholarship.message || "Untitled"}</h1>
        {scholarship.message && (
          <div className="scholarship-detail-message">
            <p>{scholarship.message}</p>
          </div>
        )}
        <dl className="scholarship-detail-facts">
          {scholarship.amount && (
            <>
              <dt>Amount</dt>
              <dd>{scholarship.amount}</dd>
            </>
          )}
          {scholarship.deadline && (
            <>
              <dt>Deadline</dt>
              <dd>{scholarship.deadline}</dd>
            </>
          )}
          {scholarship.eligibility && (
            <>
              <dt>Eligibility</dt>
              <dd>{scholarship.eligibility}</dd>
            </>
          )}
          {scholarship.age_limits && (
            <>
              <dt>Age limits</dt>
              <dd>{scholarship.age_limits}</dd>
            </>
          )}
        </dl>
        {scholarship.permalink_url && (
          <a
            href={scholarship.permalink_url}
            target="_blank"
            rel="noreferrer"
            className="scholarship-detail-cta"
          >
            Open official page →
          </a>
        )}
      </article>

      <div className="scholarship-detail-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <Link to="/scholarships" className="btn btn-primary">View all scholarships</Link>
      </div>
    </div>
  );
}
