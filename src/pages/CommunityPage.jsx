import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getPosts,
  addPost,
  getReplyCount,
  getScoresForTargets,
} from "../data/communityStore";
import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../api/auth";
import CommunityVote from "../components/CommunityVote";

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [scoreMap, setScoreMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", author: "" });
  const [error, setError] = useState("");

  const refresh = () => {
    const list = getPosts();
    setPosts(list);
    const ids = list.map((p) => p.id);
    setScoreMap(getScoresForTargets("post", ids));
  };

  useEffect(() => {
    refresh();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const scoreA = scoreMap[a.id] ?? 0;
      const scoreB = scoreMap[b.id] ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [posts, scoreMap]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const title = form.title.trim();
    if (!title) {
      setError("Please enter a title for your question.");
      return;
    }
    addPost({
      title,
      body: form.body.trim(),
      author: form.author.trim() || "Anonymous",
      authorEmail: user?.email || null,
    });
    setForm({ title: "", body: "", author: "" });
    setShowForm(false);
    refresh();
  };

  return (
    <div className="page community-page">
      <header className="community-hero">
        <p className="eyebrow">Community</p>
        <h1>Q&A Forum</h1>
        <p className="subtitle">
          Ask questions and help other students by answering. Topics can be
          academics, pathways, volunteering, or anything related to youth
          opportunities in Myanmar.
        </p>
        <p className="community-vote-hint">
          Vote with ↑ / ↓ — higher scores rise. Sign in to vote; Mod & verified users’ votes count more.
        </p>
      </header>

      <div className="community-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Ask a question"}
        </button>
      </div>

      {showForm && (
        <form className="community-form card" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <div className="form-group">
            <label htmlFor="q-title">Question title *</label>
            <input
              id="q-title"
              type="text"
              placeholder="e.g. How do I prepare for IGCSE exams?"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="q-body">Details (optional)</label>
            <textarea
              id="q-body"
              rows={4}
              placeholder="Add more context so others can help."
              value={form.body}
              onChange={(e) => handleChange("body", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="q-author">Your name (optional)</label>
            <input
              id="q-author"
              type="text"
              placeholder="Anonymous if left blank"
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Post question
          </button>
        </form>
      )}

      <section className="community-list">
        <h2 className="community-list-title">Recent questions</h2>
        {posts.length === 0 ? (
          <div className="empty">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          <ul className="post-list">
            {sortedPosts.map((post) => (
              <li key={post.id} className="post-list-item">
                <CommunityVote
                  targetType="post"
                  targetId={post.id}
                  onAfterVote={refresh}
                />
                <Link to={`/community/${post.id}`} className="post-card card">
                  <h3 className="post-card-title">{post.title}</h3>
                  {post.body && (
                    <p className="post-card-preview">
                      {post.body.slice(0, 120)}
                      {post.body.length > 120 ? "…" : ""}
                    </p>
                  )}
                  <div className="post-card-meta">
                    <span className="post-card-author">
                      {post.author}
                      {isAdminEmail(post.authorEmail) && (
                        <span className="post-badge post-badge--mod" title="Moderator">Mod</span>
                      )}
                    </span>
                    <span className="post-card-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="post-card-count">
                      {getReplyCount(post.id)} answer{getReplyCount(post.id) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
