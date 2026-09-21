import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ResumeWizard from "./builder/ResumeWizard";
import { parseCV } from "../../utils/cvParser";
import { UserAuth } from "../../context/AuthContext";
import ResumeThumbnail from "../ui/ResumeThumbnail";
import Brand from "../ui/Brand";
import LoadingScreen from "../ui/LoadingScreen";
import {
  createDraft,
  getDraftById,
  migrateLegacyResumeState,
  saveDraft,
  deleteDraft,
  setCurrentDraftId,
  hydrateDocumentsFromCloud,
  syncDraftToCloud,
  syncDeleteDraftToCloud,
  getCloudSyncState,
} from "../../utils/resumeStorage";

export const initialResume = {
  personal: { fullname: "", email: "", phone: "", location: "", linkedin: "", website: "", photo: "", title: "" },
  summary: "",
  experience: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
  education: [{ institution: "", degree: "", startDate: "", endDate: "", description: "" }],
  skills: [],
  coreSkills: [],
  keyAchievements: [],
  certificates: [],
  languages: [],
  hobbies: [],
  projects: [{ name: "", description: "", technologies: "", link: "" }],
  additionalInformation: [],
  layout: {
    sectionOrder: ["personal", "summary", "experience", "education", "skills", "coreSkills", "keyAchievements", "certificates", "languages", "hobbies", "projects", "additionalInformation"],
    fontFamily: "Inter",
    fontSize: 100,
    lineHeight: 1.5,
    sectionSpacing: 24,
    pageMargin: 40,
  },
};

const SUPPORTED_TEMPLATES = new Set(["Professional", "Modern", "Minimal", "Executive", "Corporate", "Strategic", "CleanTech", "Contemporary", "Elegant", "Refined", "Classic"]);

const TEMPLATE_FROM_QUERY = {
  modern: "Modern",
  editorial: "Elegant",
  creative: "Contemporary",
  executive: "Executive",
  tech: "CleanTech",
  minimal: "Minimal",
};

