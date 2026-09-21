import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserAuth } from "../context/AuthContext";
import ResumeThumbnail from "./ui/ResumeThumbnail";
import Brand from "./ui/Brand";
import {
  getDrafts,
  getCompletedResumes,
  setCurrentDraftId,
  getCurrentDraftId,
  deriveResumeTitle,
  deleteDraft,
  deleteCompletedResume,
  renameDraft,
  renameCompletedResume,
  duplicateDraft,
  duplicateCompletedResume,
  syncDraftToCloud,
  syncRenameDocumentToCloud,
  migrateLegacyResumeState,
  hasLegacyResumeState,
  importLegacyResumeState,
  hydrateDocumentsFromCloud,
  syncDeleteDraftToCloud,
  syncDeleteCompletedToCloud,
  getCompletedPdfDownloadUrl,
} from "../utils/resumeStorage";

const Icon = ({ name, size = 18, strokeWidth = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    file: <><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6" /><path d="M9 15.5h6" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.9-3.2 3.2-4.8 6.5-4.8s5.6 1.6 6.5 4.8" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    upload: <><path d="M12 16V4" /><path d="M7.5 8.5L12 4l4.5 4.5" /><path d="M5 15.5v4h14v-4" /></>,
    spark: <><path d="M12 3l1.2 4.1L17 8.5l-3.8 1.4L12 14l-1.2-4.1L7 8.5l3.8-1.4z" /><path d="M18.5 14.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z" /></>,
    check: <path d="M5 12.5l4.2 4L19 7" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v5" /><path d="M14 11v5" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className="mb-4 flex items-end justify-between gap-5">
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#959A93]">{eyebrow}</div>
      <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.035em] text-[#151719]">{title}</h2>
    </div>
    {action}
  </div>
);

const formatRelativeTime = (value) => {
  if (!value) return "Recently";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const getProgress = (resume) => {
  if (!resume) return 0;
  const checks = [
    Boolean(resume.personal?.fullname && resume.personal?.email),
    Boolean(resume.personal?.title),
    Boolean(resume.summary?.trim()),
    Array.isArray(resume.experience) && resume.experience.some((item) => item?.company || item?.position || item?.description),
    Array.isArray(resume.education) && resume.education.some((item) => item?.institution || item?.degree),
    Array.isArray(resume.skills) && resume.skills.length > 0,
    Array.isArray(resume.projects) && resume.projects.some((item) => item?.name || item?.description),
    Boolean(resume.layout?.sectionOrder?.length),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const TEMPLATE_CATEGORIES = [
  { id: "professional", label: "Professional", copy: "Traditional polish for business and client-facing roles.", accent: "#1E3A5F", preview: "Professional" },
  { id: "modern", label: "Modern", copy: "Crisp hierarchy for product, tech and contemporary roles.", accent: "#087CB8", preview: "Modern" },
  { id: "elegant", label: "Elegant", copy: "Editorial typography for creative and leadership profiles.", accent: "#8A5B35", preview: "Elegant" },
];

const Dashboard = () => {
  const { session, Signout } = UserAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [legacyAvailable, setLegacyAvailable] = useState(false);
  const [legacyImporting, setLegacyImporting] = useState(false);

  const refreshDocuments = () => {
    setDrafts(getDrafts().sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
    setCompleted(getCompletedResumes().sort((a, b) => new Date(b.completedAt || b.updatedAt || 0) - new Date(a.completedAt || a.updatedAt || 0)));
  };

  useEffect(() => {
    let cancelled = false;
    const loadDocuments = async () => {
      migrateLegacyResumeState();
      refreshDocuments();
      setLegacyAvailable(hasLegacyResumeState());
      if (session?.access_token) {
        await hydrateDocumentsFromCloud(session.access_token);
        if (!cancelled) refreshDocuments();
      }
    };
    loadDocuments();
    const onStorage = (event) => {
      if (!event.key || event.key.startsWith("resumepro-drafts:") || event.key.startsWith("resumepro-resumes:") || event.key.startsWith("resumepro-current-draft:")) refreshDocuments();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", loadDocuments);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", loadDocuments);
    };
  }, [session?.access_token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const email = session?.user?.email || "";
  const displayName = session?.user?.user_metadata?.username || email.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const currentDraftId = getCurrentDraftId();
  const currentDraft = drafts.find((draft) => draft.id === currentDraftId) || drafts[0] || null;
  const currentProgress = getProgress(currentDraft?.resume);

  const handleImportLegacy = () => {
    if (legacyImporting) return;
    setLegacyImporting(true);
    try {
      const imported = importLegacyResumeState();
      setLegacyAvailable(false);
      refreshDocuments();
      if (imported[0]?.id) setCurrentDraftId(imported[0].id);
    } finally {
      setLegacyImporting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await Signout();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const continueDraft = (draft) => {
    if (!draft?.id) return;
    setCurrentDraftId(draft.id);
    navigate(`/builder/edit/${encodeURIComponent(draft.id)}`);
  };

  const startTemplateFlow = (category) => {
    navigate(`/templates?category=${encodeURIComponent(category)}`);
  };

  const requestDelete = (kind, item) => setDeleteTarget({ kind, item });

  const requestRename = (kind, item) => {
    setRenameTarget({ kind, item });
    setNewTitle(item?.title || deriveResumeTitle(item?.resume));
  };

  const confirmRename = async () => {
    const id = renameTarget?.item?.id;
    const title = newTitle.trim();
    if (!id || !title) return;
    if (renameTarget.kind === "draft") {
      const updated = renameDraft(id, title);
      if (updated && session?.access_token) await syncDraftToCloud(updated, session.access_token);
    } else {
      const updated = renameCompletedResume(id, title);
      if (updated && session?.access_token) await syncRenameDocumentToCloud(id, title, session.access_token);
    }
    setRenameTarget(null);
    refreshDocuments();
  };

  const duplicateItem = async (kind, item) => {
    const duplicate = kind === "draft" ? duplicateDraft(item.id) : duplicateCompletedResume(item.id);
    if (!duplicate) return;
    if (session?.access_token) await syncDraftToCloud(duplicate, session.access_token);
    setCurrentDraftId(duplicate.id);
    refreshDocuments();
    navigate(`/builder/edit/${encodeURIComponent(duplicate.id)}`);
  };


  const downloadCompletedPdf = async (item) => {
    if (!item) return;
    if (item.pdfPath && session?.access_token) {
      const result = await getCompletedPdfDownloadUrl(item, session.access_token);
      if (result.success && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
        return;
      }
    }
    if (item.pdfDataUrl) {
      const link = document.createElement("a");
      link.href = item.pdfDataUrl;
      link.download = item.pdfFilename || `${(item.title || "resume").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }
    if (item.resume) {
      alert("This completed resume was created before PDF storage was enabled. Open an edit copy and export it once to create a downloadable PDF.");
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget?.item?.id) return;
    const id = deleteTarget.item.id;
    if (deleteTarget.kind === "draft") {
      deleteDraft(id);
      if (session?.access_token) syncDeleteDraftToCloud(id, session.access_token);
    }
    if (deleteTarget.kind === "completed") {
      deleteCompletedResume(id);
      if (session?.access_token) syncDeleteCompletedToCloud(id, session.access_token);
    }
    if (getCurrentDraftId() === id) setCurrentDraftId(null);
    setDeleteTarget(null);
    refreshDocuments();
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#151719] font-sans">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[#DFDED9] bg-[#F8F7F3]">
          <div className="px-6 pt-7 pb-6">
            <div>
              <Brand markClassName="h-8 w-8" textClassName="text-[14px] font-semibold tracking-[-0.02em]" />
              <div className="ml-[42px] mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#92968E]">Career workspace</div>
            </div>
          </div>
          <nav className="px-3">
            <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9C95]">Workspace</div>
            <Link to="/dashboard" className="mb-1 flex items-center gap-3 border-l-2 border-[#087CB8] bg-white px-3 py-2.5 text-[13px] font-semibold rounded"> <Icon name="grid" size={17} /> Dashboard </Link>
            <Link to="/templates" className="mb-1 flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-[13px] text-[#626870] transition hover:bg-white hover:text-[#151719] rounded"><Icon name="file" size={17} /> Templates</Link>
            <Link to="/builder" className="mb-1 flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-[13px] text-[#626870] transition hover:bg-white hover:text-[#151719] rounded"><Icon name="file" size={17} /> Resume builder</Link>
            <Link to="/profile" className="mb-1 flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-[13px] text-[#626870] transition hover:bg-white hover:text-[#151719] rounded"><Icon name="user" size={17} /> Profile</Link>
          </nav>
          <div className="mt-auto border-t border-[#DFDED9] px-4 py-5 text-[11px] leading-5 text-[#70756F]">
            <div className="mb-2 flex items-center gap-2 text-[#151719] font-semibold"><Icon name="spark" size={15} /> Resummetry tip</div>
            Complete a draft and export it once you're happy. Completed PDFs move automatically to <span className="font-semibold text-[#151719]">Your resumes</span>.
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-[#DFDED9] bg-[#F4F3EF]/95 backdrop-blur">
            <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between px-5 sm:px-8 xl:px-10">
              <div className="lg:hidden"><Brand markClassName="h-8 w-8" textClassName="font-semibold text-sm" /></div>
              <div className="hidden lg:block text-[11px] font-mono uppercase tracking-[0.12em] text-[#969A93]">Dashboard / Workspace</div>
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2.5 rounded border border-[#DAD9D3] bg-white px-2 py-1.5 text-left">
                  <div className="flex h-7 w-7 items-center justify-center bg-[#151719] text-[10px] font-bold text-white">{initials}</div>
                  <span className="hidden sm:block text-[12px] font-medium">{displayName}</span>
                  
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded border border-[#E0DED8] bg-white shadow-[0_18px_38px_rgba(21,23,25,0.12)]">
                    <div className="border-b border-[#ECEBE5] px-4 py-3">
                      <div className="text-xs font-semibold truncate">{displayName}</div>
                      <div className="mt-1 text-[11px] text-[#91958E] truncate">{email}</div>
                    </div>
                    <Link to="/profile" className="block rounded px-4 py-3 text-xs text-[#626870] hover:bg-[#F7F7F5] rounded">Profile & account</Link>
                    <button onClick={handleSignOut} className="block w-full rounded px-4 py-3 text-left text-xs text-[#C94B4B] hover:bg-[#FEF3F3] rounded">Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 xl:px-10 xl:py-10">
        <div className="mb-7 grid grid-cols-1 overflow-hidden rounded border border-[#DADDE0] bg-white sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="border-l-4 border-[#087CB8] bg-[#F3FAFD] px-5 py-4">
            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#087CB8]">Resume workspace</div>
            <div className="mt-1 text-sm font-semibold text-[#151719]">Build a version worth sending.</div>
          </div>
          <div className="hidden border-l border-[#E2E4E6] px-5 py-4 sm:block"><div className="text-[9px] uppercase tracking-[0.14em] text-[#8B918A]">Drafts</div><div className="mt-1 text-lg font-semibold text-[#151719]">{drafts.length}</div></div>
          <div className="hidden border-l border-[#E2E4E6] bg-[#FBF8F2] px-5 py-4 sm:block"><div className="text-[9px] uppercase tracking-[0.14em] text-[#8A5B35]">Completed</div><div className="mt-1 text-lg font-semibold text-[#151719]">{completed.length}</div></div>
          <Link to="/templates" className="flex items-center border-l border-[#E2E4E6] px-5 text-[10px] font-semibold text-[#087CB8] hover:bg-[#F7FBFD] rounded">Browse templates</Link>
        </div>
            <section className="border-b border-[#DFDED9] pb-8">
              <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">Your career workspace</div>
                  <h1 className="mt-2 text-[34px] font-semibold leading-[1.03] tracking-[-0.045em] sm:text-[44px]">{greeting}, {displayName}.</h1>
                  <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[#70756F]">Pick up a draft, revisit a finished resume, or explore a new template. Everything you create lives here.</p>
                </div>
                <Link to="/builder" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-[#151719] px-5 text-[12px] font-semibold text-white transition hover:bg-[#2B3033] rounded"><Icon name="plus" size={15} /> New resume</Link>
              </div>
            </section>

            {legacyAvailable && (
              <div className="mb-7 rounded border border-[#D8EAF2] bg-[#F3FAFD] px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#087CB8]">Resume data found on this device</div>
                    <p className="mt-1 text-xs leading-5 text-[#5E6A72]">Older Resummetry data is available locally. It will not be assigned to this account automatically.</p>
                  </div>
                  <button type="button" onClick={handleImportLegacy} disabled={legacyImporting} className="shrink-0 rounded bg-[#151719] px-4 py-2.5 text-[11px] font-semibold text-white disabled:opacity-60">{legacyImporting ? "Importing…" : "Import into this account"}</button>
                </div>
              </div>
            )}

            <section className="mt-8">
              <SectionHeading eyebrow="Continue where you left off" title="Current resume" />
              {currentDraft ? (
                <div className="grid overflow-hidden rounded border border-[#DCDAD4] bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                  <div className="relative bg-[#E8E7E2] p-5 sm:p-8">
                    <div className="absolute left-5 top-5 z-10 bg-[#151719] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-white">Draft in progress</div>
                    <div className="mx-auto max-w-[320px] shadow-[0_20px_45px_rgba(21,23,25,0.18)]">
                      <ResumeThumbnail variant={currentDraft.template || "modern"} />
                    </div>
                  </div>
                  <div className="flex flex-col p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#969A93]">{currentDraft.template || "No template yet"}</div>
                        <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.04em]">{deriveResumeTitle(currentDraft.resume)}</h2>
                        <p className="mt-1 text-xs text-[#7B807A]">Last edited {formatRelativeTime(currentDraft.updatedAt)}</p>
                      </div>
                      <button onClick={() => navigate(`/builder/edit/${encodeURIComponent(currentDraft.id)}`)} className="text-[#91958E] hover:text-[#151719]" aria-label="Open resume"><Icon name="more" /></button>
                    </div>
                    <div className="mt-7 border-y border-[#ECEBE5] py-4">
                      <div className="flex items-center justify-between text-xs"><span className="text-[#6E736D]">Resume readiness</span><span className="font-semibold">{currentProgress}%</span></div>
                      <div className="mt-2 h-1.5 bg-[#ECEBE5]"><div className="h-full bg-[#087CB8] transition-all" style={{ width: `${Math.max(4, currentProgress)}%` }} /></div>
                      <div className="mt-2 text-[10px] text-[#999D97]">Your work is saved automatically as you edit.</div>
                    </div>
                    <div className="mt-auto pt-7">
                      <button onClick={() => continueDraft(currentDraft)} className="flex w-full items-center justify-between rounded bg-[#151719] px-4 py-3.5 text-xs font-semibold text-white hover:bg-[#2B3033]">Continue editing</button>
                      <button onClick={() => navigate(`/builder/edit/${encodeURIComponent(currentDraft.id)}`)} className="mt-2 w-full rounded border border-[#DCDAD4] px-4 py-3 text-xs font-medium text-[#626870] hover:bg-[#F7F7F5]">Open draft</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid rounded border border-[#DCDAD4] bg-white lg:grid-cols-[1fr_370px]">
                  <div className="relative overflow-hidden bg-[#F8F7F3] px-7 py-10 sm:px-10 md:py-14">
                    <div className="absolute -right-16 -top-24 h-72 w-72 bg-[#087CB8]/8 blur-3xl" />
                    <div className="relative flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
                      <div className="relative w-[160px] shrink-0">
                        <div className="absolute left-2 top-3 h-[215px] w-[150px] -rotate-6 border border-[#D7D5CF] bg-white" />
                        <div className="absolute left-4 top-1 h-[215px] w-[150px] rotate-3 border border-[#D3D1CB] bg-white" />
                        <div className="relative h-[215px] w-[150px] border border-[#CBC8C0] bg-white p-4 shadow-[0_16px_30px_rgba(21,23,25,0.12)]">
                          <div className="h-3 w-[58%] bg-[#151719]" /><div className="mt-2 h-1.5 w-[38%] bg-[#087CB8]" />
                          <div className="mt-7 h-2 w-[32%] bg-[#151719]" /><div className="mt-2 h-1 w-full bg-[#E0DED8]" /><div className="mt-1.5 h-1 w-[88%] bg-[#E0DED8]" /><div className="mt-1.5 h-1 w-[72%] bg-[#E0DED8]" />
                          <div className="mt-6 h-2 w-[28%] bg-[#151719]" /><div className="mt-2 h-1 w-full bg-[#E0DED8]" /><div className="mt-1.5 h-1 w-[82%] bg-[#E0DED8]" />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">No unfinished resume</div>
                        <h2 className="mt-3 max-w-[570px] text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[38px]">Start creating something worth sending.</h2>
                        <p className="mt-4 max-w-[580px] text-[13px] leading-6 text-[#70756F]">Choose a design, upload your existing CV, or start with a clean page. Once you leave, your unfinished work will appear here automatically.</p>
                        <Link to="/builder" className="mt-6 inline-flex items-center gap-2 bg-[#151719] px-4 py-3 text-xs font-semibold text-white hover:bg-[#2B3033] rounded">Start a resume</Link>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-[#DCDAD4] bg-white p-7 sm:p-8">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#969A93]">Ways to begin</div>
                    <div className="mt-5 space-y-4">
                      <button onClick={() => navigate("/builder?start=upload")} className="group rounded flex w-full items-start gap-3 border-b border-[#ECEBE5] pb-4 text-left"><span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#EAF5FA] text-[#087CB8]"><Icon name="upload" size={15} /></span><span><span className="block text-xs font-semibold">Upload an existing CV</span><span className="mt-1 block text-[11px] leading-5 text-[#7A7F79]">Bring your experience in and edit it inside Resummetry.</span></span></button>
                      <button onClick={() => navigate("/templates")} className="group rounded flex w-full items-start gap-3 border-b border-[#ECEBE5] pb-4 text-left"><span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#F3F0E8] text-[#8A5B35]"><Icon name="file" size={15} /></span><span><span className="block text-xs font-semibold">Browse templates</span><span className="mt-1 block text-[11px] leading-5 text-[#7A7F79]">Pick the visual direction before you start filling anything in.</span></span></button>
                      <button onClick={() => navigate("/builder?start=scratch")} className="group rounded flex w-full items-start gap-3 text-left"><span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#F1F1EE] text-[#151719]"><Icon name="plus" size={15} /></span><span><span className="block text-xs font-semibold">Start from scratch</span><span className="mt-1 block text-[11px] leading-5 text-[#7A7F79]">Build a new resume one section at a time.</span></span></button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="mt-10">
              <SectionHeading eyebrow="Keep working" title={`Drafts (${drafts.length})`} />
              {drafts.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {drafts.map((draft, index) => {
                    const progress = getProgress(draft.resume);
                    return (
                      <motion.div key={draft.id} whileHover={{ y: -3 }} transition={{ duration: 0.18 }} className={`group relative grid grid-cols-[104px_1fr] border bg-white text-left ${index === 0 ? "border-[#087CB8]" : "border-[#DCDAD4]"}`}>
                        <div role="button" tabIndex={0} onClick={() => continueDraft(draft)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && continueDraft(draft)} className="contents text-left cursor-pointer" aria-label={`Continue ${deriveResumeTitle(draft.resume)}`}>
                          <div className="border-r border-[#ECEBE5] bg-[#E9E8E3] p-3"><ResumeThumbnail variant={draft.template || "modern"} /></div>
                          <div className="flex min-w-0 flex-col p-4">
                            <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#969A93]">Draft · {draft.template || "Unstyled"}</div>
                            <div className="mt-2 truncate text-sm font-semibold">{deriveResumeTitle(draft.resume)}</div>
                            <div className="mt-1 text-[10px] text-[#91958E]">Edited {formatRelativeTime(draft.updatedAt)}</div>
                            <div className="mt-auto pt-4"><div className="flex items-center justify-between gap-2 text-[10px] text-[#7F847E]"><span>{progress}% complete</span><span>Continue</span></div><div className="mt-1.5 h-1 bg-[#EAE8E2]"><div className="h-full bg-[#151719]" style={{ width: `${Math.max(3, progress)}%` }} /></div><div className="mt-3 flex items-center gap-3 text-[10px]"><button type="button" onClick={(event) => { event.stopPropagation(); requestRename("draft", draft); }} className="font-semibold text-[#626870] hover:text-[#151719]">Rename</button><button type="button" onClick={(event) => { event.stopPropagation(); duplicateItem("draft", draft); }} className="font-semibold text-[#626870] hover:text-[#151719]">Duplicate</button></div></div>
                          </div>
                        </div>
                        <button type="button" onClick={(event) => { event.stopPropagation(); requestDelete("draft", draft); }} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-[#E0DED8] bg-white text-[#8A8F88] opacity-0 transition group-hover:opacity-100 hover:border-[#E2BABA] hover:bg-[#FFF5F5] hover:text-[#B64141]" title="Delete draft" aria-label="Delete draft"><Icon name="trash" size={13} /></button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : <div className="rounded border border-dashed border-[#D5D2CA] bg-[#F8F7F3] px-6 py-8 text-sm text-[#7A7F79]">No drafts yet. Start a resume and it will appear here until you export it.</div>}
            </section>

            <section className="mt-10">
              <SectionHeading eyebrow="Finished work" title={`Your resumes (${completed.length})`} action={completed.length ? <span className="text-[10px] text-[#969A93]">Exported resumes stay here</span> : null} />
              {completed.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {completed.map((item) => (
                    <div key={item.id} className="rounded border border-[#DCDAD4] bg-white">
                      <div className="flex gap-4 bg-[#F8F7F3] p-4">
                        <div className="w-[92px] shrink-0 shadow-[0_8px_20px_rgba(21,23,25,0.12)]"><ResumeThumbnail variant={item.template || "modern"} /></div>
                        <div className="min-w-0 pt-1"><div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#969A93]">Completed · {item.template || "Resume"}</div><div className="mt-2 truncate text-sm font-semibold">{item.title || deriveResumeTitle(item.resume)}</div><div className="mt-1 text-[10px] text-[#91958E]">Exported {formatRelativeTime(item.completedAt)}</div></div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECEBE5] px-4 py-3"><span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#27865B]"><Icon name="check" size={13} /> PDF completed</span><div className="flex items-center gap-2"><button onClick={() => downloadCompletedPdf(item)} className="text-[10px] font-semibold text-[#087CB8] hover:underline">Download</button><button onClick={() => duplicateItem("completed", item)} className="text-[10px] font-semibold text-[#626870] hover:text-[#151719]">Duplicate</button><button onClick={() => requestRename("completed", item)} className="text-[10px] font-semibold text-[#626870] hover:text-[#151719]">Rename</button><button onClick={() => duplicateItem("completed", item)} className="text-[10px] font-semibold text-[#087CB8] hover:underline">Edit copy</button><button onClick={() => requestDelete("completed", item)} className="inline-flex h-7 w-7 items-center justify-center border border-[#E0DED8] text-[#8A8F88] hover:border-[#E2BABA] hover:bg-[#FFF5F5] hover:text-[#B64141]" title="Delete resume" aria-label="Delete completed resume"><Icon name="trash" size={13} /></button></div></div>
                    </div>
                  ))}
                </div>
              ) : <div className="rounded border border-dashed border-[#D5D2CA] bg-[#F8F7F3] px-6 py-8 text-sm text-[#7A7F79]">Completed resumes will appear here after you export a finished draft as a PDF.</div>}
            </section>

            <section className="mt-12 border-t border-[#DFDED9] pt-9">
              <SectionHeading eyebrow="Explore" title="Templates to try" action={<Link to="/templates" className="text-xs font-semibold text-[#087CB8] hover:underline rounded">Open template library</Link>} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {TEMPLATE_CATEGORIES.map((category) => (
                  <button key={category.id} onClick={() => startTemplateFlow(category.id)} className="group rounded border border-[#DCDAD4] bg-white text-left transition hover:-translate-y-1 hover:border-[#BFC4C4]">
                    <div className="grid grid-cols-[98px_1fr] overflow-hidden">
                      <div className="bg-[#E9E8E3] p-3"><ResumeThumbnail variant={category.preview} /></div>
                      <div className="p-5"><div className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: category.accent }}>Template direction</div><h3 className="mt-2 text-[17px] font-semibold tracking-[-0.025em]">{category.label}</h3><p className="mt-1.5 text-[11px] leading-5 text-[#777C76]">{category.copy}</p><div className="mt-4 text-[10px] font-semibold text-[#151719]">Browse this category</div></div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {renameTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#151719]/45 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="rename-title">
          <div className="w-full max-w-[440px] rounded border border-[#D9D7D1] bg-white shadow-[0_24px_70px_rgba(21,23,25,0.22)]">
            <div className="border-b border-[#E8E6E0] px-6 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">Rename resume</div>
              <h2 id="rename-title" className="mt-2 text-[23px] font-semibold tracking-[-0.035em]">Give this document a useful name.</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#70756F]">Use a role, company, or purpose so it is easy to find later.</p>
            </div>
            <div className="p-6">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858A84]">Document name</label>
              <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenameTarget(null); }} className="mt-2 h-11 w-full border border-[#D7D5CE] bg-[#FBFBF9] px-3 text-sm outline-none focus:border-[#087CB8]" maxLength={80} />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[#E8E6E0] px-6 py-5">
              <button type="button" onClick={() => setRenameTarget(null)} className="rounded border border-[#D7D5CE] bg-white px-4 py-2.5 text-xs font-semibold text-[#626870] hover:bg-[#F7F7F5]">Cancel</button>
              <button type="button" onClick={confirmRename} disabled={!newTitle.trim()} className="bg-[#151719] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#2B3033] disabled:opacity-40 rounded">Save name</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#151719]/45 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="w-full max-w-[440px] rounded border border-[#D9D7D1] bg-white shadow-[0_24px_70px_rgba(21,23,25,0.22)]">
            <div className="border-b border-[#E8E6E0] px-6 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B64141]">Delete {deleteTarget.kind === "draft" ? "draft" : "completed resume"}</div>
              <h2 id="delete-title" className="mt-2 text-[23px] font-semibold tracking-[-0.035em]">Are you sure?</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#70756F]">This will permanently remove <span className="font-semibold text-[#151719]">{deleteTarget.item?.title || deriveResumeTitle(deleteTarget.item?.resume)}</span> from your Resummetry workspace.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded border border-[#D7D5CE] bg-white px-4 py-2.5 text-xs font-semibold text-[#626870] hover:bg-[#F7F7F5]">Cancel</button>
              <button type="button" onClick={confirmDelete} className="rounded bg-[#B64141] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#983838] rounded">Delete permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
