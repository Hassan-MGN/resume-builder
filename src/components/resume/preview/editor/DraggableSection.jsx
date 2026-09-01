import React, { useRef, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeEditor } from "./ResumeEditorContext";
import { SectionSchemas, ArraySections } from "./SectionSchemas";

const DraggableSection = ({ sectionId, children }) => {
  const editor = useResumeEditor();
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
  
  const handleAddEntry = (e) => {
    e.stopPropagation();
    if (!editor) return;
    const schema = SectionSchemas[sectionId];
    if (schema) {
      // Use JSON parse/stringify to deeply copy the defaultItem so nested arrays (like responsibilities) aren't shared by reference
      const newEntry = JSON.parse(JSON.stringify(schema.defaultItem));
      editor.addEntry(sectionId, newEntry);
      
      // Select the new entry automatically (it will be at the end of the array)
      const currentList = Array.isArray(editor.resume[sectionId]) ? editor.resume[sectionId] : [];
      const newIndex = currentList.length;
      
      // Determine the first key to select (to auto-open the panel)
      const firstFieldKey = schema.fields?.[0]?.key;
      if (firstFieldKey) {
         // wait for render then select
         setTimeout(() => {
           editor.selectElement({ type: "text", id: `${sectionId}.${newIndex}.${firstFieldKey}` });
         }, 0);
      } else if (schema.type === "stringArray") {
         setTimeout(() => {
           editor.selectElement({ type: "text", id: `${sectionId}.${newIndex}` });
         }, 0);
      }
    }
  };

  const handleDeleteSection = (e) => {
    e.stopPropagation();
    if (!editor) return;
    editor.deleteSection(sectionId);
  };

  return (
    <div ref={setNodeRef} style={{ ...dragStyle, ...spacingStyle }} onClick={handleClick} className={`relative group transition-colors duration-150 ${selectionClass}`}>
      {!isExporting && (
        <>
          <div className={`absolute -left-7 top-2 cursor-grab active:cursor-grabbing p-1 rounded text-gray-300 hover:text-cyan-500 hover:bg-cyan-50 transition-all duration-150 select-none ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} data-pdf-ignore="true" {...attributes} {...listeners} title="Drag to reorder section"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg></div>
          <div className={`absolute right-0 -top-8 flex items-center gap-1 bg-gray-900 text-white rounded shadow px-2 py-1 z-[60] transition-opacity duration-150 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"}`} data-pdf-ignore="true">
            {ArraySections.includes(sectionId) && (
              <button type="button" onClick={handleAddEntry} className="text-[10px] font-semibold hover:text-cyan-300 transition-colors px-1 border-r border-gray-700 mr-1 pr-2">
                + Add Entry
              </button>
            )}
            <button type="button" onClick={handleDeleteSection} className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors px-1">
              Delete Section
            </button>
          </div>
        </>
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
