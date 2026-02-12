import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EDUCATION_OPTIONS = [
  "",
  "High School",
  "Undergraduate",
  "Graduate",
  "Any",
  "Any Education",
];

export default function ProfilePage() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setAge(profile.age != null ? String(profile.age) : "");
      setEducationLevel(profile.education_level ?? "");
      setCountry(profile.country ?? "");
    }
  }, [user, profile, authLoading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({
        display_name: displayName.trim() || undefined,
        age: age === "" ? undefined : parseInt(age, 10),
        education_level: educationLevel || undefined,
        country: country.trim() || undefined,
      });
      setMessage("Profile saved. Your scholarship recommendations will update.");
    } catch (err) {
      setMessage(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="page profile-page">
      <div className="profile-card">
        <h1>Your profile</h1>
        <p className="profile-email">{user.email}</p>
        <p className="profile-hint">
          Set your age and education level so we can recommend the best scholarships for you.
        </p>
        {message && <p className={message.startsWith("Profile") ? "profile-success" : "auth-error"}>{message}</p>}
        <form onSubmit={handleSubmit} className="auth-form profile-form">
          <label htmlFor="profile-name">Display name</label>
          <input
            id="profile-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Optional"
          />
          <label htmlFor="profile-age">Age</label>
          <input
            id="profile-age"
            type="number"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 18"
          />
          <label htmlFor="profile-education">Education level</label>
          <select
            id="profile-education"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
          >
            {EDUCATION_OPTIONS.map((opt) => (
              <option key={opt || "any"} value={opt}>
                {opt || "Select…"}
              </option>
            ))}
          </select>
          <label htmlFor="profile-country">Country</label>
          <input
            id="profile-country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Myanmar"
          />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
        <p className="auth-footer">
          <Link to="/scholarships">View scholarships</Link> · <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
}