const normalizeTemplateId = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (SUPPORTED_TEMPLATES.has(raw)) return raw;
  return TEMPLATE_FROM_QUERY[raw.toLowerCase()] || null;
};

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    upload: <><path d="M12 16V4" /><path d="M7.5 8.5L12 4l4.5 4.5" /><path d="M5 15.5v4h14v-4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const BuilderStart = ({ onUpload, onTemplateCategory, uploadedFile, analyzing, uploadError, isDragging, handlers }) => (
  <main className="mx-auto max-w-[1280px] px-5 py-9 sm:px-8 lg:py-12">
    <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#DFDED9] pb-8 md:flex-row md:items-end">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">New resume</div>
        <h1 className="mt-2 text-[34px] font-semibold leading-[1.03] tracking-[-0.045em] sm:text-[46px]">How would you like to begin?</h1>
        <p className="mt-3 max-w-[680px] text-sm leading-6 text-[#70756F]">Choose your starting point. Once you begin, Resummetry saves the work as a draft so you can leave and return later.</p>
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#959A93]">Step 01 · choose your route</div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`relative flex min-h-[450px] flex-col overflow-hidden border-2 border-dashed bg-white p-7 sm:p-9 transition ${isDragging ? "border-[#087CB8] bg-[#F2FAFD]" : "border-[#D8D6D0]"}`} onDragOver={handlers.onDragOver} onDragEnter={handlers.onDragOver} onDragLeave={handlers.onDragLeave} onDrop={handlers.onDrop}>
        <div className="absolute -right-16 -top-20 h-56 w-56 bg-[#087CB8]/8 blur-3xl" />
        <div className="relative">
          <div className="mb-7 flex h-10 w-10 items-center justify-center border border-[#D8E9EF] bg-[#EAF5FA] text-[#087CB8]"><Icon name="upload" size={19} /></div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#087CB8]">Route A</div>
          <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">Upload an existing CV</h2>
          <p className="mt-2 max-w-[470px] text-sm leading-6 text-[#70756F]">Import a PDF or DOCX. Your content will be structured into an editable Resummetry draft.</p>
        </div>
        <div className="relative mt-8 flex flex-1 items-center justify-center">
          <div className="absolute h-[220px] w-[155px] -rotate-7 border border-[#DDDAD2] bg-white shadow-[0_16px_32px_rgba(21,23,25,0.08)]" />
          <div className="absolute h-[220px] w-[155px] rotate-3 border border-[#D7D4CD] bg-white shadow-[0_20px_36px_rgba(21,23,25,0.12)]" />
          <div className="relative w-[155px] bg-white p-5 shadow-[0_20px_40px_rgba(21,23,25,0.14)]">
            <div className="h-4 w-2/3 bg-[#151719]" /><div className="mt-2 h-2 w-2/5 bg-[#087CB8]" />
            <div className="mt-8 h-2.5 w-1/3 bg-[#151719]" /><div className="mt-2 h-1.5 w-full bg-[#E3E1DC]" /><div className="mt-1.5 h-1.5 w-5/6 bg-[#E3E1DC]" /><div className="mt-1.5 h-1.5 w-4/6 bg-[#E3E1DC]" />
            <div className="mt-6 h-2.5 w-2/5 bg-[#151719]" /><div className="mt-2 h-1.5 w-full bg-[#E3E1DC]" /><div className="mt-1.5 h-1.5 w-4/5 bg-[#E3E1DC]" />
          </div>
        </div>
        <div className="relative mt-7">
          {uploadedFile ? (
            <div className="border border-[#DCDAD4] bg-[#F8F7F3] p-3">
              <div className="flex items-center justify-between gap-3"><div className="min-w-0"><div className="truncate text-xs font-semibold">{uploadedFile.name}</div><div className="mt-1 text-[10px] text-[#91958E]">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div></div><button type="button" onClick={handlers.removeFile} className="text-[10px] font-semibold text-[#C94B4B] rounded">Remove</button></div>
              <button type="button" onClick={onUpload} disabled={analyzing} className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-[#087CB8] text-xs font-semibold text-white hover:bg-[#065E8C] disabled:opacity-50 rounded">{analyzing ? "Importing CV…" : "Import CV"}</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-[#DCDAD4] bg-white px-4 text-xs font-semibold hover:bg-[#F7F7F5]"><span>Browse files</span><input type="file" accept=".pdf,.docx" onChange={handlers.onFileChange} className="hidden" /></label>
              <span className="text-[10px] text-[#9A9E97]">or drag & drop · up to 10MB</span>
            </div>
          )}
          {uploadError && <p className="mt-3 text-xs font-medium text-[#C94B4B]">{uploadError}</p>}
        </div>
      </section>

      <section className="border border-[#DCDAD4] bg-white p-7 sm:p-9">
        <div className="mb-7 flex h-10 w-10 items-center justify-center border border-[#E0DDD4] bg-[#F3F0E8] text-[#8A5B35]"><Icon name="plus" size={19} /></div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A5B35]">Route B</div>
        <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">Start from scratch</h2>
        <p className="mt-2 max-w-[470px] text-sm leading-6 text-[#70756F]">Choose the visual direction first. Your template is not an afterthought anymore—it is the foundation of the document.</p>

        <div className="mt-8 border-y border-[#ECEBE5] py-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#969A93]">Browse by category</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["modern", "Modern", "Clear & contemporary", "Modern"],
              ["professional", "Professional", "Business-ready", "Professional"],
              ["elegant", "Elegant", "Editorial & refined", "Elegant"],
            ].map(([id, title, copy, preview]) => (
              <button key={id} type="button" onClick={() => onTemplateCategory(id)} className="group border border-[#E2E0DA] bg-[#F8F7F3] p-2.5 text-left hover:border-[#BFC5C5]">
                <div className="bg-[#E6E5E0] p-2"><ResumeThumbnail variant={preview} /></div>
                <div className="pt-2"><div className="text-xs font-semibold">{title}</div><div className="mt-1 text-[9px] leading-4 text-[#858A84]">{copy}</div></div>
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => onTemplateCategory("all")} className="mt-6 inline-flex h-10 items-center gap-2 bg-[#151719] px-4 text-xs font-semibold text-white hover:bg-[#2B3033]">Open template library</button>
      </section>
    </div>
  </main>
);

