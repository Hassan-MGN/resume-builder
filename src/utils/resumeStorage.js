const DRAFTS_KEY = "resumepro-drafts";
const COMPLETED_KEY = "resumepro-resumes";
const CURRENT_DRAFT_KEY = "resumepro-current-draft";
const ACTIVE_USER_KEY = "resumepro-active-user";
const LEGACY_KEY = "resume-builder-state";
const CLOUD_SYNC_KEY = "resumepro-cloud-sync";
const CLOUD_UNAVAILABLE_KEY = "resumepro-cloud-unavailable";
const LEGACY_OWNER_KEY = "resumepro-legacy-owner";
const OUTBOX_KEY = "resumepro-sync-outbox";
const TOMBSTONES_KEY = "resumepro-sync-tombstones";
const MAX_LOCAL_DOCUMENT_BYTES = 4_500_000;
const SYNC_TIMEOUT_MS = 20_000;

const safeParse = (value, fallback = []) => {
  try {
    if (value == null) return fallback;
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const getActiveUserId = () => {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(ACTIVE_USER_KEY) || null;
};

const scopedKey = (baseKey) => {
  const userId = getActiveUserId();
  return userId ? `${baseKey}:${userId}` : `${baseKey}:anonymous`;
};

const outboxKey = () => scopedKey(OUTBOX_KEY);
const tombstoneKey = () => scopedKey(TOMBSTONES_KEY);

export const setActiveResumeUser = (userId) => {
  if (typeof sessionStorage === "undefined") return;
  const normalized = userId ? String(userId) : "";
  sessionStorage.setItem(ACTIVE_USER_KEY, normalized);
  if (!normalized) setCurrentDraftId(null);
  resetCloudAvailability();
};

export const getActiveResumeUser = () => getActiveUserId();

const uid = (prefix = "resume") => {
  const random = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${random}`;
};

const now = () => new Date().toISOString();

const getCloudConfig = () => {
  if (typeof import.meta === "undefined" || !import.meta.env) return null;
  const url = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_API_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
};

const cloudHeaders = (accessToken) => {
  const config = getCloudConfig();
  if (!config || !accessToken) return null;
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const getUserIdFromAccessToken = (accessToken) => {
  try {
    const payload = accessToken?.split(".")?.[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
    return decoded?.sub || null;
  } catch {
    return null;
  }
};

const safeSetItem = (key, value) => {
  if (typeof localStorage === "undefined") return false;
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    if (serialized.length > MAX_LOCAL_DOCUMENT_BYTES && (key.includes(DRAFTS_KEY) || key.includes(COMPLETED_KEY))) {
      throw new Error("This resume is too large for local browser storage. Please remove or resize the profile photo.");
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("[Resummetry] Local storage write failed:", error);
    return false;
  }
};

const safeRemoveItem = (key) => {
  if (typeof localStorage === "undefined") return;
  try { localStorage.removeItem(key); } catch (error) { console.error("[Resummetry] Local storage remove failed:", error); }
};

const setCloudSyncState = (state) => {
  safeSetItem(scopedKey(CLOUD_SYNC_KEY), { ...state, updatedAt: now() });
};

export const getCloudSyncState = () => {
  if (typeof localStorage === "undefined") return { status: "local" };
  return safeParse(localStorage.getItem(scopedKey(CLOUD_SYNC_KEY)), { status: "local" });
};

const isCloudUnavailable = () => {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(`${CLOUD_UNAVAILABLE_KEY}:${getActiveUserId() || "anonymous"}`) === "true";
};

const markCloudUnavailable = (reason = "not-configured") => {
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem(`${CLOUD_UNAVAILABLE_KEY}:${getActiveUserId() || "anonymous"}`, "true");
  setCloudSyncState({ status: "local", reason });
};

export const resetCloudAvailability = () => {
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(`${CLOUD_UNAVAILABLE_KEY}:${getActiveUserId() || "anonymous"}`);
};

export const getDrafts = () => {
  if (typeof localStorage === "undefined") return [];
  const value = safeParse(localStorage.getItem(scopedKey(DRAFTS_KEY)), []);
  return Array.isArray(value) ? value : [];
};

export const getCompletedResumes = () => {
  if (typeof localStorage === "undefined") return [];
  const value = safeParse(localStorage.getItem(scopedKey(COMPLETED_KEY)), []);
  return Array.isArray(value) ? value : [];
};

export const getCurrentDraftId = () => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(scopedKey(CURRENT_DRAFT_KEY)) || null;
};

export const setCurrentDraftId = (id) => {
  if (typeof localStorage === "undefined") return;
  if (id) safeSetItem(scopedKey(CURRENT_DRAFT_KEY), id);
  else safeRemoveItem(scopedKey(CURRENT_DRAFT_KEY));
};

export const clearLocalResumeDataForUser = (userId) => {
  if (typeof localStorage === "undefined" || !userId) return;
  const scope = String(userId);
  [DRAFTS_KEY, COMPLETED_KEY, CURRENT_DRAFT_KEY, CLOUD_SYNC_KEY, OUTBOX_KEY, TOMBSTONES_KEY].forEach((base) => {
    safeRemoveItem(`${base}:${scope}`);
  });
};

export const getDraftById = (id) => getDrafts().find((draft) => draft.id === id) || null;
export const getCompletedResumeById = (id) => getCompletedResumes().find((item) => item.id === id) || null;

export const deriveResumeTitle = (resume, fallback = "Untitled Resume") => {
  const name = resume?.personal?.fullname?.trim?.();
  return name || fallback;
};

const normalizeDocument = (doc, kind = "draft") => {
  const timestamp = now();
  return {
    ...doc,
    id: doc?.id || uid(kind === "completed" ? "resume" : "draft"),
    title: doc?.title || deriveResumeTitle(doc?.resume),
    resume: doc?.resume && typeof doc.resume === "object" ? doc.resume : {},
    createdAt: doc?.createdAt || timestamp,
    updatedAt: doc?.updatedAt || timestamp,
    revision: Number.isFinite(Number(doc?.revision)) && Number(doc.revision) > 0 ? Number(doc.revision) : 1,
    _cloudUpdatedAt: doc?._cloudUpdatedAt || null,
    _cloudRevision: Number.isFinite(Number(doc?._cloudRevision)) ? Number(doc._cloudRevision) : null,
  };
};

const writeDrafts = (drafts) => safeSetItem(scopedKey(DRAFTS_KEY), drafts.map((draft) => normalizeDocument(draft, "draft")));
const writeCompleted = (resumes) => safeSetItem(scopedKey(COMPLETED_KEY), resumes.map((resume) => normalizeDocument(resume, "completed")));

const bumpRevision = (value, fallback = 1) => {
  const current = Number(value);
  return Number.isFinite(current) && current > 0 ? current + 1 : fallback;
};

export const createDraft = ({ resume, template = null, mode = "scratch", source = "scratch", title } = {}) => {
  const timestamp = now();
  const draft = normalizeDocument({
    id: uid("draft"),
    title: title || deriveResumeTitle(resume),
    template: template || null,
    mode,
    source,
    resume: resume || {},
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
  });
  writeDrafts([draft, ...getDrafts()]);
  setCurrentDraftId(draft.id);
  return draft;
};

export const saveDraft = (draft) => {
  if (!draft?.id) return null;
  const drafts = getDrafts();
  const previous = drafts.find((item) => item.id === draft.id);
  const timestamp = now();
  const next = normalizeDocument({
    ...draft,
    title: draft.title || deriveResumeTitle(draft.resume),
    updatedAt: timestamp,
    revision: bumpRevision(previous?.revision, Number(draft.revision) > 0 ? Number(draft.revision) : 1),
  }, "draft");
  const index = drafts.findIndex((item) => item.id === draft.id);
  if (index === -1) drafts.unshift(next);
  else drafts[index] = next;
  if (!writeDrafts(drafts)) return previous || null;
  setCurrentDraftId(next.id);
  return next;
};

export const updateDraft = (id, patch = {}) => {
  const current = getDraftById(id);
  if (!current) return null;
  return saveDraft({ ...current, ...patch });
};

export const renameDraft = (id, title) => {
  const cleanTitle = String(title || "").trim().slice(0, 160);
  if (!id || !cleanTitle) return null;
  return updateDraft(id, { title: cleanTitle });
};

export const renameCompletedResume = (id, title) => {
  const cleanTitle = String(title || "").trim().slice(0, 160);
  if (!id || !cleanTitle) return null;
  const current = getCompletedResumeById(id);
  if (!current) return null;
  const next = normalizeDocument({ ...current, title: cleanTitle, updatedAt: now(), revision: bumpRevision(current.revision) }, "completed");
  writeCompleted(getCompletedResumes().map((item) => item.id === id ? next : item));
  return next;
};

export const duplicateDraft = (id, title) => {
  const current = getDraftById(id);
  if (!current) return null;
  return createDraft({
    resume: structuredClone(current.resume || {}),
    template: current.template || null,
    mode: current.mode || "scratch",
    source: "duplicate",
    title: title || `${current.title || deriveResumeTitle(current.resume)} Copy`,
  });
};

export const duplicateCompletedResume = (id, title) => {
  const current = getCompletedResumeById(id);
  if (!current) return null;
  return createDraft({
    resume: structuredClone(current.resume || {}),
    template: current.template || null,
    mode: current.mode || "scratch",
    source: "duplicate",
    title: title || `${current.title || deriveResumeTitle(current.resume)} Copy`,
  });
};

const readTombstones = () => {
  if (typeof localStorage === "undefined") return {};
  const value = safeParse(localStorage.getItem(tombstoneKey()), {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};

const writeTombstones = (value) => safeSetItem(tombstoneKey(), value);

const addTombstone = (id, metadata = {}) => {
  if (!id) return;
  const current = readTombstones();
  current[id] = { deletedAt: now(), ...metadata };
  writeTombstones(current);
};

const removeTombstone = (id) => {
  const current = readTombstones();
  if (current[id]) {
    delete current[id];
    writeTombstones(current);
  }
};

export const deleteDraft = (id) => {
  const remaining = getDrafts().filter((draft) => draft.id !== id);
  writeDrafts(remaining);
  if (id) addTombstone(id);
  if (getCurrentDraftId() === id) setCurrentDraftId(remaining[0]?.id || null);
  return remaining;
};

export const deleteCompletedResume = (id) => {
  const current = getCompletedResumeById(id);
  const remaining = getCompletedResumes().filter((resume) => resume.id !== id);
  writeCompleted(remaining);
  if (id) addTombstone(id, current?.pdfPath ? { pdfPath: current.pdfPath } : {});
  return remaining;
};

export const completeDraft = ({ id, resume, template, title } = {}) => {
  const drafts = getDrafts();
  const draft = drafts.find((item) => item.id === id) || null;
  const completed = normalizeDocument({
    id: id || uid("resume"),
    title: title || draft?.title || deriveResumeTitle(resume),
    template: template || draft?.template || null,
    resume: resume || draft?.resume || {},
    createdAt: draft?.createdAt || now(),
    updatedAt: now(),
    completedAt: now(),
    mode: draft?.mode || "scratch",
    source: draft?.source || "export",
    revision: bumpRevision(draft?.revision, 1),
  }, "completed");

  const remaining = drafts.filter((item) => item.id !== id);
  writeDrafts(remaining);
  const existing = getCompletedResumes().filter((item) => item.id !== completed.id);
  writeCompleted([completed, ...existing]);
  if (id) removeTombstone(id); // the same row is re-used as completed
  setCurrentDraftId(remaining[0]?.id || null);
  return completed;
};

const enqueueOperation = (operation) => {
  if (!operation?.id) return;
  const key = outboxKey();
  const current = safeParse(localStorage.getItem(key), []);
  const list = Array.isArray(current) ? current : [];
  const filtered = list.filter((item) => !(item.id === operation.id && item.kind === operation.kind));
  filtered.push({ ...operation, queuedAt: operation.queuedAt || now() });
  safeSetItem(key, filtered);
};

const removeOperation = (id, kind) => {
  const current = safeParse(localStorage.getItem(outboxKey()), []);
  const filtered = Array.isArray(current) ? current.filter((item) => !(item.id === id && item.kind === kind)) : [];
  safeSetItem(outboxKey(), filtered);
};

const getQueuedOperations = () => {
  const current = safeParse(localStorage.getItem(outboxKey()), []);
  return Array.isArray(current) ? current : [];
};

const requestWithTimeout = async (url, options = {}, timeoutMs = SYNC_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const withDocumentCloudMeta = (id, kind, cloudRow) => {
  if (!cloudRow) return;
  const base = kind === "completed" ? getCompletedResumes() : getDrafts();
  const index = base.findIndex((item) => item.id === id);
  if (index < 0) return;
  const next = { ...base[index], _cloudUpdatedAt: cloudRow.updated_at || null, _cloudRevision: Number(cloudRow.revision) || 1 };
  if (kind === "completed") writeCompleted(base.map((item, i) => i === index ? next : item));
  else writeDrafts(base.map((item, i) => i === index ? next : item));
};

const fetchCloudRow = async (id, accessToken) => {
  const config = getCloudConfig();
  const headers = cloudHeaders(accessToken);
  if (!config || !headers) return null;
  const response = await requestWithTimeout(`${config.url}/rest/v1/resume_documents?id=eq.${encodeURIComponent(id)}&select=*`, { headers });
  if (!response.ok) {
    if (response.status === 404) markCloudUnavailable("schema-not-ready");
    throw new Error(`Cloud lookup failed (${response.status}).`);
  }
  const rows = await response.json();
  return rows?.[0] || null;
};

const draftToCloudRow = (draft) => ({
  id: draft.id,
  document_type: "draft",
  title: draft.title || deriveResumeTitle(draft.resume),
  template: draft.template || null,
  mode: draft.mode || "scratch",
  source: draft.source || "builder",
  resume: draft.resume || {},
  created_at: draft.createdAt || now(),
  completed_at: null,
  pdf_path: null,
  pdf_filename: null,
});

const completedToCloudRow = (item) => ({
  id: item.id,
  document_type: "completed",
  title: item.title || deriveResumeTitle(item.resume),
  template: item.template || null,
  mode: item.mode || "scratch",
  source: item.source || "export",
  resume: item.resume || {},
  created_at: item.createdAt || now(),
  completed_at: item.completedAt || now(),
  pdf_path: item.pdfPath || null,
  pdf_filename: item.pdfFilename || null,
});

const cloudRowToDraft = (row) => normalizeDocument({
  id: row.id,
  title: row.title || "Untitled Resume",
  template: row.template || null,
  mode: row.mode || "scratch",
  source: row.source || "cloud",
  resume: row.resume || {},
  createdAt: row.created_at || now(),
  updatedAt: row.updated_at || now(),
  revision: Number(row.revision) || 1,
  _cloudUpdatedAt: row.updated_at || null,
  _cloudRevision: Number(row.revision) || 1,
}, "draft");

const cloudRowToCompleted = (row) => normalizeDocument({
  id: row.id,
  title: row.title || "Untitled Resume",
  template: row.template || null,
  mode: row.mode || "scratch",
  source: row.source || "export",
  resume: row.resume || {},
  createdAt: row.created_at || now(),
  updatedAt: row.updated_at || now(),
  completedAt: row.completed_at || row.updated_at || now(),
  pdfPath: row.pdf_path || null,
  pdfFilename: row.pdf_filename || null,
  revision: Number(row.revision) || 1,
  _cloudUpdatedAt: row.updated_at || null,
  _cloudRevision: Number(row.revision) || 1,
}, "completed");

const upsertCloudRow = async (row, accessToken) => {
  const config = getCloudConfig();
  const headers = cloudHeaders(accessToken);
  if (!config || !headers) return { success: false, skipped: true };
  if (isCloudUnavailable()) return { success: false, skipped: true, reason: "cloud-unavailable" };

  const userId = getUserIdFromAccessToken(accessToken);
  if (!userId) throw new Error("Could not determine the signed-in user.");

  const kind = row.document_type === "completed" ? "completed" : "draft";
  const local = kind === "completed" ? getCompletedResumeById(row.id) : getDraftById(row.id);
  const remote = await fetchCloudRow(row.id, accessToken);
  const knownCloudUpdatedAt = local?._cloudUpdatedAt || null;
  const localUpdatedAt = local?.updatedAt || row.created_at || now();

  if (remote?.deleted_at) {
    const deletedAt = new Date(remote.deleted_at).getTime();
    if (!knownCloudUpdatedAt || deletedAt >= new Date(knownCloudUpdatedAt).getTime()) {
      throw Object.assign(new Error("Cloud document was deleted on another device."), { code: "CLOUD_DELETED" });
    }
  }

  if (!remote) {
    const response = await requestWithTimeout(`${config.url}/rest/v1/resume_documents`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ ...row, user_id: userId, updated_at: localUpdatedAt, revision: Math.max(1, Number(local?.revision || 1)), deleted_at: null }),
    });
    if (!response.ok) throw new Error(`Cloud save failed (${response.status}).`);
    const rows = await response.json();
    const saved = rows?.[0] || null;
    if (saved) withDocumentCloudMeta(row.id, kind, saved);
    removeOperation(row.id, kind);
    removeTombstone(row.id);
    return { success: true, row: saved };
  }

  const remoteUpdated = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
  const baseUpdated = knownCloudUpdatedAt ? new Date(knownCloudUpdatedAt).getTime() : 0;
  if (knownCloudUpdatedAt && remoteUpdated !== baseUpdated) {
    throw Object.assign(new Error("This resume changed on another device. Your local edits were kept; refresh the resume to review the latest cloud version."), {
      code: "CLOUD_CONFLICT",
      remote,
    });
  }
  if (!knownCloudUpdatedAt && remoteUpdated > new Date(localUpdatedAt).getTime()) {
    throw Object.assign(new Error("A newer cloud version of this resume already exists. Your local edits were kept."), { code: "CLOUD_CONFLICT", remote });
  }

  const expectedRevision = Number(remote.revision) || 1;
  const response = await requestWithTimeout(`${config.url}/rest/v1/resume_documents?id=eq.${encodeURIComponent(row.id)}&revision=eq.${expectedRevision}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      ...row,
      user_id: userId,
      updated_at: localUpdatedAt,
      deleted_at: null,
    }),
  });
  if (!response.ok) throw new Error(`Cloud conditional save failed (${response.status}).`);
  const rows = await response.json();
  if (!rows?.length) throw Object.assign(new Error("Cloud document changed during save. Please refresh before retrying."), { code: "CLOUD_CONFLICT" });
  const saved = rows[0];
  withDocumentCloudMeta(row.id, kind, saved);
  removeOperation(row.id, kind);
  removeTombstone(row.id);
  return { success: true, row: saved };
};

