import React, {useEffect, useMemo, useRef, useState,} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion,} from "framer-motion";
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove,} from "@dnd-kit/sortable";
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
import MultiContainerDndContext from "./editor/MultiContainerDndContext";
import {updateResumeAtPath,} from "../../../utils/resumeUpdate";
import {ResumeEditorProvider,useResumeEditor,} from "./editor/ResumeEditorContext";
import SelectionToolbar from "./editor/SelectionToolbar";
import EntryEditorPanel from "./editor/EntryEditorPanel";
import { completeDraft, uploadCompletedPdf, setCompletedPdfMetadata } from "../../../utils/resumeStorage";
import { generateResumePdf } from "../../../utils/pdfExport";
import { UserAuth } from "../../../context/AuthContext";
import { paginateResume } from "../../../utils/resumePagination";

export const PageContext = React.createContext({ pageIndex: 0, continuationSections: {} });

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

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
const normalizeLayout = (layout = {}) => {
  const hasExplicitOrder = Array.isArray(layout.sectionOrder);
  const savedOrder = hasExplicitOrder ? layout.sectionOrder : defaultSectionOrder;
  const validSections = savedOrder.filter((section) => defaultSectionOrder.includes(section));
  const missingSections = defaultSectionOrder.filter((section) => !validSections.includes(section));
  const completeOrder = [...validSections, ...missingSections];
  const normalizedFontSize = Number(layout.fontSize);
  const effectiveFontSize = Number.isFinite(normalizedFontSize) ? (normalizedFontSize === 14 ? 100 : normalizedFontSize) : defaultLayout.fontSize;
  return {...defaultLayout, ...layout, sectionOrder: completeOrder, sectionLayout: layout.sectionLayout, fontFamily: layout.fontFamily || defaultLayout.fontFamily, fontSize: effectiveFontSize,};
};

