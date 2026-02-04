const POSTS_KEY = "scholarly_community_posts";
const REPLIES_KEY = "scholarly_community_replies";

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
