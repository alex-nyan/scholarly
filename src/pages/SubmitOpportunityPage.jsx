import { useState, useEffect } from "react";
import { addSubmission, getSubmissions } from "../data/submissionsStore";

const CATEGORIES = [
  "Volunteering",
  "Internship",
  "Scholarship",
  "Event",
  "Workshop",
  "Other",
];

const LIMITS = {
  title: { max: 120, label: "Title" },
  organizationName: { max: 80, label: "Organization name" },
  description: { max: 800, min: 30, label: "Description" },
  link: { max: 500, label: "Link" },
};

const SUBMITTED_FLAG_KEY = "scholarly_submit_success";
const SUBMITTED_FLAG_TTL = 60_000;

const initialForm = {
  title: "",
  description: "",
  category: "",
  link: "",
  organizationName: "",
};

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isDuplicate(title, organizationName) {
  const existing = getSubmissions();
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedOrg = organizationName.trim().toLowerCase();
  return existing.some(
    (s) =>
      s.title.trim().toLowerCase() === normalizedTitle &&
      s.organizationName.trim().toLowerCase() === normalizedOrg
  );
}

function setSubmittedFlag() {
  localStorage.setItem(
    SUBMITTED_FLAG_KEY,
    JSON.stringify({ expiresAt: Date.now() + SUBMITTED_FLAG_TTL })
  );
}

function checkSubmittedFlag() {
  try {
    const raw = localStorage.getItem(SUBMITTED_FLAG_KEY);
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(SUBMITTED_FLAG_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function clearSubmittedFlag() {
  localStorage.removeItem(SUBMITTED_FLAG_KEY);
}

export default function SubmitOpportunityPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(() => checkSubmittedFlag());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!submitted) return;
    const remaining = (() => {
      try {
        const raw = localStorage.getItem(SUBMITTED_FLAG_KEY);
        if (!raw) return 0;
        const { expiresAt } = JSON.parse(raw);
        return Math.max(0, expiresAt - Date.now());
      } catch {
        return 0;
      }
    })();
    if (remaining === 0) { setSubmitted(false); return; }
    const timer = setTimeout(() => setSubmitted(false), remaining);
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const organizationName = form.organizationName.trim();
    const description = form.description.trim();
    const link = form.link.trim();

    if (!title) { setError("Please enter a title."); return; }
    if (!organizationName) { setError("Please enter the organization name."); return; }
    if (!description) { setError("Please enter a description."); return; }
    if (description.length < LIMITS.description.min) {
      setError(`Description must be at least ${LIMITS.description.min} characters.`);
      return;
    }
    if (!form.category) { setError("Please select a category."); return; }
    if (title.length > LIMITS.title.max) {
      setError(`Title must be ${LIMITS.title.max} characters or fewer.`);
      return;
    }
    if (organizationName.length > LIMITS.organizationName.max) {
      setError(`Organization name must be ${LIMITS.organizationName.max} characters or fewer.`);
      return;
    }
    if (description.length > LIMITS.description.max) {
      setError(`Description must be ${LIMITS.description.max} characters or fewer.`);
      return;
    }
    if (link && !isValidUrl(link)) {
      setError("Link must be a valid URL starting with https:// or http://");
      return;
    }
    if (isDuplicate(title, organizationName)) {
      setError("A submission with this title and organization already exists.");
      return;
    }

    addSubmission({ title, description, category: form.category, link, organizationName });
    setForm(initialForm);
    setSubmittedFlag();
    setSubmitted(true);
  };

  const handleSubmitAnother = () => {
    clearSubmittedFlag();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="page submit-page">
        <header className="submit-hero">
          <p className="eyebrow">Thank you</p>
          <h1>Opportunity submitted</h1>
          <p className="subtitle">
            We've received your submission. Our team will review it; if approved,
            it will appear on the Opportunities page. You can submit another below.
          </p>
        </header>
        <div className="submit-actions">
          <button type="button" className="btn btn-primary" onClick={handleSubmitAnother}>
            Submit another opportunity
          </button>
        </div>
      </div>
    );
  }

  const descLength = form.description.length;

  return (
    <div className="page submit-page">
      <header className="submit-hero">
        <p className="eyebrow">Your contribution</p>
        <h1>Submit an opportunity</h1>
        <p className="subtitle">
          Are you an organization with a volunteering, internship, or educational
          opportunity for youths in Myanmar? Submit it here. After review, we'll
          publish it on our Opportunities page.
        </p>
      </header>

      <form className="submit-form" onSubmit={handleSubmit}>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Youth Volunteer Program 2025"
            value={form.title}
            maxLength={LIMITS.title.max}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <span className="field-hint">{form.title.length}/{LIMITS.title.max}</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe the opportunity, who it's for, and how to apply."
            value={form.description}
            maxLength={LIMITS.description.max}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <span className={`field-hint ${descLength < LIMITS.description.min ? "field-hint--warn" : ""}`}>
            {descLength}/{LIMITS.description.max}
            {descLength < LIMITS.description.min && descLength > 0
              ? ` — ${LIMITS.description.min - descLength} more characters required`
              : ""}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            id="link"
            type="text"
            placeholder="https://..."
            value={form.link}
            maxLength={LIMITS.link.max}
            onChange={(e) => handleChange("link", e.target.value)}
          />
          <span className="field-hint">Must start with https:// or http://</span>
        </div>

        <div className="form-group">
          <label htmlFor="organizationName">Organization name *</label>
          <input
            id="organizationName"
            type="text"
            placeholder="e.g. Myanmar Youth Foundation"
            value={form.organizationName}
            maxLength={LIMITS.organizationName.max}
            onChange={(e) => handleChange("organizationName", e.target.value)}
          />
          <span className="field-hint">
            {form.organizationName.length}/{LIMITS.organizationName.max}
          </span>
        </div>

        <div className="submit-actions">
          <button type="submit" className="btn btn-primary">
            Submit opportunity
          </button>
        </div>
      </form>
    </div>
  );
}