const TWO_COLUMN_TEMPLATES = new Set(["Professional", "Modern", "Strategic"]);
const TemplateRenderer = ({ resume, pageData, pageDataMeta, continuationSections, template, theme, sectionOrder, globalSectionOrder, sectionLayout, onResumeChange, onSectionReorder, onSectionLayoutChange, sections, pageIndex, isFirstPage, isContinuation, layout }) => {
  const normalizeAdditionalInfo = (items) =>
    (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      name: item?.heading ?? item?.name ?? "",
      description: item?.content ?? item?.description ?? "",
    }));

  const templateResume = useMemo(() => ({
    ...resume,
    additionalInformation: normalizeAdditionalInfo(resume?.additionalInformation),
  }), [resume]);

  const templatePageData = useMemo(() => {
    if (!pageData || !pageData.additionalInformation) return pageData;
    return { ...pageData, additionalInformation: normalizeAdditionalInfo(pageData.additionalInformation) };
  }, [pageData]);
  const handleTemplateResumeChange = (path, value) => {
    if (!Array.isArray(path)) return onResumeChange(path, value);
    const nextPath = [...path];
    const sectionId = nextPath[0];
    const pageIndexValue = nextPath[1];
    if (Number.isInteger(pageIndexValue) && pageDataMeta?.[sectionId] && pageDataMeta[sectionId][pageIndexValue] != null) {
      nextPath[1] = pageDataMeta[sectionId][pageIndexValue];
      const pageItem = pageData?.[sectionId]?.[pageIndexValue];
      if (sectionId === "experience" && nextPath[2] === "responsibilities" && Number.isInteger(pageItem?._responsibilityStartIndex)) {
        nextPath[3] = pageItem._responsibilityStartIndex + Number(nextPath[3] || 0);
      }
    }
    if (nextPath[0] === "additionalInformation" && nextPath.length >= 3) {
      if (nextPath[2] === "name") nextPath[2] = "heading";
      if (nextPath[2] === "description") nextPath[2] = "content";
    }
    return onResumeChange(nextPath, value);
  };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const globalOrder = Array.isArray(globalSectionOrder) ? globalSectionOrder : sectionOrder;
      const oldIndex = globalOrder.indexOf(active.id);
      const newIndex = globalOrder.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onSectionReorder(arrayMove(globalOrder, oldIndex, newIndex));
      }
    }
  };

  const props = { resume: templateResume, pageData: templatePageData, continuationSections, theme, sectionOrder, onResumeChange: handleTemplateResumeChange, pageIndex, isFirstPage, isContinuation, layout };
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
      const SIDEBAR = new Set(["education", "skills", "coreSkills", "certificates", "languages", "hobbies", "additionalInformation"]);
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects"]);
      defaultLeft = sectionOrder.filter(s => SIDEBAR.has(s));
      defaultRight = sectionOrder.filter(s => MAIN.has(s));
    } else if (template === "Modern") {
      const SIDEBAR = new Set(["education", "skills", "coreSkills", "certificates", "languages", "hobbies", "additionalInformation"]);
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects"]);
      defaultLeft = sectionOrder.filter(s => MAIN.has(s));
      defaultRight = sectionOrder.filter(s => SIDEBAR.has(s));
    } else if (template === "Strategic") {
      const MAIN = new Set(["summary", "experience", "keyAchievements", "projects", "certificates"]);
      const SIDEBAR = new Set(["skills", "coreSkills", "education", "languages", "hobbies", "additionalInformation"]);
      defaultLeft = sectionOrder.filter(s => MAIN.has(s));
      defaultRight = sectionOrder.filter(s => SIDEBAR.has(s));
    }
    const globalOrder = Array.isArray(globalSectionOrder) ? globalSectionOrder : sectionOrder;
    const visible = new Set(Array.isArray(sections) ? sections : sectionOrder);
    const savedLeft = Array.isArray(sectionLayout?.leftColumn) ? sectionLayout.leftColumn.filter((id) => globalOrder.includes(id) && visible.has(id)) : null;
    const savedRight = Array.isArray(sectionLayout?.rightColumn) ? sectionLayout.rightColumn.filter((id) => globalOrder.includes(id) && visible.has(id)) : null;
    const leftItems = savedLeft ?? defaultLeft.filter((id) => visible.has(id));
    const rightItems = savedRight ?? defaultRight.filter((id) => visible.has(id));
    const placed = new Set([...leftItems, ...rightItems]);
    (Array.isArray(sections) ? sections : sectionOrder).filter((id) => !placed.has(id)).forEach((id) => {
      if (defaultLeft.includes(id) && !defaultRight.includes(id)) leftItems.push(id);
      else if (defaultRight.includes(id) && !defaultLeft.includes(id)) rightItems.push(id);
      else rightItems.push(id);
    });
    return (
      <MultiContainerDndContext initialContainers={{ left: leftItems, right: rightItems }} onContainersChange={(containers) => {
        const left = containers.left || [];
        const right = containers.right || [];
        const fullLeft = Array.isArray(sectionLayout?.leftColumn) ? [...sectionLayout.leftColumn] : [...defaultLeft];
        const fullRight = Array.isArray(sectionLayout?.rightColumn) ? [...sectionLayout.rightColumn] : [...defaultRight];
        const visibleSet = new Set(Array.isArray(sections) ? sections : sectionOrder);
        const mergeVisible = (full, visibleOrder) => {
          const hidden = full.filter((id) => !visibleSet.has(id));
          return [...hidden, ...visibleOrder];
        };
        onSectionLayoutChange({ leftColumn: mergeVisible(fullLeft, left), rightColumn: mergeVisible(fullRight, right) });
      }}>{inner}</MultiContainerDndContext>
    );
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} autoScroll={false}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>{inner}</SortableContext>
    </DndContext>
  );
};