const serializeByKey = new Map();
const runSerialized = (key, task) => {
  const previous = serializeByKey.get(key) || Promise.resolve();
  const next = previous.catch(() => {}).then(task);
  serializeByKey.set(key, next.finally(() => {
    if (serializeByKey.get(key) === next) serializeByKey.delete(key);
  }));
  return next;
};

export const hydrateDocumentsFromCloud = async (accessToken) => {
  const config = getCloudConfig();
  const headers = cloudHeaders(accessToken);
  if (!config || !headers) return { success: false, skipped: true, reason: "cloud-not-configured" };
  if (isCloudUnavailable()) return { success: false, skipped: true, reason: "cloud-unavailable" };

  try {
    setCloudSyncState({ status: "syncing" });
    const response = await requestWithTimeout(`${config.url}/rest/v1/resume_documents?select=*&order=updated_at.desc`, { headers });
    if (!response.ok) {
      if (response.status === 404) {
        markCloudUnavailable("schema-not-ready");
        return { success: false, skipped: true, reason: "schema-not-ready" };
      }
      throw new Error(`Cloud resume sync failed (${response.status}).`);
    }

    const rows = await response.json();
    const tombstones = readTombstones();
    const localDrafts = getDrafts();
    const localCompleted = getCompletedResumes();

    const activeRemoteRows = rows.filter((row) => !row.deleted_at);
    const remoteDrafts = activeRemoteRows.filter((row) => row.document_type === "draft").map(cloudRowToDraft);
    const remoteCompleted = activeRemoteRows.filter((row) => row.document_type === "completed").map(cloudRowToCompleted);
    const remoteById = new Map(rows.map((row) => [row.id, row]));

    const mergeKind = async (localItems, remoteItems, kind) => {
      const remoteMap = new Map(remoteItems.map((item) => [item.id, item]));
      const output = [];

      for (const local of localItems) {
        if (tombstones[local.id]) continue;
        const remoteRow = remoteById.get(local.id);
        if (remoteRow?.deleted_at) {
          const deletedAt = new Date(remoteRow.deleted_at).getTime();
          const knownCloud = local._cloudUpdatedAt ? new Date(local._cloudUpdatedAt).getTime() : 0;
          const localUpdated = new Date(local.updatedAt || 0).getTime();
          if (!knownCloud || deletedAt >= Math.max(knownCloud, localUpdated)) continue;
          enqueueOperation({ id: local.id, kind, action: "upsert", document: local });
          output.push(local);
          continue;
        }
        const remote = remoteMap.get(local.id);
        if (!remote) {
          enqueueOperation({ id: local.id, kind, action: "upsert", document: local });
          output.push(local);
          continue;
        }
        const localUpdated = new Date(local.updatedAt || 0).getTime();
        const remoteUpdated = new Date(remote.updatedAt || 0).getTime();
        const knownCloudUpdated = local._cloudUpdatedAt;
        if (knownCloudUpdated && knownCloudUpdated !== remote._cloudUpdatedAt) {
          // Keep local edits and let conditional sync surface an explicit conflict.
          output.push(local);
        } else if (localUpdated > remoteUpdated) {
          enqueueOperation({ id: local.id, kind, action: "upsert", document: local });
          output.push(local);
        } else {
          output.push(remote);
        }
        remoteMap.delete(local.id);
      }

      for (const remote of remoteMap.values()) output.push(remote);
      return output;
    };

    const mergedDrafts = await mergeKind(localDrafts, remoteDrafts, "draft");
    const mergedCompleted = await mergeKind(localCompleted, remoteCompleted, "completed");
    const completedIds = new Set(mergedCompleted.map((item) => item.id));
    const dedupedDrafts = mergedDrafts.filter((item) => !completedIds.has(item.id));

    writeDrafts(dedupedDrafts.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
    writeCompleted(mergedCompleted.sort((a, b) => new Date(b.completedAt || b.updatedAt || 0) - new Date(a.completedAt || a.updatedAt || 0)));

    // Retry pending deletions after hydration so offline deletes cannot resurrect.
    const deletedIds = Object.keys(tombstones);
    for (const id of deletedIds) {
      try {
        const tombstone = tombstones[id];
        const pdfPath = typeof tombstone === "object" ? tombstone.pdfPath : null;
        if (pdfPath) await deleteCloudPdf(pdfPath, accessToken);
        await deleteCloudRow(id, accessToken);
        removeTombstone(id);
        removeOperation(id, "draft");
        removeOperation(id, "completed");
      } catch (error) {
        console.warn("[Resummetry] Pending cloud deletion still offline:", error);
      }
    }

    // Retry queued local edits one at a time per document.
    const queued = getQueuedOperations();
    for (const operation of queued) {
      const current = operation.kind === "completed" ? getCompletedResumeById(operation.id) : getDraftById(operation.id);
      if (!current || tombstones[operation.id]) continue;
      try {
        await upsertCloudRow(operation.kind === "completed" ? completedToCloudRow(current) : draftToCloudRow(current), accessToken);
      } catch (error) {
        console.warn("[Resummetry] Queued cloud operation failed:", error);
      }
    }

    const currentId = getCurrentDraftId();
    const validCurrent = currentId && dedupedDrafts.some((item) => item.id === currentId) ? currentId : dedupedDrafts[0]?.id || null;
    setCurrentDraftId(validCurrent);
    setCloudSyncState({ status: "synced", count: dedupedDrafts.length + mergedCompleted.length });
    return { success: true, drafts: dedupedDrafts, completed: mergedCompleted };
  } catch (error) {
    console.warn("[Resummetry] Cloud hydration failed; using local cache.", error);
    setCloudSyncState({ status: error?.code === "CLOUD_CONFLICT" ? "conflict" : "offline", error: error.message });
    return { success: false, error };
  }
};

const deleteCloudPdf = async (path, accessToken) => {
  if (!path || !accessToken) return { success: false, skipped: true };
  const config = getCloudConfig();
  if (!config) return { success: false, skipped: true };
  const response = await requestWithTimeout(`${config.url}/storage/v1/object/resume-pdfs/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
    method: "DELETE",
    headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok && response.status !== 404) throw new Error(`PDF delete failed (${response.status}).`);
  return { success: true };
};

const deleteCloudRow = async (id, accessToken) => {
  const config = getCloudConfig();
  const headers = cloudHeaders(accessToken);
  if (!config || !headers) return { success: false, skipped: true };
  const response = await requestWithTimeout(`${config.url}/rest/v1/resume_documents?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({ deleted_at: now(), updated_at: now() }),
  });
  if (!response.ok) throw new Error(`Cloud delete failed (${response.status}).`);
  return { success: true };
};

