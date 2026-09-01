import React, {useEffect, useMemo, useRef, useState,} from "react";
import { AnimatePresence, motion,} from "framer-motion";
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, useSortable, arrayMove,} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6";
import Template7 from "./templates/Template7";
import Template8 from "./templates/Template8";
import Template9 from "./templates/Template9";
import Template10 from "./templates/Template10";
import Template11 from "./templates/Template11";
import TwoColumnDndContext from "./editor/TwoColumnDndContext";
import {updateResumeAtPath,} from "../../../utils/resumeUpdate";
import {ResumeEditorProvider,useResumeEditor,} from "./editor/ResumeEditorContext";
import SelectionToolbar from "./editor/SelectionToolbar";
import EntryEditorPanel from "./editor/EntryEditorPanel";

const PreviewSkeleton = () => (
  <div className="flex justify-center p-8">
    <div className="w-[794px] min-h-[1123px] bg-white shadow-xl p-12 animate-pulse">
      <div className="h-8 w-1/2 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-10" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-9/12" />
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-5 w-1/4 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-10/12" />
        <div className="h-3 bg-gray-200 rounded w-8/12" />
      </div>
    </div>
  </div>
);

const defaultSectionOrder = ["summary", "experience","projects","education","skills","coreSkills","keyAchievements","certificates","languages","hobbies","additionalInformation",];
const defaultLayout = {sectionOrder: defaultSectionOrder,fontFamily: "Inter",fontSize: 100,};
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_BREAK_LIMIT = PAGE_HEIGHT * 0.92;
const sectionLabels = { summary: "Summary", experience: "Experience", projects: "Projects", education: "Education", skills: "Skills", coreSkills: "Core Skills", keyAchievements: "Key Achievements", certificates: "Certificates", languages: "Languages", hobbies: "Hobbies & Interests", additionalInformation: "Additional Information",};
const normalizeLayout = (layout = {}) => {
  const savedOrder = Array.isArray(layout.sectionOrder) ? layout.sectionOrder : [];
  const validSections = savedOrder.filter((section) => defaultSectionOrder.includes(section));
  const missingSections = defaultSectionOrder.filter((section) => !validSections.includes(section));
  const normalizedFontSize = Number(layout.fontSize);
  const effectiveFontSize = Number.isFinite(normalizedFontSize) ? (normalizedFontSize === 14 ? 100 : normalizedFontSize) : defaultLayout.fontSize;
  return {...defaultLayout, ...layout, sectionOrder: [ ...validSections, ...missingSections,], sectionLayout: layout.sectionLayout, fontFamily: layout.fontFamily || defaultLayout.fontFamily, fontSize: effectiveFontSize,};
};

const estimateSectionWeight = (sectionId, resume = {}) => {
  const getTextLength = (value) => String(value ?? "").replace(/<[^>]*>/g, "").trim().length;
  switch (sectionId) {
    case "summary":
      return Math.max(180, Math.min(500, (resume.summary?.length ?? 0) * 1.8 + 180));
    case "experience": {
      const experience = Array.isArray(resume.experience) ? resume.experience : [];
      return experience.reduce((total, item) => total + 180 + (getTextLength(item.position) * 1.8) + (getTextLength(item.company) * 1.3) + (getTextLength(item.description) * 0.9) + ((item.description?.split(/\s+/).filter(Boolean).length || 0) * 1.2), 0);
    }
    case "projects": {
      const projects = Array.isArray(resume.projects) ? resume.projects : [];
      return projects.reduce((total, item) => total + 170 + (getTextLength(item.name) * 2.2) + (getTextLength(item.description) * 0.9) + (getTextLength(item.technologies) * 1.3), 0);
    }
    case "education": {
      const education = Array.isArray(resume.education) ? resume.education : [];
      return education.reduce((total, item) => total + 140 + (getTextLength(item.degree) * 2) + (getTextLength(item.institution) * 1.8) + (getTextLength(item.description) * 0.7), 0);
    }
    case "skills":
      return Math.max(70, (Array.isArray(resume.skills) ? resume.skills.length : 0) * 18 + 60);
    case "coreSkills":
      return Math.max(70, (Array.isArray(resume.coreSkills) ? resume.coreSkills.length : 0) * 18 + 60);
    case "keyAchievements":
      return Math.max(70, (Array.isArray(resume.keyAchievements) ? resume.keyAchievements.length : 0) * 20 + 60);
    case "certificates":
      return Math.max(70, (Array.isArray(resume.certificates) ? resume.certificates.length : 0) * 26 + 60);
    case "languages":
      return Math.max(70, (Array.isArray(resume.languages) ? resume.languages.length : 0) * 22 + 60);
    case "hobbies":
      return Math.max(70, (Array.isArray(resume.hobbies) ? resume.hobbies.length : 0) * 18 + 60);
    case "additionalInformation":
      return Math.max(140, (Array.isArray(resume.additionalInformation) ? resume.additionalInformation.length : 0) * 110 + 100);
    default:
      return 120;
  }
};

