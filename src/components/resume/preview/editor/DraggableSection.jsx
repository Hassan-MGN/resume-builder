import React, { useRef, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeEditor } from "./ResumeEditorContext";

const DraggableSection = ({ sectionId, children }) => {
  const editor = (() => {
    try { return useResumeEditor(); } catch { return null; }
  })();
  const {attributes, listeners, setNodeRef, transform, transition, isDragging,} = useSortable({ id: sectionId });
  const isExporting = editor?.isExporting ?? false;
  const isSelected = !isExporting && editor?.selectedElement?.type === "section" && editor?.selectedElement?.id === sectionId;
  const sectionStyle = editor?.resume?.layout?.sectionStyles?.[sectionId] || {};
  const dragStyle = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.45 : 1, zIndex: isDragging ? 50 : "auto" };
  const spacingStyle = { marginTop: sectionStyle.marginTop != null ? `${sectionStyle.marginTop}px` : undefined, marginBottom: sectionStyle.marginBottom != null ? `${sectionStyle.marginBottom}px` : undefined, textAlign: sectionStyle.textAlign || undefined, };
  const handleClick = (e) => {
    if (!editor || isExporting) return;
    e.stopPropagation();
    editor.selectElement({ type: "section", id: sectionId });
  };
  const dragStartY = useRef(null);
  const dragStartValue = useRef(null);
  const startSpacingDrag = useCallback((e, edge) => {
    e.preventDefault();
    e.stopPropagation();
    dragStartY.current = e.clientY;
    dragStartValue.current = edge === "bottom" ? (sectionStyle.marginBottom ?? 0) : (sectionStyle.marginTop ?? 0);
    const onMove = (moveEvent) => {
      const delta = moveEvent.clientY - dragStartY.current;
      const newValue = Math.max(0, Math.min(120, dragStartValue.current + delta));
      if (editor) {
        editor.updateSectionLayout(sectionId, {[edge === "bottom" ? "marginBottom" : "marginTop"]: Math.round(newValue)});
      }
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [sectionStyle, editor, sectionId]);
  const selectionClass = !isExporting ? (isSelected ? "ring-2 ring-cyan-400/70 bg-cyan-50/10 rounded-sm" : "hover:bg-gray-50/30"): "";
  return (
    <div ref={setNodeRef} style={{ ...dragStyle, ...spacingStyle }} onClick={handleClick} className={`relative group transition-colors duration-150 ${selectionClass}`}>
      {!isExporting && (
        <div className={`absolute -left-7 top-2 cursor-grab active:cursor-grabbing p-1 rounded text-gray-300 hover:text-cyan-500 hover:bg-cyan-50 transition-all duration-150 select-none ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} data-pdf-ignore="true" {...attributes} {...listeners} title="Drag to reorder section"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg></div>
      )}
      <div className="relative">{children}</div>
      {isSelected && !isExporting && (
        <>
          <div data-pdf-ignore="true" onMouseDown={(e) => startSpacingDrag(e, "top")} className="absolute -top-1.5 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center group/handle z-10" title={`Top spacing: ${sectionStyle.marginTop ?? 0}px — drag to adjust`}>
            <div className="w-16 h-[3px] rounded-full bg-cyan-400/60 group-hover/handle:bg-cyan-500 transition-colors" />
          </div>
          <div data-pdf-ignore="true" onMouseDown={(e) => startSpacingDrag(e, "bottom")} className="absolute -bottom-1.5 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center group/handle z-10" title={`Bottom spacing: ${sectionStyle.marginBottom ?? 0}px — drag to adjust`}>
            <div className="w-16 h-[3px] rounded-full bg-cyan-400/60 group-hover/handle:bg-cyan-500 transition-colors" />
          </div>
        </>
      )}
    </div>
  );
};

export default DraggableSection;
