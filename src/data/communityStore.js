const POSTS_KEY = "scholarly_community_posts";
const REPLIES_KEY = "scholarly_community_replies";
const COUNTS_KEY = "scholarly_reply_counts";

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

function getStored(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage quota exceeded — silently fail for MVD
  }
}

// ---------------------------------------------------------------------------
// ID generation — crypto.randomUUID() with fallback
// ---------------------------------------------------------------------------

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Reply count cache — avoids full-array parse on every render
// ---------------------------------------------------------------------------

function getCounts() {
  return getStored(COUNTS_KEY, {});
}

function incrementCount(postId) {
  const counts = getCounts();
  counts[postId] = (counts[postId] || 0) + 1;
  setStored(COUNTS_KEY, counts);
}

function rebuildCounts() {
  const replies = getStored(REPLIES_KEY);
  const counts = {};
  for (const r of replies) {
    if (r.postId) counts[r.postId] = (counts[r.postId] || 0) + 1;
  }
  setStored(COUNTS_KEY, counts);
  return counts;
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Post
 * @property {string}      id
 * @property {string}      title
 * @property {string}      body
 * @property {string}      author
 * @property {string}      createdAt
 * @property {number}      votes
 * @property {string|null} acceptedReplyId
 */

/** @returns {Post[]} sorted newest first */
export function getPosts() {
  return getStored(POSTS_KEY).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/** @returns {Post|null} */
export function getPost(id) {
  return getStored(POSTS_KEY).find((p) => p.id === id) || null;
}

/** Add a new post. Returns the created post. */
export function addPost(data) {
  const list = getStored(POSTS_KEY);
  const post = {
    id: generateId(),
    title: (data.title || "").trim(),
    body: (data.body || "").trim(),
    author: (data.author || "Anonymous").trim() || "Anonymous",
    createdAt: new Date().toISOString(),
    votes: 0,
    acceptedReplyId: null,
  };
  list.unshift(post);
  setStored(POSTS_KEY, list);
  return post;
}

/** Upvote a post by id. Returns updated vote count or null if not found. */
export function votePost(id) {
  const list = getStored(POSTS_KEY);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], votes: (list[index].votes || 0) + 1 };
  setStored(POSTS_KEY, list);
  return list[index].votes;
}

// ---------------------------------------------------------------------------
// Replies
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Reply
 * @property {string}      id
 * @property {string}      postId
 * @property {string|null} parentReplyId  — null = top-level; string = nested reply
 * @property {string}      body
 * @property {string}      author
 * @property {string}      createdAt
 * @property {number}      votes
 */

/**
 * Returns all replies for a post, oldest first.
 * @returns {Reply[]}
 */
export function getReplies(postId) {
  return getStored(REPLIES_KEY)
    .filter((r) => r.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Add a reply to a post or to another reply (nested, second level only).
 * Pass parentReplyId to create a nested reply.
 * Returns the created reply.
 */
export function addReply(data) {
  const list = getStored(REPLIES_KEY);
  const reply = {
    id: generateId(),
    postId: data.postId,
    parentReplyId: data.parentReplyId || null,
    body: (data.body || "").trim(),
    author: (data.author || "Anonymous").trim() || "Anonymous",
    createdAt: new Date().toISOString(),
    votes: 0,
  };
  list.push(reply);
  setStored(REPLIES_KEY, list);
  incrementCount(data.postId);
  return reply;
}

/** Upvote a reply by id. Returns updated vote count or null if not found. */
export function voteReply(id) {
  const list = getStored(REPLIES_KEY);
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], votes: (list[index].votes || 0) + 1 };
  setStored(REPLIES_KEY, list);
  return list[index].votes;
}

// ---------------------------------------------------------------------------
// Accepted answer
// ---------------------------------------------------------------------------

/**
 * Mark a reply as the accepted answer for a post.
 * TODO: restrict to post author once auth is implemented.
 * @returns {Post|null} updated post
 */
export function acceptReply(postId, replyId) {
  const list = getStored(POSTS_KEY);
  const index = list.findIndex((p) => p.id === postId);
  if (index === -1) return null;
  list[index] = { ...list[index], acceptedReplyId: replyId };
  setStored(POSTS_KEY, list);
  return list[index];
}

/**
 * Unmark the accepted answer for a post.
 * TODO: restrict to post author once auth is implemented.
 * @returns {Post|null} updated post
 */
export function unacceptReply(postId) {
  const list = getStored(POSTS_KEY);
  const index = list.findIndex((p) => p.id === postId);
  if (index === -1) return null;
  list[index] = { ...list[index], acceptedReplyId: null };
  setStored(POSTS_KEY, list);
  return list[index];
}

// ---------------------------------------------------------------------------
// Reply count (cached)
// ---------------------------------------------------------------------------

/** Returns the cached reply count for a post. Fast — no full array parse. */
export function getReplyCount(postId) {
  const counts = getCounts();
  if (counts[postId] === undefined) {
    return rebuildCounts()[postId] || 0;
  }
  return counts[postId];
}

// ---------------------------------------------------------------------------
// Data integrity — orphan repair
// ---------------------------------------------------------------------------

/**
 * Remove replies whose postId no longer exists in the posts list.
 * Call from a dev/admin utility; not invoked automatically.
 */
export function repairOrphans() {
  const posts = getStored(POSTS_KEY);
  const postIds = new Set(posts.map((p) => p.id));
  const replies = getStored(REPLIES_KEY).filter((r) => postIds.has(r.postId));
  setStored(REPLIES_KEY, replies);
  rebuildCounts();
}