const syncDocument = async (document, kind, accessToken) => {
  if (!document?.id || !accessToken) return { success: false, skipped: true };
  return runSerialized(`${kind}:${document.id}`, async () => {
    try {
      enqueueOperation({ id: document.id, kind, action: "upsert", document });
      const result = await upsertCloudRow(kind === "completed" ? completedToCloudRow(document) : draftToCloudRow(document), accessToken);
      setCloudSyncState({ status: "synced" });
      return result;
    } catch (error) {
      if (String(error?.message || "").includes("(404)")) markCloudUnavailable("schema-not-ready");
      else console.warn("[Resummetry] Cloud document save failed:", error);
      setCloudSyncState({ status: error?.code === "CLOUD_CONFLICT" ? "conflict" : "offline", reason: String(error?.message || "cloud-error") });
      return { success: false, error, conflict: error?.code === "CLOUD_CONFLICT" };
    }
  });
};

export const syncDraftToCloud = (draft, accessToken) => syncDocument(draft, "draft", accessToken);
export const syncCompletedToCloud = (completed, accessToken) => syncDocument(completed, "completed", accessToken);

export const syncRenameDocumentToCloud = async (id, title, accessToken) => {
  if (!id || !title || !accessToken) return { success: false, skipped: true };
  const draft = getDraftById(id);
  const completed = getCompletedResumeById(id);
  const current = draft || completed;
  if (!current) return { success: false, skipped: true };
  return draft ? syncDraftToCloud(draft, accessToken) : syncCompletedToCloud(completed, accessToken);
};

