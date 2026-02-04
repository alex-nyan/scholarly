import { useState } from "react";
import { addSubmission } from "../data/submissionsStore";

const CATEGORIES = [
  "Volunteering",
  "Internship",
  "Scholarship",
  "Event",
  "Workshop",
  "Other",
];

const initialForm = {
  title: "",
  description: "",
  category: "",
  link: "",
  organizationName: "",
};

export default function SubmitOpportunityPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const organizationName = form.organizationName.trim();
    if (!title) {
      setError("Please enter a title.");
      return;
    }
    if (!organizationName) {
      setError("Please enter the organization name.");
      return;
    }

    addSubmission({
      title,
      description: form.description.trim(),
      category: form.category,
      link: form.link.trim(),
      organizationName,
    });
    setForm(initialForm);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page submit-page">
        <header className="submit-hero">
          <p className="eyebrow">Thank you</p>
          <h1>Opportunity submitted</h1>
          <p className="subtitle">
            We’ve received your submission. Our team will review it; if approved,
            it will appear on the Opportunities page. You can submit another
            below.
          </p>
        </header>
        <div className="submit-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setSubmitted(false)}
          >
            Submit another opportunity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page submit-page">
      <header className="submit-hero">
        <p className="eyebrow">Your contribution</p>
        <h1>Submit an opportunity</h1>
        <p className="subtitle">
          Are you an organization with a volunteering, internship, or educational
          opportunity for youths in Myanmar? Submit it here. After review, we’ll
          publish it on our Opportunities page.
        </p>
      </header>

      <form className="submit-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Youth Volunteer Program 2025"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe the opportunity, who it’s for, and how to apply."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            id="link"
            type="url"
            placeholder="https://..."
            value={form.link}
            onChange={(e) => handleChange("link", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="organizationName">Organization name *</label>
          <input
            id="organizationName"
            type="text"
            placeholder="e.g. Myanmar Youth Foundation"
            value={form.organizationName}
            onChange={(e) => handleChange("organizationName", e.target.value)}
          />
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
