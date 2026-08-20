import React, { useEffect,useMemo,useRef,useState, } from "react";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";

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
      <div className="mt-12 space-y-4">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-9/12" />
      </div>
    </div>
  </div>
);
const TemplateRenderer = ({ resume, template, theme }) => {
  if (template === "Professional") {
    return <Template1 resume={resume} theme={theme} />;
  }
  if (template === "Modern") {
    return <Template2 resume={resume} theme={theme} />;
  }
  if (template === "Minimal") {
    return <Template3 resume={resume} theme={theme} />;
  }
  return null;
};

const Preview = ({ resume, template }) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.72);
  const [showGuides, setShowGuides] = useState(true);
  const [theme, setTheme] = useState({primary: "#172033",secondary: "#64748b",text: "#1f2937",muted: "#64748b",border: "#e2e8f0",light: "#eef2ff",
  });

  const previewScrollRef = useRef(null);

  useEffect(() => {
    if (!template) return;
    setIsSwitching(true);
    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [template]);

  const score = useMemo(() => {
    if (!resume) return 0;
    let points = 0;
    if (resume.personal?.fullname) points += 10;
    if (resume.personal?.email) points += 10;
    if (resume.personal?.phone) points += 5;
    if (resume.personal?.location) points += 5;
    if (resume.personal?.linkedin) points += 5;
    if (resume.summary?.length >= 80) points += 15;
    if (resume.experience?.length) points += 20;
    if (resume.education?.length) points += 10;
    if (resume.skills?.length >= 4) points += 10;
    if (resume.projects?.length) points += 10;
    return Math.min(points, 100);
  }, [resume]);

  const zoomIn = () => {
    setZoom((value) => Math.min(value + 0.1, 1.3));
  };
  const zoomOut = () => {
    setZoom((value) => Math.max(value - 0.1, 0.4));
  };
  const resetZoom = () => {
    setZoom(0.72);
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTo({left: 0,top: 0,behavior: "smooth",});
    }
  };


  const waitForImages = async (element) => {
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
        })
      })
    )
  }

  const sanitizeStyles = (root) => {
    const allElements = [root,...root.querySelectorAll("*"),];
    const unsafe = (value) => value &&
      (value.includes("oklch(") || value.includes("oklab(") || value.includes("color-mix("))
    allElements.forEach((el) => {
      const computed = window.getComputedStyle(el)
      const properties = ["color","backgroundColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor","textDecorationColor","fill","stroke",]
      properties.forEach((property) => {
        const value = computed[property];
        if (unsafe(value)) {
          if (
            property === "backgroundColor"
          ) {
            el.style.backgroundColor = "#ffffff";
          } else if (
            property === "color"
          ) {
            el.style.color = "#1f2937";
          } else if (
            property === "fill"
          ) {
            el.style.fill = "#1f2937";
          } else if (
            property === "stroke"
          ) {
            el.style.stroke = "#1f2937";
          } else {
            el.style[property] = "#e5e7eb";
          }
        } else if (value) {
          el.style[property] = value;
        }
      });
    });
  };
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    let exportElement = null;
    try {
      const source = document.getElementById("resume-preview")
      if (!source) {
        throw new Error("Resume preview element was not found.")
      }
      exportElement = source.cloneNode(true);
      exportElement.querySelectorAll("[data-pdf-ignore], .pdf-ignore").forEach((el) => el.remove());
      exportElement.style.position = "fixed"
      exportElement.style.left = "-100000px";
      exportElement.style.top = "0"
      exportElement.style.margin = "0"
      exportElement.style.padding = "0"
      exportElement.style.width = "794px"
      exportElement.style.minWidth = "794px"
      exportElement.style.maxWidth = "794px"
      exportElement.style.height = "auto"
      exportElement.style.minHeight = "1123px"
      exportElement.style.background = "#ffffff"
      exportElement.style.backgroundColor = "#ffffff"
      exportElement.style.transform = "none"
      exportElement.style.transformOrigin = "top left"
      exportElement.style.overflow = "visible"
      exportElement.style.boxShadow = "none"

      exportElement.querySelectorAll("*").forEach((el) => {
          el.style.animation = "none"
          el.style.transition = "none"
          el.style.transform = el.style.transform || ""
        })

      document.body.appendChild(exportElement)
      await waitForImages(exportElement)
      sanitizeStyles(exportElement);
      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      )
      const canvas = await html2canvas(
        exportElement,{scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff", logging: false, imageTimeout: 20000, removeContainer: true, foreignObjectRendering: false, width: exportElement.scrollWidth, height: exportElement.scrollHeight, windowWidth: 794,});
      exportElement.remove();
      exportElement = null;
      if (!canvas.width || !canvas.height) {
        throw new Error("The resume image could not be generated.")
      }

      const pdf = new jsPDF({orientation: "portrait",unit: "mm",format: "a4",compress: true,})
      const pageWidth = 210
      const pageHeight = 297
      const pxPerMm = canvas.width / pageWidth
      const pageHeightPx = pageHeight * pxPerMm
      const totalPages = Math.ceil(canvas.height / pageHeightPx)
      for (
        let page = 0;
        page < totalPages;
        page++
      ) {
        if (page > 0) {
          pdf.addPage();
        }
        const sourceY = page * pageHeightPx;
        const remainingHeight = canvas.height - sourceY;
        const sliceHeight = Math.min(pageHeightPx,remainingHeight)
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sliceHeight)
        const context = pageCanvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0,0,pageCanvas.width,pageCanvas.height)
        context.drawImage(canvas,0,sourceY,canvas.width,sliceHeight,0,0,canvas.width,sliceHeight)
        const pageImage = pageCanvas.toDataURL("image/jpeg",0.95)
        const imageHeight = (sliceHeight / pxPerMm)
        pdf.addImage(pageImage,"JPEG",0,0,pageWidth,imageHeight,undefined,"FAST")
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("PDF generation error:",error)
      if (exportElement) {
        exportElement.remove();
      }
      alert("Could not generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-30 mb-4">
        <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-xl shadow-lg px-4 py-3">
          <div className=" flex items-center justify-between gap-4">
            <div>
              <p className=" text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Resume Studio</p>
              <h2 className=" text-lg font-bold text-gray-900">Live Preview</h2>
            </div>
          
            <div className="hidden sm:flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                  <motion.circle cx="20" cy="20" r="16" fill="none" stroke={theme.primary} strokeWidth="3" strokeLinecap="round" strokeDasharray="100" animate={{ strokeDashoffset: 100 - score,}} transition={{ duration: 0.5,}} pathLength="100"/>
                </svg>
                <span className=" absolute inset-0 flex items-center justify-center text-[10px] font-bold">{score}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Resume Strength</p>
                <p className="text-[10px] text-gray-400">Updates automatically</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={zoomOut} className="w-9h-9rounded-lgborder border-gray-200 hover:bg-gray-50 font-semibold">−</button>
              <button type="button" onClick={resetZoom} className=" px-3 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={zoomIn} className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold">+</button>
              <button type="button" onClick={handleDownload} disabled={isDownloading} className="ml-1 h-9 px-4 rounded-lg text-white text-xs font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-wait"style={{ backgroundColor: theme.primary,}}>{isDownloading ? "Generating..." : "PDF"}</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 mr-1">Theme</span>
            {[
              {primary: "#172033",secondary: "#64748b",text: "#1f2937",border: "#e2e8f0",light: "#eef2ff",},
              {primary: "#4f46e5",secondary: "#6366f1",text: "#1f2937",border: "#e5e7eb",light: "#eef2ff",},
              {primary: "#0f766e",secondary: "#14b8a6",text: "#1f2937",border: "#d1fae5",light: "#ecfdf5",},
              {primary: "#9f1239",secondary: "#e11d48",text: "#1f2937",border: "#ffe4e6",light: "#fff1f2",},
            ].map((palette, index) => (
              <button key={index} type="button" onClick={() => setTheme(palette)} className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-gray-200 hover:scale-110 transition" style={{ background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.secondary} 50%)`,}} aria-label={`Theme ${index + 1}`}/>
            ))}
          </div>
        </div>
      </div>

      <div className="relative rounded-lg border border-gray-200 bg-[#dfe3e8] overflow-hidden" style={{ minHeight: "850px",}}>
        <div className=" h-11 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.secondary,}}/>
            <span className="text-[11px] font-semibold text-gray-600">Canvas</span>
          </div>
          <span className="text-[10px] text-gray-400">A4 • 794 × 1123 px</span>
        </div>

        <div ref={previewScrollRef} className="relative overflow-auto h-[calc(100vh-230px)] min-h-[760px]">
          {showGuides && (
            <>
              <div className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/60 pointer-events-none z-20"  style={{top: `${1123 * zoom + 30}px`,}}>
                <span className="absolute right-3 -top-5 text-[9px] font-semibold text-red-400 bg-[#dfe3e8] px-2">PAGE 2 START</span>
              </div>
              <div
                className="absolute left-0 right-0 border-t border-dashed border-gray-400/40 pointer-events-none" style={{top: `{1123 * zoom}px`}} />
            </>
          )}

          <AnimatePresence mode="wait">
            {isSwitching ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PreviewSkeleton />
              </motion.div>
            ) : (
              <motion.div key={`${template}-${theme.primary}`} initial={{ opacity: 0, y: 15, scale: 0.98,}} animate={{ opacity: 1, y: 0, scale: 1,}} transition={{ duration: 0.4, ease: [ 0.22, 1, 0.36, 1,],}} style={{ transform:`scale(${zoom})`, transformOrigin:"top center", width: `${100 / zoom}%`, minHeight: `${1123 / zoom}px`,}}>
                <div id="resume-preview" className=" w-[794px] min-h-[1123px] bg-white mx-auto">
                  <TemplateRenderer resume={resume} template={template} theme={theme}/>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Preview;