export const syncDeleteDraftToCloud = async (id, accessToken) => {
  if (!id || !accessToken) return { success: false, skipped: true };
  return runSerialized(`delete:draft:${id}`, async () => {
    try {
      if (!readTombstones()[id]) addTombstone(id);
      enqueueOperation({ id, kind: "draft", action: "delete" });
      await deleteCloudRow(id, accessToken);
      removeTombstone(id);
      removeOperation(id, "draft");
      setCloudSyncState({ status: "synced" });
      return { success: true };
    } catch (error) {
      console.warn("[Resummetry] Draft cloud delete failed:", error);
      setCloudSyncState({ status: "offline", error: error.message });
      return { success: false, error };
    }
  });
};

export const syncDeleteCompletedToCloud = async (id, accessToken) => {
  if (!id || !accessToken) return { success: false, skipped: true };
  return runSerialized(`delete:completed:${id}`, async () => {
    try {
      if (!readTombstones()[id]) addTombstone(id);
      enqueueOperation({ id, kind: "completed", action: "delete" });
      const tombstone = readTombstones()[id];
      const pdfPath = typeof tombstone === "object" ? tombstone.pdfPath : null;
      if (pdfPath) await deleteCloudPdf(pdfPath, accessToken);
      await deleteCloudRow(id, accessToken);
      removeTombstone(id);
      removeOperation(id, "completed");
      setCloudSyncState({ status: "synced" });
      return { success: true };
    } catch (error) {
      console.warn("[Resummetry] Completed resume cloud delete failed:", error);
      setCloudSyncState({ status: "offline", error: error.message });
      return { success: false, error };
    }
  });
};