const Builder = () => {
  const { session, Signout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routeParams = useParams();
  const [searchParams] = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [mode, setMode] = useState(null);
  const [template, setTemplate] = useState(null);
  const [resume, setResume] = useState(initialResume);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [theme, setTheme] = useState({ primary: "#4f46e5", secondary: "#64748b", text: "#111827" });
  const [profileOpen, setProfileOpen] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const profileRef = useRef(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const hydrateAndResolve = async () => {
      if (hydratedRef.current) return;
      migrateLegacyResumeState();
      const resumeId = routeParams.draftId || searchParams.get("resumeId");
      const requestedTemplate = normalizeTemplateId(searchParams.get("template"));
      const isNewRoute = location.pathname === "/builder/new";
      const isLegacyNew = searchParams.get("new") === "1";
      const startMode = searchParams.get("start");

      // Editing can be opened directly from another device. Hydrate from the
      // authenticated cloud store before deciding that the draft is missing.
      if (resumeId && !getDraftById(resumeId) && session?.access_token) {
        await hydrateDocumentsFromCloud(session.access_token);
      }
      if (cancelled) return;

      if (isNewRoute || isLegacyNew) {
        const draft = createDraft({ resume: structuredClone(initialResume), template: requestedTemplate || null, mode: "scratch", source: requestedTemplate ? "template" : "scratch" });
        setActiveDraftId(draft.id);
        setCurrentDraftId(draft.id);
        setResume(draft.resume);
        setTemplate(draft.template);
        setMode("scratch");
        if (session?.access_token) syncDraftToCloud(draft, session.access_token);
      } else if (resumeId && getDraftById(resumeId)) {
        const draft = getDraftById(resumeId);
        setActiveDraftId(draft.id);
        setCurrentDraftId(draft.id);
        setResume(draft.resume || structuredClone(initialResume));
        setTemplate(normalizeTemplateId(draft.template));
        setMode("scratch");
      } else if (location.pathname === "/builder/edit/") {
        setMode(null);
      } else if (!startMode && location.pathname === "/builder") {
        setMode(null);
      }
      hydratedRef.current = true;
      setHydrated(true);
    };
    hydrateAndResolve();
    return () => { cancelled = true; };
  }, [searchParams, location.pathname, routeParams.draftId, session?.access_token]);

  useEffect(() => {
    if (!hydrated || !hydratedRef.current || !activeDraftId) return;
    const next = saveDraft({ id: activeDraftId, resume, template, mode: mode || "scratch", source: "builder" });
    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      if (session?.access_token && next) {
        const result = await syncDraftToCloud(next, session.access_token);
        setSaveState(result.success ? "saved" : "offline");
      } else {
        setSaveState("local");
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [resume, template, mode, activeDraftId, hydrated, session?.access_token]);

  useEffect(() => {
    const state = getCloudSyncState();
    if (state.status === "offline") setSaveState("offline");
    else if (state.status === "local") setSaveState("local");
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const email = session?.user?.email || "";
  const displayName = session?.user?.user_metadata?.username || email.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    try { await Signout(); navigate("/"); } catch (error) { console.error(error); }
  };

  const beginFreshDraft = (nextTemplate = null) => {
    const draft = createDraft({ resume: structuredClone(initialResume), template: nextTemplate, mode: "scratch", source: nextTemplate ? "template" : "scratch" });
    setCurrentDraftId(draft.id);
    navigate(`/builder/edit/${encodeURIComponent(draft.id)}`);
  };

  const handleTemplateCategory = (category) => navigate(`/templates?category=${encodeURIComponent(category)}`);

  const handleFile = (file) => {
    setUploadError("");
    if (!file) return;
    const extension = `.${String(file.name || "").split(".").pop().toLowerCase()}`;
    if (![".pdf", ".docx"].includes(extension)) return setUploadError("Please upload a PDF or DOCX file.");
    if (file.size > 10 * 1024 * 1024) return setUploadError("File size must be less than 10MB.");
    setUploadedFile(file);
  };

  const handleUseUploadedCV = async () => {
    if (!uploadedFile) return;
    try {
      setAnalyzing(true); setUploadError("");
      const extractedResume = await parseCV(uploadedFile);
      const nextResume = {
        ...structuredClone(initialResume),
        layout: resume?.layout || structuredClone(initialResume.layout),
        personal: { ...initialResume.personal, ...(extractedResume.personal || {}), photo: "" },
        summary: extractedResume.summary || "",
        experience: Array.isArray(extractedResume.experience) ? extractedResume.experience : [],
        education: Array.isArray(extractedResume.education) ? extractedResume.education : [],
        skills: Array.isArray(extractedResume.skills) ? extractedResume.skills : [],
        coreSkills: Array.isArray(extractedResume.coreSkills) ? extractedResume.coreSkills : [],
        keyAchievements: Array.isArray(extractedResume.keyAchievements) ? extractedResume.keyAchievements : [],
        certificates: Array.isArray(extractedResume.certificates) ? extractedResume.certificates : [],
        languages: Array.isArray(extractedResume.languages) ? extractedResume.languages : [],
        hobbies: Array.isArray(extractedResume.hobbies) ? extractedResume.hobbies : [],
        projects: Array.isArray(extractedResume.projects) ? extractedResume.projects : [],
        additionalInformation: Array.isArray(extractedResume.additionalInformation) ? extractedResume.additionalInformation : [],
      };
      const draft = activeDraftId ? { id: activeDraftId, resume: nextResume, template, mode: "scratch", source: "upload" } : createDraft({ resume: nextResume, template, mode: "scratch", source: "upload" });
      if (activeDraftId) saveDraft(draft);
      setActiveDraftId(draft.id); setCurrentDraftId(draft.id); setResume(nextResume); setMode("scratch");
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Something went wrong while analyzing your CV.");
    } finally { setAnalyzing(false); }
  };

  const removeFile = () => { setUploadedFile(null); setUploadError(""); };
  const saveAndExit = () => {
    if (activeDraftId) {
      const draft = saveDraft({ id: activeDraftId, resume, template, mode: "scratch", source: "builder" });
      if (session?.access_token && draft) syncDraftToCloud(draft, session.access_token);
    }
    navigate("/dashboard");
  };

  const deleteAndExit = () => {
    if (activeDraftId) {
      deleteDraft(activeDraftId);
      if (session?.access_token) syncDeleteDraftToCloud(activeDraftId, session.access_token);
    }
    setCurrentDraftId(null);
    navigate("/dashboard");
  };


  if (!hydrated) return <LoadingScreen label="Loading your workspace" />;

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#151719]">
      {mode !== "scratch" && (
        <header className="border-b border-[#E2E4E6] bg-[#F7F7F5]">
          <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-xs font-semibold text-[#626870] hover:text-[#151719]">Dashboard</button>
              <div className="h-5 w-px bg-[#DAD8D2]" />
              <Brand markClassName="h-7 w-7" textClassName="text-sm font-semibold" />
            </div>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 border border-[#DAD9D3] bg-white px-2 py-1.5 text-xs font-medium"><span className="flex h-7 w-7 items-center justify-center bg-[#151719] text-[10px] font-bold text-white">{initials}</span>{displayName}</button>
              {profileOpen && <div className="absolute right-0 top-full z-50 mt-2 w-48 border border-[#E0DED8] bg-white shadow-xl"><Link to="/profile" className="block px-4 py-3 text-xs hover:bg-[#F7F7F5]">Profile</Link><button onClick={handleSignOut} className="block w-full px-4 py-3 text-left text-xs text-[#C94B4B] hover:bg-[#FEF3F3] rounded">Sign out</button></div>}
            </div>
          </div>
        </header>
      )}

      {mode !== "scratch" ? (
        <BuilderStart
          onUpload={handleUseUploadedCV}
          onTemplateCategory={handleTemplateCategory}
          uploadedFile={uploadedFile}
          analyzing={analyzing}
          uploadError={uploadError}
          isDragging={isDragging}
          handlers={{
            onFileChange: (event) => { handleFile(event.target.files?.[0]); event.target.value = ""; },
            onDragOver: (event) => { event.preventDefault(); setIsDragging(true); },
            onDragLeave: (event) => { event.preventDefault(); setIsDragging(false); },
            onDrop: (event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0]); },
            removeFile,
          }}
        />
      ) : (
        <ResumeWizard
          resume={resume}
          setResume={setResume}
          template={template}
          setTemplate={setTemplate}
          theme={theme}
          setTheme={setTheme}
          draftId={activeDraftId}
          onBack={saveAndExit}
          onSaveAndExit={saveAndExit}
          onDeleteAndExit={deleteAndExit}
          onNewResume={() => beginFreshDraft(null)}
          saveState={saveState}
        />
      )}

    </div>
  );
};

export default Builder;
