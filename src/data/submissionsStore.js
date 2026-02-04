const STORAGE_KEY = "scholarly_submissions";

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStored(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** @returns {Array<{ id: string, title: string, description: string, category: string, link: string, organizationName: string, status: 'pending'|'accepted'|'rejected', createdAt: string }>} */
export function getSubmissions() {
  return getStored();
}

/** @returns submissions with status 'accepted' only */
export function getAcceptedSubmissions() {
  return getStored().filter((s) => s.status === "accepted");
}

/** Add a new submission (status: pending). Returns the created submission. */
export function addSubmission(data) {
  const list = getStored();
  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const submission = {
    id,
    title: data.title || "",
    description: data.description || "",
    category: data.category || "",
    link: data.link || "",
    organizationName: data.organizationName || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  list.unshift(submission);
  setStored(list);
  return submission;
}

/** Update status of a submission by id. */
export function updateSubmissionStatus(id, status) {
  if (!["pending", "accepted", "rejected"].includes(status)) return null;
  const list = getStored();
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], status };
  setStored(list);
  return list[index];
}
