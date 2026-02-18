const POSTS_KEY = "scholarly_community_posts";
const REPLIES_KEY = "scholarly_community_replies";
const VOTES_KEY = "scholarly_community_votes";

function getStored(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStored(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Vote weight: admin = 3, verified user = 2, normal user = 1. Anonymous = 0 (cannot vote). */
export function getVoteWeight(user, profile) {
  if (!user?.email) return 0;
  if (user.role === "admin") return 3;
  if (profile?.verified === true) return 2;
  return 1;
}

function getVotesRaw() {
  return getStored(VOTES_KEY);
}

function setVotesRaw(data) {
  setStored(VOTES_KEY, data);
}

/** Get all votes for a single target. */
function getVotesForTarget(targetType, targetId) {
  return getVotesRaw().filter(
    (v) => v.targetType === targetType && v.targetId === targetId
  );
}

/** Compute weighted score for a target (sum of direction * voterWeight). */
export function getScore(targetType, targetId) {
  const votes = getVotesForTarget(targetType, targetId);
  return votes.reduce((sum, v) => sum + v.direction * (v.voterWeight || 1), 0);
}

/** Get score map for many targets. */
export function getScoresForTargets(targetType, targetIds) {
  const votes = getVotesRaw().filter(
    (v) => v.targetType === targetType && targetIds.includes(v.targetId)
  );
  const map = {};
  for (const id of targetIds) map[id] = 0;
  for (const v of votes) {
    map[v.targetId] = (map[v.targetId] || 0) + v.direction * (v.voterWeight || 1);
  }
  return map;
}

/** Get current user's vote for a target: 1, -1, or 0. */
export function getUserVote(targetType, targetId, voterId) {
  if (!voterId) return 0;
  const votes = getVotesForTarget(targetType, targetId);
  const v = votes.find((x) => x.voterId === voterId);
  return v ? v.direction : 0;
}

/**
 * Set or update vote. voterId = user.email (required to vote). direction = 1 (up) or -1 (down).
 * voterWeight from getVoteWeight(user, profile). If direction 0, removes vote.
 */
export function setVote(targetType, targetId, voterId, direction, voterWeight) {
  if (!voterId || voterWeight === 0) return;
  const list = getVotesRaw();
  const rest = list.filter(
    (v) =>
      !(
        v.targetType === targetType &&
        v.targetId === targetId &&
        v.voterId === voterId
      )
  );
  if (direction !== 0) {
    rest.push({
      targetType,
      targetId,
      voterId,
      direction: direction === 1 ? 1 : -1,
      voterWeight: voterWeight || 1,
    });
  }
  setVotesRaw(rest);
}

/** @returns {Array<{ id: string, title: string, body: string, author: string, createdAt: string }>} */
export function getPosts() {
  return getStored(POSTS_KEY).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/** @returns post or null */
export function getPost(id) {
  return getStored(POSTS_KEY).find((p) => p.id === id) || null;
}

/** Add a new question. Returns the created post. */
export function addPost(data) {
  const list = getStored(POSTS_KEY);
  const post = {
    id: generateId(),
    title: (data.title || "").trim(),
    body: (data.body || "").trim(),
    author: (data.author || "Anonymous").trim() || "Anonymous",
    authorEmail: data.authorEmail || null,
    createdAt: new Date().toISOString(),
  };
  list.unshift(post);
  setStored(POSTS_KEY, list);
  return post;
}

/** @returns {Array<{ id: string, postId: string, body: string, author: string, createdAt: string }>} */
export function getReplies(postId) {
  return getStored(REPLIES_KEY)
    .filter((r) => r.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/** Add a reply to a post. Returns the created reply. */
export function addReply(data) {
  const list = getStored(REPLIES_KEY);
  const reply = {
    id: generateId(),
    postId: data.postId,
    body: (data.body || "").trim(),
    author: (data.author || "Anonymous").trim() || "Anonymous",
    authorEmail: data.authorEmail || null,
    createdAt: new Date().toISOString(),
  };
  list.push(reply);
  setStored(REPLIES_KEY, list);
  return reply;
}

/** Get reply count for a post (convenience). */
export function getReplyCount(postId) {
  return getStored(REPLIES_KEY).filter((r) => r.postId === postId).length;
}