const buildDocumentPages = ({ sectionOrder = defaultSectionOrder, resume = {}, template }) => {
  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder.filter(Boolean) : defaultSectionOrder;
  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  orderedSections.forEach((sectionId) => {
    const weight = estimateSectionWeight(sectionId, resume, template);
    if (!weight) return;
    if (currentPage.length && currentHeight + weight > PAGE_BREAK_LIMIT) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }
    currentPage.push(sectionId);
    currentHeight += weight;
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  return pages.length ? pages : [orderedSections];
};

const TWO_COLUMN_TEMPLATES = new Set(["Professional", "Modern", "Strategic"]);
const TemplateRenderer = ({ resume, template, theme, sectionOrder, sectionLayout, onResumeChange, onSectionReorder, onSectionLayoutChange, sections,}) => {
  const orderedSections = Array.isArray(sections) && sections.length ? sections : sectionOrder;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onSectionReorder(arrayMove(sectionOrder, oldIndex, newIndex));
      }
    }
  };

  const props = { resume, theme, sectionOrder, onResumeChange };
  const inner = (() => {
    if (template === "Professional") return <Template1 {...props} />;
    if (template === "Modern") return <Template2 {...props} />;
    if (template === "Minimal") return <Template3 {...props} />;
    if (template === "Executive") return <Template4 {...props} />;
    if (template === "Corporate") return <Template5 {...props} />;
    if (template === "Strategic") return <Template6 {...props} />;
    if (template === "CleanTech") return <Template7 {...props} />;
    if (template === "Contemporary") return <Template8 {...props} />;
    if (template === "Elegant") return <Template9 {...props} />;
    if (template === "Refined") return <Template10 {...props} />;
    if (template === "Classic") return <Template11 {...props} />;
    return null;
  })();

  if (TWO_COLUMN_TEMPLATES.has(template)) {
    let defaultLeft = [];
    let defaultRight = [];
    if (template === "Professional") {
      const SIDEBAR = new Set(["education", "skills", "coreSkills", "certificates", "languages", "hobbies"]);
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects", "additionalInformation"]);
      defaultLeft = sectionOrder.filter(s => SIDEBAR.has(s));
      defaultRight = sectionOrder.filter(s => MAIN.has(s));
    } else if (template === "Modern") {
      const SIDEBAR = new Set(["education", "skills", "coreSkills", "certificates", "languages", "hobbies"]);
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects", "additionalInformation"]);
      defaultLeft = sectionOrder.filter(s => MAIN.has(s));
      defaultRight = sectionOrder.filter(s => SIDEBAR.has(s));
    } else if (template === "Strategic") {
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects", "certificates", "additionalInformation"]);
      const SIDEBAR = new Set(["skills", "coreSkills", "education", "languages", "hobbies"]);
      defaultLeft = sectionOrder.filter(s => MAIN.has(s));
      defaultRight = sectionOrder.filter(s => SIDEBAR.has(s));
    }
    const leftItems = sectionLayout?.leftColumn ?? defaultLeft;
    const rightItems = sectionLayout?.rightColumn ?? defaultRight;
    return (
      <TwoColumnDndContext leftItems={leftItems} rightItems={rightItems} onColumnsChange={(left, right) => onSectionLayoutChange({ leftColumn: left, rightColumn: right })}>{inner}</TwoColumnDndContext>
    );
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>{inner}</SortableContext>
    </DndContext>
  );
};


const SortableChip = ({id, label, index, total, onMove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : "auto", };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 pl-2 pr-1 py-1 cursor-grab active:cursor-grabbing select-none">
      <span {...attributes}{...listeners} className="text-gray-300 hover:text-gray-500 mr-0.5" title="Drag to reorder">⠿</span>
      <span className="text-[10px] font-medium text-gray-600">{label}</span>
      <button type="button" disabled={index === 0} onClick={() => onMove(id, -1)} className="w-5 h-5 rounded text-[10px] hover:bg-white disabled:opacity-30" title="Move left">←</button>
      <button type="button" disabled={index === total - 1} onClick={() => onMove(id, 1)} className="w-5 h-5 rounded text-[10px] hover:bg-white disabled:opacity-30" title="Move right">→</button>
    </div>
  );
};

