import { useEffect, useMemo, useState } from "react";
import Brand from "../../ui/Brand";
import StepSidebar from "../ui/StepSidebar";
import Form from "../form/Form";
import TemplateSelection from "./TemplateSelection";
import Preview from "../preview/Preview";

const WORKSPACE_SECTIONS = [
  { id: "template", title: "Template Design" },
  { id: "personal", title: "Personal Information" },
  { id: "summary", title: "Professional Summary" },
  { id: "experience", title: "Work Experience" },
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills" },
  { id: "coreSkills", title: "Core Skills" },
  { id: "keyAchievements", title: "Key Achievements" },
  { id: "certificates", title: "Certificates" },
  { id: "languages", title: "Languages" },
  { id: "hobbies", title: "Hobbies & Interests" },
  { id: "projects", title: "Projects" },
  { id: "additionalInformation", title: "Additional Information" },
];

const WIZARD_STORAGE_KEY = "resume-workspace-section";

const ResumeWizard = ({ resume, setResume, template, setTemplate, theme, setTheme, draftId, onBack, onNewResume, onSaveAndExit, onDeleteAndExit, saveState = "saved" }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(`${WIZARD_STORAGE_KEY}:${draftId || "new"}`);
      return saved ? Math.min(Math.max(parseInt(saved, 10), 0), WORKSPACE_SECTIONS.length - 1) : 0;
    } catch {
      return 0;
    }
  });
  const [mobilePane, setMobilePane] = useState("editor");
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(`${WIZARD_STORAGE_KEY}:${draftId || "new"}`, currentSectionIndex.toString());
  }, [currentSectionIndex, draftId]);


  const completedSteps = useMemo(() => {
    return WORKSPACE_SECTIONS.map((step) => {
      switch (step.id) {
        case "template": return Boolean(template);
        case "personal": return Boolean(resume.personal?.fullname && resume.personal?.email);
        case "summary": return Boolean(resume.summary?.trim());
        case "experience": return resume.experience?.some((e) => e.company || e.position || e.description);
        case "education": return resume.education?.some((e) => e.institution || e.degree);
        case "skills": return resume.skills?.length > 0;
        case "coreSkills": return resume.coreSkills?.length > 0;
        case "keyAchievements": return resume.keyAchievements?.length > 0;
        case "certificates": return resume.certificates?.some((c) => c.name || c.issuer);
        case "languages": return resume.languages?.some((l) => l.language || l.proficiency);
        case "hobbies": return resume.hobbies?.length > 0;
        case "projects": return resume.projects?.some((p) => p.name || p.description);
        case "additionalInformation": return resume.additionalInformation?.some((a) => a.heading || a.content || a.bullets?.length > 0);
        default: return false;
      }
    });
  }, [resume, template]);

  const activeSection = WORKSPACE_SECTIONS[Math.min(currentSectionIndex, WORKSPACE_SECTIONS.length - 1)];
  const isTemplateSection = activeSection.id === "template";
  const sectionComplete = completedSteps[currentSectionIndex];
  const contentIndex = WORKSPACE_SECTIONS.filter((step) => step.id !== "template").findIndex((step) => step.id === activeSection.id);
  const sectionNumber = isTemplateSection ? "01" : String(contentIndex + 2).padStart(2, "0");

  const goToPrevious = () => setCurrentSectionIndex((value) => Math.max(0, value - 1));
  const goToNext = () => setCurrentSectionIndex((value) => Math.min(WORKSPACE_SECTIONS.length - 1, value + 1));

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#EFEFEC] text-[#151719]">
      <header className="relative z-30 flex h-[62px] shrink-0 items-center justify-between border-b border-[#D9D9D4] bg-white px-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#087CB8]" />
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onBack} className="group flex h-8 items-center gap-2 border-r border-[#E0E0DB] pr-4 text-[11px] font-semibold text-[#60665F] hover:text-[#151719] rounded" title="Back to dashboard">
            <span className="transition-transform group-hover:-translate-x-0.5"></span> Dashboard
          </button>
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <Brand markClassName="h-7 w-7" textClassName="truncate text-[13px] font-semibold tracking-[-0.02em]" />
          </div>
          <span className="hidden h-4 w-px bg-[#E2E2DD] md:block" />
          <div className="min-w-0">
            <div className="truncate text-[12px] font-semibold text-[#222622]">{resume.personal?.fullname ? `${resume.personal.fullname}'s resume` : "Untitled resume"}</div>
            <div className="text-[9px] uppercase tracking-[0.17em] text-[#959A93]">Draft workspace</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 border-r border-[#E0E0DB] pr-3 md:flex">
            <span className={`h-1.5 w-1.5 ${saveState === "offline" ? "bg-[#C94B4B]" : saveState === "saving" ? "bg-[#B7791F]" : "bg-[#27865B]"}`} />
            <span className="text-[10px] font-medium text-[#737972]">{saveState === "saving" ? "Saving…" : saveState === "offline" ? "Offline · saved locally" : saveState === "local" ? "Saved locally" : "Saved just now"}</span>
          </div>
          <button type="button" onClick={onNewResume} className="hidden h-8 border border-[#D5D5D0] bg-white px-3 text-[10px] font-semibold text-[#5F655F] hover:bg-[#F7F7F4] sm:inline-flex rounded">New resume</button>
          <button type="button" onClick={() => setExitOpen(true)} className="h-8 bg-[#151719] px-3 text-[10px] font-semibold text-white hover:bg-[#2A2E31]">Exit</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden bg-[#F0F4F5]">
        <aside className="hidden w-[236px] shrink-0 border-r border-[#D9D9D4] lg:block">
          <StepSidebar steps={WORKSPACE_SECTIONS} currentStep={currentSectionIndex} completedSteps={completedSteps} onStepClick={setCurrentSectionIndex} />
        </aside>

        <section className={`min-h-0 shrink-0 flex-col border-r border-[#D9D9D4] bg-white lg:flex lg:w-[430px] xl:w-[455px] ${mobilePane === "editor" ? "flex w-full" : "hidden"}`}>
          <div className="border-b border-[#E1E1DC] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#959A93]">Step {sectionNumber}</div>
                <h1 className="mt-1 text-[21px] font-semibold tracking-[-0.035em] text-[#151719]">{activeSection.title}</h1>
              </div>
              <div className="text-right">
                <div className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${sectionComplete ? "text-[#27865B]" : "text-[#9B9F99]"}`}>{sectionComplete ? "Complete" : "In progress"}</div>
                {!isTemplateSection && <div className="mt-1 text-[9px] text-[#9B9F99]">{contentIndex + 1} of {WORKSPACE_SECTIONS.length - 1}</div>}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto resume-workspace-scroll">
            <div className="p-5 sm:p-6">
              {isTemplateSection ? (
                <TemplateSelection currentTemplate={template} onSelect={setTemplate} />
              ) : (
                <Form resume={resume} setResume={setResume} activeStepId={activeSection.id} hideSectionWrapper />
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-[#E1E1DC] bg-[#FBFBF9] px-5 py-3 sm:px-6">
            <button type="button" onClick={goToPrevious} disabled={currentSectionIndex === 0} className="h-8 border border-[#D5D5D0] px-3 text-[10px] font-semibold text-[#636862] hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 rounded">Previous</button>
            {currentSectionIndex < WORKSPACE_SECTIONS.length - 1 ? (
              <button type="button" onClick={goToNext} className="h-8 bg-[#151719] px-4 text-[10px] font-semibold text-white hover:bg-[#2A2E31] rounded">Next section</button>
            ) : (
              <button type="button" onClick={() => setMobilePane("preview")} className="h-8 bg-[#087CB8] px-4 text-[10px] font-semibold text-white lg:hidden">Review resume</button>
            )}
          </div>
        </section>

        <section className={`min-h-0 flex-1 flex-col bg-[#EAEAE7] ${mobilePane === "preview" ? "flex w-full" : "hidden lg:flex"}`}>
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#D7D7D2] bg-[#F7F7F4] px-4 lg:hidden">
            <button type="button" onClick={() => setMobilePane("editor")} className="text-[10px] font-semibold text-[#5D635D]">Edit content</button>
            <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#929790]">Live preview</span>
          </div>
          <div className="min-h-0 flex-1">
            <Preview resume={resume} setResume={setResume} template={template} theme={theme} setTheme={setTheme} draftId={draftId} />
          </div>
        </section>
      </div>

      {exitOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#151719]/45 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="exit-draft-title">
          <div className="w-full max-w-[500px] border border-[#D9D7D1] bg-white shadow-[0_24px_70px_rgba(21,23,25,0.22)]">
            <div className="border-b border-[#E8E6E0] px-6 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">Leaving the workspace</div>
              <h2 id="exit-draft-title" className="mt-2 text-[24px] font-semibold tracking-[-0.035em]">What should happen to this resume?</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#70756F]">Your current progress can stay available in Drafts, or you can remove this resume completely.</p>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-3">
              <button type="button" onClick={() => { setExitOpen(false); onSaveAndExit?.(); }} className="border border-[#D7D5CE] bg-white p-4 text-left transition hover:border-[#087CB8] hover:bg-[#F8FCFE]">
                <div className="text-xs font-semibold">Save as draft</div>
                <div className="mt-1.5 text-[10px] leading-4 text-[#7B807A]">Keep everything and return from Dashboard.</div>
              </button>
              <button type="button" onClick={() => { setExitOpen(false); onDeleteAndExit?.(); }} className="border border-[#E4C7C7] bg-[#FFF8F8] p-4 text-left transition hover:border-[#C94B4B] hover:bg-[#FFF1F1]">
                <div className="text-xs font-semibold text-[#B64141]">Delete resume</div>
                <div className="mt-1.5 text-[10px] leading-4 text-[#8A6666]">Remove this draft and all of its progress.</div>
              </button>
              <button type="button" onClick={() => setExitOpen(false)} className="border border-[#D7D5CE] bg-[#F8F7F4] p-4 text-left transition hover:bg-white">
                <div className="text-xs font-semibold">Cancel</div>
                <div className="mt-1.5 text-[10px] leading-4 text-[#7B807A]">Stay in the workspace and keep editing.</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeWizard;
