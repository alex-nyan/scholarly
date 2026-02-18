import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPost,
  getReplies,
  addReply,
  getScoresForTargets,
} from "../data/communityStore";
import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../api/auth";
import CommunityVote from "../components/CommunityVote";

export default function CommunityPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [scoreMap, setScoreMap] = useState({});
  const [form, setForm] = useState({ body: "", author: "" });
  const [error, setError] = useState("");

  const refresh = () => {
    const p = getPost(id);
    setPost(p);
    const rawReplies = p ? getReplies(id) : [];
    setReplies(rawReplies);
    const replyIds = rawReplies.map((r) => r.id);
    setScoreMap(
      replyIds.length
        ? getScoresForTargets("reply", replyIds)
        : {}
    );
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const sortedReplies = useMemo(() => {
    return [...replies].sort((a, b) => {
      const scoreA = scoreMap[a.id] ?? 0;
      const scoreB = scoreMap[b.id] ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [replies, scoreMap]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const body = form.body.trim();
    if (!body) {
      setError("Please enter your answer.");
      return;
    }
    addReply({
      postId: id,
      body,
      author: form.author.trim() || "Anonymous",
      authorEmail: user?.email || null,
    });
    setForm({ body: "", author: "" });
    refresh();
  };

  if (!post) {
    return (
      <div className="page community-page">
        <p className="error">Question not found.</p>
        <Link to="/community" className="link">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="page community-page">
      <nav className="community-breadcrumb">
        <Link to="/community" className="link">
          ← Community
        </Link>
      </nav>

      <article className="community-post card community-post-with-vote">
        <CommunityVote
          targetType="post"
          targetId={post.id}
          onAfterVote={refresh}
        />
        <div className="community-post-content">
          <h1 className="community-post-title">{post.title}</h1>
          <div className="community-post-meta">
            <span className="post-author">
              {post.author}
              {isAdminEmail(post.authorEmail) && (
                <span className="post-badge post-badge--mod" title="Moderator">Mod</span>
              )}
            </span>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          {post.body && (
            <div className="community-post-body">{post.body}</div>
          )}
        </div>
      </article>

      <section className="community-replies">
        <h2 className="replies-title">
          {replies.length === 0
            ? "No answers yet"
            : `${replies.length} answer${replies.length === 1 ? "" : "s"}`}
        </h2>

        {replies.length > 0 && (
          <ul className="reply-list">
            {sortedReplies.map((reply) => (
              <li key={reply.id} className="reply-card card reply-card-with-vote">
                <CommunityVote
                  targetType="reply"
                  targetId={reply.id}
                  onAfterVote={refresh}
                />
                <div className="reply-content">
                  <div className="reply-body">{reply.body}</div>
                  <div className="reply-meta">
                    <span className="reply-author">
                      {reply.author}
                      {isAdminEmail(reply.authorEmail) && (
                        <span className="post-badge post-badge--mod" title="Moderator">Mod</span>
                      )}
                    </span>
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="reply-form card" onSubmit={handleSubmit}>
          <h3 className="reply-form-title">Your answer</h3>
          {error && <p className="form-error">{error}</p>}
          <div className="form-group">
            <textarea
              placeholder="Write your answer here..."
              rows={4}
              value={form.body}
              onChange={(e) => handleChange("body", e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Post answer
          </button>
        </form>
      </section>
    </div>
  );
}
