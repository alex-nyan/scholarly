import { useState, useEffect } from "react";
import {
  getSubmissions,
  updateSubmissionStatus,
} from "../data/submissionsStore";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("pending"); // pending | all

  const refresh = () => setSubmissions(getSubmissions());

  useEffect(() => {
    refresh();
  }, []);

  const handleStatus = (id, status) => {
    updateSubmissionStatus(id, status);
    refresh();
  };

  const list =
    filter === "pending"
      ? submissions.filter((s) => s.status === "pending")
      : submissions;

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="page admin-page">
      <header className="admin-hero">
        <p className="eyebrow">Admin</p>
        <h1>Opportunity submissions</h1>
        <p className="subtitle">
          Review submissions from organizations. Accept to show them on the
          Opportunities page; reject to decline.
        </p>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending {pendingCount > 0 && `(${pendingCount})`}
        </button>
        <button
          type="button"
          className={`admin-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
      </div>

      <section className="admin-list">
        {list.length === 0 ? (
          <div className="empty">
            {filter === "pending"
              ? "No pending submissions."
              : "No submissions yet."}
          </div>
        ) : (
          list.map((sub) => (
            <article key={sub.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{sub.title}</h2>
                <span className={`admin-badge admin-badge--${sub.status}`}>
                  {STATUS_LABELS[sub.status]}
                </span>
              </div>
              {sub.organizationName && (
                <p className="admin-org">{sub.organizationName}</p>
              )}
              {sub.category && (
                <p className="admin-meta">Category: {sub.category}</p>
              )}
              {sub.description && (
                <p className="admin-desc">{sub.description}</p>
              )}
              {sub.link && (
                <a
                  href={sub.link}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {sub.link}
                </a>
              )}
              <p className="admin-date">
                Submitted {new Date(sub.createdAt).toLocaleString()}
              </p>
              {sub.status === "pending" && (
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleStatus(sub.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleStatus(sub.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