export const setCompletedPdfMetadata = (id, { pdfPath = undefined, pdfFilename = undefined, pdfDataUrl = undefined } = {}) => {
  const current = getCompletedResumeById(id);
  if (!current) return null;
  const next = normalizeDocument({
    ...current,
    ...(pdfPath !== undefined ? { pdfPath } : {}),
    ...(pdfFilename !== undefined ? { pdfFilename } : {}),
    ...(pdfDataUrl !== undefined ? { pdfDataUrl } : {}),
    updatedAt: now(),
    revision: bumpRevision(current.revision),
  }, "completed");
  writeCompleted(getCompletedResumes().map((item) => item.id === id ? next : item));
  return next;
};

export const uploadCompletedPdf = async (completed, blob, accessToken) => {
  if (!completed?.id || !blob || !accessToken) return { success: false, skipped: true };
  const config = getCloudConfig();
  if (!config) return { success: false, skipped: true, reason: "cloud-not-configured" };
  const userId = getUserIdFromAccessToken(accessToken);
  if (!userId) return { success: false, error: new Error("Could not determine the signed-in user.") };

  const path = `${userId}/${completed.id}/resume.pdf`;
  const previousPath = completed.pdfPath && completed.pdfPath !== path ? completed.pdfPath : null;
  try {
    const response = await requestWithTimeout(`${config.url}/storage/v1/object/resume-pdfs/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
      method: "POST",
      headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/pdf", "x-upsert": "true" },
      body: blob,
    });
    if (!response.ok) throw new Error(`PDF upload failed (${response.status}).`);

    const updated = setCompletedPdfMetadata(completed.id, { pdfPath: path, pdfFilename: "resume.pdf" }) || completed;
    const syncResult = await syncCompletedToCloud(updated, accessToken);
    if (!syncResult.success) {
      await deleteCloudPdf(path, accessToken).catch(() => {});
      setCompletedPdfMetadata(completed.id, { pdfPath: null, pdfFilename: null });
      throw syncResult.error || new Error("Completed resume metadata could not be saved.");
    }
    if (previousPath) await deleteCloudPdf(previousPath, accessToken).catch(() => {});
    return { success: true, path, filename: "resume.pdf", completed: updated };
  } catch (error) {
    console.warn("[Resummetry] PDF cloud upload failed:", error);
    setCloudSyncState({ status: "offline", error: error.message });
    return { success: false, error };
  }
};

export const getCompletedPdfDownloadUrl = async (completed, accessToken, expiresIn = 60) => {
  if (!completed?.pdfPath || !accessToken) return { success: false, skipped: true };
  const config = getCloudConfig();
  if (!config) return { success: false, skipped: true };
  const safeExpiresIn = Math.max(30, Math.min(600, Number(expiresIn) || 60));
  try {
    const response = await requestWithTimeout(`${config.url}/storage/v1/object/sign/resume-pdfs/${encodeURIComponent(completed.pdfPath).replace(/%2F/g, "/")}`, {
      method: "POST",
      headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: safeExpiresIn }),
    });
    if (!response.ok) throw new Error(`Signed URL failed (${response.status}).`);
    const data = await response.json();
    const signed = data?.signedURL || data?.signedUrl || data?.url;
    if (!signed) throw new Error("The storage service returned no download URL.");
    return { success: true, url: signed.startsWith("http") ? signed : `${config.url}/storage/v1${signed}` };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * Legacy data is never automatically assigned to an authenticated account.
 * The dashboard can present it to the user and call this explicit importer.
 */
export const hasLegacyResumeState = () => {
  if (typeof localStorage === "undefined") return false;
  const legacy = safeParse(localStorage.getItem(LEGACY_KEY), null);
  const drafts = safeParse(localStorage.getItem(DRAFTS_KEY), []);
  const completed = safeParse(localStorage.getItem(COMPLETED_KEY), []);
  return Boolean(legacy?.resume || (Array.isArray(drafts) && drafts.length) || (Array.isArray(completed) && completed.length));
};

export const importLegacyResumeState = () => {
  if (typeof localStorage === "undefined") return [];
  const imported = [];
  const existingIds = new Set([...getDrafts(), ...getCompletedResumes()].map((item) => item.id));
  const legacyState = safeParse(localStorage.getItem(LEGACY_KEY), null);
  const legacyDrafts = safeParse(localStorage.getItem(DRAFTS_KEY), []);
  const legacyCompleted = safeParse(localStorage.getItem(COMPLETED_KEY), []);

  const candidates = [];
  if (legacyState?.resume) candidates.push({ resume: legacyState.resume, template: legacyState.template || null, mode: legacyState.mode || "scratch", source: "legacy-import" });
  if (Array.isArray(legacyDrafts)) candidates.push(...legacyDrafts);
  if (Array.isArray(legacyCompleted)) candidates.push(...legacyCompleted);

  for (const item of candidates) {
    if (!item?.resume || (item.id && existingIds.has(item.id))) continue;
    const draft = createDraft({
      resume: structuredClone(item.resume),
      template: item.template || null,
      mode: item.mode || "scratch",
      source: "legacy-import",
      title: item.title || deriveResumeTitle(item.resume),
    });
    imported.push(draft);
    existingIds.add(draft.id);
  }

  safeRemoveItem(LEGACY_KEY);
  safeRemoveItem(DRAFTS_KEY);
  safeRemoveItem(COMPLETED_KEY);
  if (typeof localStorage !== "undefined") localStorage.setItem(LEGACY_OWNER_KEY, getActiveUserId() || "explicit-import");
  return imported;
};

// Backwards-compatible export: this no longer imports automatically.
export const migrateLegacyResumeState = () => getDrafts();

export { DRAFTS_KEY, COMPLETED_KEY, CURRENT_DRAFT_KEY, ACTIVE_USER_KEY };