const Preview = ({ resume, setResume, template,
}) => {
  const [isSwitching, setIsSwitching] =
    useState(false);
  const [isDownloading, setIsDownloading] =
    useState(false);
  const [zoom, setZoom] =
    useState(1);
  const [showGuides, setShowGuides] =
    useState(false);
  const [theme, setTheme] = useState({ primary: "#172033", secondary: "#64748b", text: "#1f2937", muted: "#64748b", border: "#e2e8f0", light: "#eef2ff", });
  const previewScrollRef =
    useRef(null);
  const sensors = useSensors(
    useSensor(
      PointerSensor,
      {
        activationConstraint: {
          distance: 5,
        },
      }
    )
  );

  const layout = useMemo(() => {
    return normalizeLayout(resume?.layout);
  }, [resume?.layout]);


  useEffect(() => {
    if (!template) {
      return;
    }
    setIsSwitching(true);
    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [template]);
  const updateLayout = (updates) => {
    if (typeof setResume !== "function") {
      return;
    }
    setResume((previous) => ({...previous, layout: { ...normalizeLayout(previous?.layout), ...updates,},}));

  };

  const handleDragEnd = (event) => {
    const {active,over} = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.sectionOrder.indexOf(active.id);
      const newIndex = layout.sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(layout.sectionOrder,oldIndex,newIndex);
      updateLayout({sectionOrder: newOrder,
      });

    }

  };

  const moveSection = (sectionId, direction) => {
    const currentOrder = [...layout.sectionOrder,];
    const currentIndex = currentOrder.indexOf(sectionId);
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= currentOrder.length) {
      return;
    }
    const updatedOrder = [...currentOrder,];
    const currentSection = updatedOrder[currentIndex];
    updatedOrder[currentIndex] = updatedOrder[nextIndex];
    updatedOrder[nextIndex] = currentSection;
    updateLayout({sectionOrder: updatedOrder,});
  };
  const updateFontFamily = (fontFamily) => {
    updateLayout({fontFamily,});
  };
  const increaseFontSize = () => {
    updateLayout({fontSize: Math.min(layout.fontSize + 5, 120),});
  };
  const decreaseFontSize = () => {
    updateLayout({fontSize: Math.max(layout.fontSize - 5, 80),});
  };
  const score = useMemo(() => {
    if (!resume) {
      return 0;
    }
    let points = 0;
    if (resume.personal?.fullname) {
      points += 10;
    }
    if (resume.personal?.email) {
      points += 10;
    }
    if (resume.personal?.phone) {
      points += 5;
    }
    if (resume.personal?.location) {
      points += 5;
    }
    if (resume.personal?.linkedin) {
      points += 5;
    }
    if (resume.summary?.length >= 80) {
      points += 15;
    }

    if (resume.experience?.length
    ) {
      points += 20;
    }
    if (
      resume.education?.length
    ) {
      points += 10;
    }
    if (
      resume.skills?.length >= 4
    ) {
      points += 10;
    }
    if (
      resume.projects?.length
    ) {
      points += 10;
    }
    return Math.min(
      points,
      100
    );
  }, [resume]);

  const zoomIn = () => {
    setZoom((value) =>
      Math.min(value + 0.1,1.3)
    );
  };

  const zoomOut = () => {
    setZoom((value) =>
      Math.max(value - 0.1, 0.4)
    );
  };

  const resetZoom = () => {

    setZoom(1);
    if (
      previewScrollRef.current
    ) {
      previewScrollRef.current.scrollTo({ left: 0, top: 0, behavior: "smooth",
      });
    }
  };

  const handleDownload = async (editorContext) => {
    if (isDownloading) return;
    setIsDownloading(true);
    if (editorContext) {
      editorContext.clearSelection();
      editorContext.setIsExporting(true);
    }
    // Wait for isExporting state to propagate (removes editor UI)
    await new Promise((r) => setTimeout(r, 120));
    try {
      // We clone the main preview container. 
      // The CSS transform: scale() is overridden inline below.
      const source = document.getElementById("resume-preview");
      if (!source) {
        throw new Error("Resume preview element was not found.");
      }
      const exportElement = source.cloneNode(true);
      // Remove all editor-only UI nodes from the clone
      exportElement.querySelectorAll("[data-pdf-ignore], .pdf-ignore").forEach((el) => el.remove());

      const printContainer = document.createElement("div");
      printContainer.id = "print-container";
      // position: fixed prevents pagination in window.print(). Using absolute allows it to span multiple pages.
      printContainer.style.cssText = "position:absolute;left:0;top:0;width:100%;background:white;z-index:999999;";
      // Set width to 100% instead of 210mm to prevent the browser from scaling it down and creating white borders
      exportElement.style.cssText = "margin:0;width:100%;transform:none !important;box-shadow:none;";
      printContainer.appendChild(exportElement);
      document.body.appendChild(printContainer);

      const style = document.createElement("style");
      style.id = "resume-print-style";
      style.innerHTML = [
        "@media print {",
        "  body > :not(#print-container) { display: none !important; }",
        "  @page { size: A4 portrait; margin: 0; }",
        "  body { margin: 0 !important; padding: 0 !important; background: white !important;",
        "    -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
        "  .resume-page { width: 100% !important; position: relative; overflow: visible !important; box-shadow: none !important; }",
        "  /* Force all templates to stretch horizontally and remove their hardcoded widths */",
        "  #resume-preview > div { width: 100% !important; max-width: none !important; min-height: 0 !important; box-shadow: none !important; }",
        "  .resume-entry-block { break-inside: avoid; page-break-inside: avoid; }",
        "  .resume-section-heading { break-after: avoid; page-break-after: avoid; }",
        "  [data-pdf-ignore], .pdf-ignore { display: none !important; }",
        "}",
      ].join("\n");
      document.head.appendChild(style);

      await new Promise((resolve) => setTimeout(resolve, 400));
      window.print();

      document.body.removeChild(printContainer);
      document.head.removeChild(style);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
      if (editorContext) {
        editorContext.setIsExporting(false);
      }
    }
  };

  return (
    <ResumeEditorProvider resume={resume} setResume={setResume}>
      <div className="w-full relative">
        <SelectionToolbar />
        <EntryEditorPanel />
        <div className="sticky top-0 z-30 mb-4">
          <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-xl shadow-lg px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Resume Studio</p>
                <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                    <motion.circle cx="20" cy="20" r="16" fill="none" stroke={theme.primary} strokeWidth="3" strokeLinecap="round" strokeDasharray="100" animate={{strokeDashoffset: 100 - score}} transition={{duration: 0.5}} pathLength="100"/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{score}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Resume Strength</p>
                  <p className="text-[10px] text-gray-400">Updates automatically</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={zoomOut} className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold">−</button>
                <button type="button" onClick={resetZoom} className="px-3 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold">{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={zoomIn} className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold">+</button>
                <PDFButton isDownloading={isDownloading} handleDownload={handleDownload} theme={theme}/>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3" data-pdf-ignore>
              <span className="text-[10px] text-gray-400">Font</span>
              <select value={layout.fontFamily} onChange={(event) => updateFontFamily(event.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-[11px] font-medium outline-none focus:border-gray-400">
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <GlobalFontSizeControls layout={layout} decreaseFontSize={decreaseFontSize} increaseFontSize={increaseFontSize}/>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[10px] text-gray-400">Theme</span>
                {[
                  { primary: "#172033", secondary: "#64748b", text: "#1f2937", muted: "#64748b", border: "#e2e8f0", light: "#eef2ff",},
                  { primary: "#4f46e5", secondary: "#6366f1", text: "#1f2937", muted: "#64748b", border: "#e5e7eb", light: "#eef2ff",},
                  { primary: "#0f766e", secondary: "#14b8a6", text: "#1f2937", muted: "#64748b", border: "#d1fae5", light: "#ecfdf5",},
                  { primary: "#9f1239", secondary: "#e11d48", text: "#1f2937", muted: "#64748b", border: "#ffe4e6", light: "#fff1f2",},
                ].map(
                  (palette, index) => (
                    <button key={index} type="button" onClick={() => setTheme(palette)} className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-gray-200 hover:scale-110 transition" style={{background:`linear-gradient(135deg,${palette.primary} 50%,${palette.secondary} 50%)`,}} aria-label={`Theme ${index + 1}`}/>
                  )
                )}
              </div>
            </div>
            

          </div>

        </div>

        <div className="relative rounded-lg border border-gray-200 bg-[#dfe3e8] overflow-hidden" style={{ minHeight: "850px",}}>
          <div className="h-11 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.secondary,}}/>
              <span className="text-[11px] font-semibold text-gray-600"> Canvas</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowGuides((value) => !value)} className="text-[10px] text-gray-400 hover:text-gray-700">{showGuides ? "Hide guides" : "Show guides"}</button>
              <span className="text-[10px] text-gray-400">A4 • 794 × 1123 px</span>
            </div>
          </div>
          <div ref={previewScrollRef} className="relative overflow-auto h-[calc(100vh-230px)] min-h-[760px]">
            <CanvasClearSelection />
            {/* Page-break guide lines — show at every A4 page boundary */}
            {showGuides && [1,2,3].map((pageNum) => (
              <div key={pageNum} className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/60 pointer-events-none z-20" data-pdf-ignore="true" style={{top: `${1123 * pageNum * zoom}px`}}>
                <span className="absolute right-3 -top-5 text-[9px] font-semibold text-red-400 bg-[#dfe3e8] px-2"> PAGE {pageNum + 1} START </span>
              </div>
            ))}
            <AnimatePresence mode="wait">
              {isSwitching ? (
                <motion.div key="skeleton" initial={{ opacity: 0,}} animate={{ opacity: 1,}} exit={{ opacity: 0,}}>
                  <PreviewSkeleton />
                </motion.div>
              ) : (
                <motion.div key={`${template}-${theme.primary}-${layout.fontFamily}-${layout.fontSize}`} initial={{ opacity: 0, y: 15, scale: 0.98,}} animate={{ opacity: 1, y: 0, scale: 1,}} transition={{ duration: 0.4, ease: [0.22,1,0.36,1,]}} style={{ transform: `scale(${zoom})`, transformOrigin: "top center", width: `${100 / zoom}%`, minHeight: `${1123 / zoom}px`,}}>
                  <div id="resume-preview" className="resume-page mx-auto" style={{ fontFamily: layout.fontFamily, fontSize: `${(16 * layout.fontSize) / 100}px`,}}>
                    <TemplateRenderer resume={resume} template={template} theme={theme} sectionOrder={layout.sectionOrder} sectionLayout={layout.sectionLayout} onResumeChange={(path, value) => setResume((current) => updateResumeAtPath(current, path, value))} onSectionReorder={(newOrder) => updateLayout({ sectionOrder: newOrder })} onSectionLayoutChange={(newLayout) => updateLayout({ sectionLayout: newLayout })}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ResumeEditorProvider>
  );
};

export default Preview;

const PDFButton = ({ isDownloading, handleDownload, theme }) => {
  const editor = (() => {
    try { return useResumeEditor(); } catch { return null; }
  })();
  return (
    <button type="button" onClick={() => handleDownload(editor)} disabled={isDownloading} className="ml-1 h-9 px-4 rounded-lg text-white text-xs font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-wait" style={{ backgroundColor: theme.primary }}>{isDownloading ? "Generating…" : "PDF"}</button>
  );
};

const GlobalFontSizeControls = ({ layout, decreaseFontSize, increaseFontSize }) => {
  const editor = (() => {
    try { return useResumeEditor(); } catch { return null; }
  })();

  const selected = editor?.selectedElement;
  const hasTextSelected = selected?.type === "text";

  const currentElementSize = hasTextSelected ? (editor.resume.layout?.elementStyles?.[selected.id]?.fontSize ?? selected.defaultFontSize ?? 14) : null;

  const handleDecrease = () => {
    if (hasTextSelected) {
      editor.updateElementStyle(selected.id, { fontSize: Math.max(6, (currentElementSize) - 1) });
    } else {
      decreaseFontSize();
    }
  };

  const handleIncrease = () => {
    if (hasTextSelected) {
      editor.updateElementStyle(selected.id, { fontSize: Math.min(72, (currentElementSize) + 1) });
    } else {
      increaseFontSize();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400">{hasTextSelected ? "Selected" : "Text"}</span>
      <button type="button" onClick={handleDecrease} className="w-8 h-8 rounded-md border border-gray-200 text-sm font-bold hover:bg-gray-50" title={hasTextSelected ? "Decrease selected element font" : "Decrease global font scale"}>A−</button>
      <span className="min-w-[42px] text-center text-[10px] font-semibold text-gray-600">{hasTextSelected ? `${currentElementSize}px` : `${layout.fontSize}%`}</span>
      <button type="button" onClick={handleIncrease} className="w-8 h-8 rounded-md border border-gray-200 text-sm font-bold hover:bg-gray-50" title={hasTextSelected ? "Increase selected element font" : "Increase global font scale"}>A+</button>
    </div>
  );
};

const CanvasClearSelection = () => {
  const editor = (() => {
    try { return useResumeEditor(); } catch { return null; }
  })();

  if (!editor?.selectedElement) return null;

  return (
    <div className="absolute inset-0 z-0" onClick={() => editor.clearSelection()} data-pdf-ignore="true"/>
  );
};

