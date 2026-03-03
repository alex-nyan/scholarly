import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPost,
  getReplies,
  addReply,
  votePost,
  voteReply,
  acceptReply,
  unacceptReply,
} from "../data/communityStore";

// ---------------------------------------------------------------------------
// Inline reply form — used for both top-level and nested replies
// ---------------------------------------------------------------------------

function ReplyForm({ postId, parentReplyId = null, onSubmitted, onCancel, autoFocus = false }) {
  const [form, setForm] = useState({ body: "", author: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = form.body.trim();
    if (!body) { setError("Please enter your reply."); return; }
    addReply({ postId, parentReplyId, body, author: form.author.trim() });
    setForm({ body: "", author: "" });
    onSubmitted();
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-group">
        <label htmlFor={`reply-body-${parentReplyId || "root"}`}>
          {parentReplyId ? "Write your reply" : "Your answer"}
        </label>
        <textarea
          id={`reply-body-${parentReplyId || "root"}`}
          rows={3}
          placeholder={parentReplyId ? "Reply to this answer..." : "Write your answer here..."}
          value={form.body}
          autoFocus={autoFocus}
          onChange={(e) => { setForm((p) => ({ ...p, body: e.target.value })); setError(""); }}
        />
      </div>
      <div className="form-group">
        <label htmlFor={`reply-author-${parentReplyId || "root"}`}>Your name (optional)</label>
        <input
          id={`reply-author-${parentReplyId || "root"}`}
          type="text"
          placeholder="Anonymous if left blank"
          value={form.author}
          onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
        />
      </div>
      <div className="reply-form-actions">
        <button type="submit" className="btn btn-primary btn--sm">
          {parentReplyId ? "Post reply" : "Post answer"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary btn--sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Nested reply card (second level)
// ---------------------------------------------------------------------------

function NestedReply({ reply, votedReplies, onVote }) {
  const hasVoted = votedReplies.has(reply.id);
  return (
    <li className="nested-reply">
      <div className="nested-reply-vote">
        <button
          type="button"
          className={`vote-btn vote-btn--sm ${hasVoted ? "vote-btn--voted" : ""}`}
          onClick={() => onVote(reply.id)}
          disabled={hasVoted}
          aria-label={hasVoted ? "Already upvoted" : "Upvote this reply"}
        >
          ▲
        </button>
        <span className="vote-count">{reply.votes || 0}</span>
      </div>
      <div className="nested-reply-content">
        <div className="reply-body">{reply.body}</div>
        <div className="reply-meta">
          <span className="reply-author">{reply.author}</span>
          <span className="reply-date">{new Date(reply.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Top-level reply card (first level) — with nested replies beneath
// ---------------------------------------------------------------------------

function TopLevelReply({ reply, nestedReplies, postId, acceptedReplyId, votedReplies, onVote, onAccept, onRefresh }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isAccepted = acceptedReplyId === reply.id;
  const hasVoted = votedReplies.has(reply.id);

  const handleAcceptToggle = () => {
    if (isAccepted) {
      unacceptReply(postId);
    } else {
      acceptReply(postId, reply.id);
    }
    onAccept();
  };

  return (
    <li className={`reply-card card ${isAccepted ? "reply-card--accepted" : ""}`}>
      <div className="reply-card-inner">
        {/* Vote column */}
        <div className="reply-vote">
          <button
            type="button"
            className={`vote-btn ${hasVoted ? "vote-btn--voted" : ""}`}
            onClick={() => onVote(reply.id)}
            disabled={hasVoted}
            aria-label={hasVoted ? "Already upvoted" : "Upvote this answer"}
          >
            ▲
          </button>
          <span className="vote-count">{reply.votes || 0}</span>
          {/* TODO: restrict to post author once auth is implemented */}
          <button
            type="button"
            className={`accept-btn ${isAccepted ? "accept-btn--active" : ""}`}
            onClick={handleAcceptToggle}
            aria-label={isAccepted ? "Unmark accepted answer" : "Mark as accepted answer"}
            title={isAccepted ? "Unmark as accepted" : "Mark as accepted answer"}
          >
            ✓
          </button>
        </div>

        {/* Content column */}
        <div className="reply-content">
          {isAccepted && (
            <span className="accepted-badge">✓ Accepted Answer</span>
          )}
          <div className="reply-body">{reply.body}</div>
          <div className="reply-meta">
            <span className="reply-author">{reply.author}</span>
            <span className="reply-date">{new Date(reply.createdAt).toLocaleString()}</span>
          </div>

          {/* Nested replies */}
          {nestedReplies.length > 0 && (
            <ul className="nested-reply-list">
              {nestedReplies.map((nr) => (
                <NestedReply
                  key={nr.id}
                  reply={nr}
                  votedReplies={votedReplies}
                  onVote={onVote}
                />
              ))}
            </ul>
          )}

          {/* Inline reply-to-reply form */}
          {showReplyForm ? (
            <ReplyForm
              postId={postId}
              parentReplyId={reply.id}
              autoFocus
              onSubmitted={() => { setShowReplyForm(false); onRefresh(); }}
              onCancel={() => setShowReplyForm(false)}
            />
          ) : (
            <button
              type="button"
              className="btn-text-reply"
              onClick={() => setShowReplyForm(true)}
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CommunityPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [votedPost, setVotedPost] = useState(false);
  const [votedReplies, setVotedReplies] = useState(() => new Set());

  const refresh = () => {
    const p = getPost(id);
    setPost(p);
    setReplies(p ? getReplies(id) : []);
  };

  useEffect(() => { refresh(); }, [id]);

  const handleVotePost = () => {
    if (votedPost) return;
    votePost(id);
    setVotedPost(true);
    refresh();
  };

  const handleVoteReply = (replyId) => {
    if (votedReplies.has(replyId)) return;
    voteReply(replyId);
    setVotedReplies((prev) => new Set([...prev, replyId]));
    refresh();
  };

  if (!post) {
    return (
      <div className="page community-page">
        <p className="error">Question not found.</p>
        <Link to="/community" className="link">← Back to Community</Link>
      </div>
    );
  }

  // Separate top-level replies from nested replies
  const topLevel = replies.filter((r) => !r.parentReplyId);
  const nested = replies.filter((r) => r.parentReplyId);

  // Group nested replies by parentReplyId
  const nestedByParent = nested.reduce((acc, r) => {
    if (!acc[r.parentReplyId]) acc[r.parentReplyId] = [];
    acc[r.parentReplyId].push(r);
    return acc;
  }, {});

  // Accepted reply pinned first, rest sorted by votes then date
  const sortedTopLevel = [...topLevel].sort((a, b) => {
    if (a.id === post.acceptedReplyId) return -1;
    if (b.id === post.acceptedReplyId) return 1;
    return (b.votes || 0) - (a.votes || 0);
  });

  const totalCount = replies.length;

  return (
    <div className="page community-page">
      <nav className="community-breadcrumb">
        <Link to="/community" className="link">← Community</Link>
      </nav>

      {/* Post */}
      <article className="community-post card">
        <div className="community-post-inner">
          <div className="post-vote">
            <button
              type="button"
              className={`vote-btn ${votedPost ? "vote-btn--voted" : ""}`}
              onClick={handleVotePost}
              disabled={votedPost}
              aria-label={votedPost ? "Already upvoted" : "Upvote this question"}
            >
              ▲
            </button>
            <span className="vote-count">{post.votes || 0}</span>
          </div>
          <div className="post-content">
            <h1 className="community-post-title">{post.title}</h1>
            <div className="community-post-meta">
              <span className="post-author">{post.author}</span>
              <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            {post.body && <div className="community-post-body">{post.body}</div>}
          </div>
        </div>
      </article>

      {/* Replies */}
      <section className="community-replies">
        <h2 className="replies-title">
          {totalCount === 0 ? "No answers yet" : `${totalCount} ${totalCount === 1 ? "answer" : "answers"}`}
        </h2>

        {sortedTopLevel.length > 0 && (
          <ul className="reply-list">
            {sortedTopLevel.map((reply) => (
              <TopLevelReply
                key={reply.id}
                reply={reply}
                nestedReplies={nestedByParent[reply.id] || []}
                postId={id}
                acceptedReplyId={post.acceptedReplyId}
                votedReplies={votedReplies}
                onVote={handleVoteReply}
                onAccept={refresh}
                onRefresh={refresh}
              />
            ))}
          </ul>
        )}

        {/* Top-level answer form */}
        <div className="reply-form-wrap card">
          <h3 className="reply-form-title">Your answer</h3>
          <ReplyForm
            postId={id}
            onSubmitted={refresh}
          />
        </div>
      </section>
    </div>
  );
}