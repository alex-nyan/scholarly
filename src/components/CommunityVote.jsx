import { useAuth } from "../context/AuthContext";
import {
  getScore,
  getUserVote,
  setVote,
  getVoteWeight,
} from "../data/communityStore";

export default function CommunityVote({ targetType, targetId, onAfterVote }) {
  const { user, profile } = useAuth();
  const voterId = user?.email || null;
  const score = getScore(targetType, targetId);
  const userVote = getUserVote(targetType, targetId, voterId);
  const weight = getVoteWeight(user, profile);
  const canVote = Boolean(voterId && weight > 0);

  function handleVote(direction) {
    if (!canVote) return;
    const next = userVote === direction ? 0 : direction;
    setVote(targetType, targetId, voterId, next, weight);
    onAfterVote?.();
  }

  return (
    <div className="community-vote" role="group" aria-label="Vote">
      <button
        type="button"
        className={`community-vote-btn community-vote-up ${userVote === 1 ? "is-active" : ""}`}
        onClick={() => handleVote(1)}
        disabled={!canVote}
        aria-label="Upvote"
        title={canVote ? "Upvote" : "Sign in to vote"}
      >
        <span aria-hidden>↑</span>
      </button>
      <span className="community-vote-score" title="Score (weighted: mods & verified count more)">
        {score}
      </span>
      <button
        type="button"
        className={`community-vote-btn community-vote-down ${userVote === -1 ? "is-active" : ""}`}
        onClick={() => handleVote(-1)}
        disabled={!canVote}
        aria-label="Downvote"
        title={canVote ? "Downvote" : "Sign in to vote"}
      >
        <span aria-hidden>↓</span>
      </button>
    </div>
  );
}
