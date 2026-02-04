import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPost,
  getReplies,
  addReply,
} from "../data/communityStore";

export default function CommunityPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [form, setForm] = useState({ body: "", author: "" });
  const [error, setError] = useState("");

  const refresh = () => {
    const p = getPost(id);
    setPost(p);
    setReplies(p ? getReplies(id) : []);
  };

  useEffect(() => {
    refresh();
  }, [id]);

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
      author: form.author.trim(),
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

      <article className="community-post card">
        <h1 className="community-post-title">{post.title}</h1>
        <div className="community-post-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
        {post.body && (
          <div className="community-post-body">{post.body}</div>
        )}
      </article>

      <section className="community-replies">
        <h2 className="replies-title">
          {replies.length === 0
            ? "No answers yet"
            : `${replies.length} answer${replies.length === 1 ? "" : "s"}`}
        </h2>

        {replies.length > 0 && (
          <ul className="reply-list">
            {replies.map((reply) => (
              <li key={reply.id} className="reply-card card">
                <div className="reply-body">{reply.body}</div>
                <div className="reply-meta">
                  <span className="reply-author">{reply.author}</span>
                  <span className="reply-date">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
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