const Preview = ({ resume, setResume, template, draftId,
}) => {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const [isSwitching, setIsSwitching] =
    useState(false);
  const [isDownloading, setIsDownloading] =
    useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);

  useEffect(() => () => {
    if (pdfPreview?.url) URL.revokeObjectURL(pdfPreview.url);
  }, [pdfPreview?.url]);
  const [zoom, setZoom] =
    useState(1);
  const [showGuides, setShowGuides] =
    useState(false);
  const [theme, setTheme] = useState({ primary: "#172033", secondary: "#64748b", text: "#1f2937", muted: "#64748b", border: "#e2e8f0", light: "#eef2ff", });
  const previewScrollRef =
    useRef(null);

  const layout = useMemo(() => {
    return normalizeLayout(resume?.layout);
  }, [resume?.layout]);

  const documentPages = useMemo(() => {
    if (!resume || !template) return [];
    return paginateResume({ resume, layout, template });
  }, [resume, layout, template]);


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

  const updateFontFamily = (fontFamily) => {
    updateLayout({fontFamily,});
  };
  const increaseFontSize = () => {
    updateLayout({fontSize: Math.min(layout.fontSize + 5, 120),});
  };
  const decreaseFontSize = () => {
    updateLayout({fontSize: Math.max(layout.fontSize - 5, 80),});
  };
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
    try {
      const blob = await generateResumePdf({ resume, template, theme, layout });
      const previewUrl = URL.createObjectURL(blob);
      const filenameBase = (resume?.personal?.fullname || "resume")
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "resume";
      setPdfPreview({ blob, url: previewUrl, filename: `${filenameBase}.pdf` });
      if (editorContext) editorContext.clearSelection();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(error?.message || "Could not generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
      if (editorContext) editorContext.setIsExporting(false);
    }
  };

  const closePdfPreview = () => {
    if (pdfPreview?.url) URL.revokeObjectURL(pdfPreview.url);
    setPdfPreview(null);
  };

  const confirmPdfDownload = async () => {
    if (!pdfPreview?.blob) return;
    try {
      const completed = completeDraft({ id: draftId, template, resume });
      if (!completed) throw new Error("The resume could not be finalized.");
      const pdfDataUrl = await blobToDataUrl(pdfPreview.blob);
      const localPdfFallback = pdfDataUrl && pdfDataUrl.length <= 2500000 ? pdfDataUrl : null;
      const locallyStored = setCompletedPdfMetadata(completed.id, { pdfDataUrl: localPdfFallback, pdfFilename: pdfPreview.filename }) || completed;

      if (session?.access_token) {
        const uploadResult = await uploadCompletedPdf(locallyStored, pdfPreview.blob, session.access_token);
        if (!uploadResult.success) throw uploadResult.error || new Error("Could not save the completed resume to cloud storage.");
      }

      const url = URL.createObjectURL(pdfPreview.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfPreview.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);

      const oldUrl = pdfPreview.url;
      setPdfPreview(null);
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      navigate("/dashboard");
    } catch (error) {
      console.error("PDF finalization error:", error);
      alert(error?.message || "Could not save the completed resume.");
    }
  };
  return (
    <ResumeEditorProvider resume={resume} setResume={setResume}>
      <div className="w-full h-full flex flex-col relative bg-[#F7F7F5]">
        <SelectionToolbar />
        <EntryEditorPanel />
        
        {/* Sleek Preview Toolbar */}
        <div className="flex min-h-[52px] shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#E2E4E6] bg-white px-3 py-2 sm:px-4 z-30">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-[#626870]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs font-medium">Live Document</span>
            </div>
            <div className="w-[1px] h-4 bg-[#E2E4E6]"></div>
            <div className="flex items-center gap-1" data-pdf-ignore>
              <span className="mr-1 text-[9px] font-mono uppercase tracking-wider text-[#9BA3AE]">View</span>
              <button type="button" onClick={zoomOut} className="w-7 h-7 flex items-center justify-center border border-[#E2E4E6] bg-white hover:bg-[#F7F7F5] text-[#626870] font-medium transition-colors rounded" title="Zoom out">−</button>
              <button type="button" onClick={resetZoom} className="min-w-[48px] h-7 flex items-center justify-center border-y border-[#E2E4E6] bg-white text-[10px] text-[#626870] font-semibold transition-colors rounded" title="Reset view">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={zoomIn} className="w-7 h-7 flex items-center justify-center border border-[#E2E4E6] bg-white hover:bg-[#F7F7F5] text-[#626870] font-medium transition-colors rounded" title="Zoom in">+</button>
              <button type="button" onClick={() => setShowGuides((value) => !value)} className={`ml-2 h-7 border px-2 text-[9px] font-semibold transition-colors ${showGuides ? "border-[#C94B4B]/30 bg-[#FFF7F7] text-[#C94B4B]" : "border-[#E2E4E6] bg-white text-[#747A74] hover:bg-[#F7F7F5]"}`} title="Toggle page guides">Guides</button>
            </div>
          </div>

          <div className="flex max-w-full items-center gap-3 overflow-x-auto pb-0.5" data-pdf-ignore>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9BA3AE]">Font</span>
              <select value={layout.fontFamily} onChange={(event) => updateFontFamily(event.target.value)} className="h-7 rounded border border-[#E2E4E6] bg-white px-2 text-[10px] font-medium text-[#151719] outline-none focus:border-[#087CB8] transition-colors hover:bg-[#F7F7F5]">
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <GlobalFontSizeControls layout={layout} decreaseFontSize={decreaseFontSize} increaseFontSize={increaseFontSize}/>
            </div>
            <div className="hidden h-4 w-px bg-[#E2E4E6] lg:block"></div>
            <div className="hidden items-center gap-1.5 lg:flex">
              {[
                { primary: "#151719", secondary: "#626870", text: "#151719", muted: "#9BA3AE", border: "#E2E4E6", light: "#F7F7F5",},
                { primary: "#087CB8", secondary: "#065E8C", text: "#151719", muted: "#9BA3AE", border: "#E2E4E6", light: "#EAF5FA",},
                { primary: "#27865B", secondary: "#1E6847", text: "#151719", muted: "#9BA3AE", border: "#E2E4E6", light: "#E9F5F0",},
                { primary: "#C94B4B", secondary: "#A03A3A", text: "#151719", muted: "#9BA3AE", border: "#E2E4E6", light: "#FDF2F2",},
              ].map((palette, index) => (
                <button key={index} type="button" onClick={() => setTheme(palette)} className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-[#E2E4E6] hover:scale-110 transition-transform" style={{background:`linear-gradient(135deg,${palette.primary} 50%,${palette.secondary} 50%)`,}} aria-label={`Theme ${index + 1}`}/>
              ))}
            </div>
            <div className="w-[1px] h-4 bg-[#E2E4E6]"></div>
            <PDFButton isDownloading={isDownloading} handleDownload={handleDownload} theme={theme}/>
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={previewScrollRef} className="flex-1 overflow-auto bg-[#EEEFF1] relative p-8 pb-32">
          <CanvasClearSelection />
          {/* Page-break guide lines */}
          {showGuides && [1,2,3].map((pageNum) => (
            <div key={pageNum} className="absolute left-0 right-0 border-t border-dashed border-[#C94B4B] pointer-events-none z-20 opacity-30" data-pdf-ignore="true" style={{top: `${1123 * pageNum * zoom + 32}px`}}>
              <span className="absolute right-4 -top-4 text-[8px] font-mono font-medium text-[#C94B4B] bg-[#EEEFF1] px-1">PAGE {pageNum + 1}</span>
            </div>
          ))}
          
          <div className="resume-mobile-canvas flex justify-center min-w-max">
            <AnimatePresence mode="wait">
              {isSwitching ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PreviewSkeleton />
                </motion.div>
              ) : (
                <div className="flex flex-col gap-10" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
                  {documentPages.map((page, pageIndex) => (
                    <motion.div key={`${template}-${theme.primary}-${layout.fontFamily}-${layout.fontSize}-${pageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut", delay: pageIndex * 0.05 }} style={{ width: `${PAGE_WIDTH}px`, minHeight: `${PAGE_HEIGHT}px`, height: "fit-content", position: "relative", zIndex: 1 }} className="shrink-0 shadow-lg ring-1 ring-black/5 bg-white">
                      <div id={`resume-preview-page-${pageIndex}`} className="resume-page mx-auto w-full h-full" style={{ fontFamily: layout.fontFamily, fontSize: `${(16 * layout.fontSize) / 100}px` }}>
                        <PageContext.Provider value={{ pageIndex: page.pageIndex, continuationSections: page.continuationSections }}>
                          {/* We use cloning to pass new props without breaking the render hierarchy unnecessarily */}
                          {React.cloneElement(
                            <TemplateRenderer resume={page.resume} pageData={page.pageData} pageDataMeta={page.pageDataMeta} continuationSections={page.continuationSections} template={template} theme={theme} sectionOrder={page.sections} globalSectionOrder={layout.sectionOrder} sections={page.sections} sectionLayout={layout.sectionLayout} onResumeChange={(path, value) => setResume((current) => updateResumeAtPath(current, path, value))} onSectionReorder={(newOrder) => updateLayout({ sectionOrder: newOrder })} onSectionLayoutChange={(newLayout) => updateLayout({ sectionLayout: newLayout })}/>,
                            { pageIndex: page.pageIndex, isFirstPage: page.isFirst, isContinuation: page.isContinuation, layout }
                          )}
                        </PageContext.Provider>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {pdfPreview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#101214]/65 p-3 sm:p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Preview your PDF">
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden border border-[#D5D8D9] bg-[#F2F2EF] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#D9D9D4] bg-white px-4 py-3 sm:px-6">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">PDF preview</div>
                <div className="mt-1 text-sm font-semibold text-[#151719]">Check the final document before downloading</div>
              </div>
              <button type="button" onClick={closePdfPreview} className="h-8 border border-[#D7D7D2] bg-white px-3 text-[10px] font-semibold text-[#636862] hover:text-[#151719] rounded">Close</button>
            </div>
            <div className="min-h-0 flex-1 bg-[#DCDCD8] p-2 sm:p-4">
              <iframe src={pdfPreview.url} title="Generated resume PDF preview" className="h-full w-full bg-white" />
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#D9D9D4] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[10px] leading-4 text-[#777C76]">Your resume becomes a completed document only after you confirm the download.</p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button type="button" onClick={closePdfPreview} className="h-9 border border-[#D7D7D2] px-4 text-[10px] font-semibold text-[#636862] hover:bg-[#F7F7F4] rounded">Go back</button>
                <button type="button" onClick={confirmPdfDownload} className="h-9 bg-[#087CB8] px-5 text-[10px] font-semibold text-white hover:bg-[#065E8C] rounded">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResumeEditorProvider>
  );
};

export default Preview;

const PDFButton = ({ isDownloading, handleDownload, theme }) => {
  const editor = useResumeEditor();
  return (
    <button type="button" onClick={() => handleDownload(editor)} disabled={isDownloading} className="ml-1 h-9 px-4 rounded text-white text-xs font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-wait" style={{ backgroundColor: theme.primary }}>{isDownloading ? "Generating…" : "PDF"}</button>
  );
};

const GlobalFontSizeControls = ({ layout, decreaseFontSize, increaseFontSize }) => {
  const editor = useResumeEditor();

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
      <span className="text-[10px] text-gray-400">{hasTextSelected ? "Selected" : "Document"}</span>
      <button type="button" onClick={handleDecrease} className="w-8 h-8 rounded border border-gray-200 text-sm font-bold hover:bg-gray-50" title={hasTextSelected ? "Decrease selected text size" : "Decrease document scale"}>A−</button>
      <span className="min-w-[42px] text-center text-[10px] font-semibold text-gray-600">{hasTextSelected ? `${currentElementSize}px` : `${layout.fontSize}%`}</span>
      <button type="button" onClick={handleIncrease} className="w-8 h-8 rounded border border-gray-200 text-sm font-bold hover:bg-gray-50" title={hasTextSelected ? "Increase selected text size" : "Increase document scale"}>A+</button>
    </div>
  );
};

const CanvasClearSelection = () => {
  const editor = useResumeEditor();

  if (!editor?.selectedElement) return null;

  return (
    <div className="absolute inset-0 z-0" onClick={() => editor.clearSelection()} data-pdf-ignore="true"/>
  );
};

