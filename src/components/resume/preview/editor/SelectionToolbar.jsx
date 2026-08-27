import React from "react";
import { useResumeEditor } from "./ResumeEditorContext";

/* ─── Alignment icons ─── */
const AlignLeftIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="2" width="14" height="2" rx="1" />
    <rect x="1" y="6" width="10" height="2" rx="1" />
    <rect x="1" y="10" width="13" height="2" rx="1" />
    <rect x="1" y="14" width="8" height="2" rx="1" />
  </svg>
);
const AlignCenterIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="2" width="14" height="2" rx="1" />
    <rect x="3" y="6" width="10" height="2" rx="1" />
    <rect x="1.5" y="10" width="13" height="2" rx="1" />
    <rect x="4" y="14" width="8" height="2" rx="1" />
  </svg>
);
const AlignRightIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="2" width="14" height="2" rx="1" />
    <rect x="5" y="6" width="10" height="2" rx="1" />
    <rect x="2" y="10" width="13" height="2" rx="1" />
    <rect x="7" y="14" width="8" height="2" rx="1" />
  </svg>
);

const Divider = () => (
  <div className="w-px h-5 bg-gray-700 mx-1" />
);

const ToolbarBtn = ({ active, onClick, title, children }) => (
  <button type="button" onClick={onClick} title={title} className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${active ? "bg-cyan-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-200"}`}>{children}</button>
);

const SelectionToolbar = () => {
  const { selectedElement, clearSelection, updateElementStyle, updateSectionLayout, resume,
  } = useResumeEditor();
  if (!selectedElement) return null;
  const elementStyles = selectedElement.type === "text" ? (resume.layout?.elementStyles?.[selectedElement.id] || {}) : {};
  const sectionStyles = selectedElement.type === "section" ? (resume.layout?.sectionStyles?.[selectedElement.id] || {}) : {};
  const currentSize = elementStyles.fontSize ?? selectedElement.defaultFontSize ?? 14;
  const currentAlign = selectedElement.type === "text" ? (elementStyles.textAlign || "left") : (sectionStyles.textAlign || "left");
  const currentMarginTop = sectionStyles.marginTop ?? 0;
  const currentMarginBottom = sectionStyles.marginBottom ?? 0;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[200] select-none" data-pdf-ignore="true" onMouseDown={(e) => e.stopPropagation()}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 pr-3 border-r border-gray-700">{selectedElement.type === "text" ? "Text" : "Section"}
        <span className="ml-1 text-gray-500 font-normal normal-case tracking-normal max-w-[80px] truncate inline-block align-bottom">{selectedElement.id}</span>
      </div>
      {selectedElement.type === "text" && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">Size</span>
            <ToolbarBtn onClick={() => updateElementStyle(selectedElement.id, { fontSize: Math.max(6, currentSize - 1) })} title="Decrease font size (Ctrl+[)"><span className="text-xs font-bold">A−</span></ToolbarBtn>
            <span className="text-sm font-semibold min-w-[24px] text-center tabular-nums">{currentSize}</span>
            <ToolbarBtn onClick={() => updateElementStyle(selectedElement.id, { fontSize: Math.min(72, currentSize + 1) })} title="Increase font size (Ctrl+])"><span className="text-xs font-bold">A+</span></ToolbarBtn>
          </div>

          <Divider />

          <div className="flex items-center gap-1">
            <ToolbarBtn active={elementStyles.fontWeight === 700 || elementStyles.fontWeight === "bold"} onClick={() => updateElementStyle(selectedElement.id, { fontWeight: (elementStyles.fontWeight === 700 || elementStyles.fontWeight === "bold") ? 400 : 700,})} title="Bold"><span className="font-bold text-xs">B</span></ToolbarBtn>
            <ToolbarBtn active={elementStyles.fontStyle === "italic"} onClick={() => updateElementStyle(selectedElement.id, {fontStyle: elementStyles.fontStyle === "italic" ? "normal" : "italic",})} title="Italic"><span className="italic text-xs">I</span></ToolbarBtn>
          </div>

          <Divider />

          <div className="flex items-center gap-1">
            <ToolbarBtn active={currentAlign === "left"} onClick={() => updateElementStyle(selectedElement.id, { textAlign: "left" })} title="Align left (Ctrl+Shift+L)"><AlignLeftIcon /></ToolbarBtn>
            <ToolbarBtn active={currentAlign === "center"} onClick={() => updateElementStyle(selectedElement.id, { textAlign: "center" })} title="Align center (Ctrl+Shift+E)"><AlignCenterIcon /></ToolbarBtn>
            <ToolbarBtn active={currentAlign === "right"} onClick={() => updateElementStyle(selectedElement.id, { textAlign: "right" })} title="Align right (Ctrl+Shift+R)"><AlignRightIcon /></ToolbarBtn>
          </div>
        </>
      )}
      {selectedElement.type === "section" && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Spacing ↕</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500">Top</span>
              <ToolbarBtn onClick={() => updateSectionLayout(selectedElement.id, { marginTop: Math.max(0, currentMarginTop - 4) })} title="Less top space">−</ToolbarBtn>
              <span className="text-xs font-semibold min-w-[22px] text-center tabular-nums">{currentMarginTop}</span>
              <ToolbarBtn onClick={() => updateSectionLayout(selectedElement.id, { marginTop: Math.min(120, currentMarginTop + 4) })} title="More top space">+</ToolbarBtn>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500">Bot</span>
              <ToolbarBtn onClick={() => updateSectionLayout(selectedElement.id, { marginBottom: Math.max(0, currentMarginBottom - 4) })} title="Less bottom space">−</ToolbarBtn>
              <span className="text-xs font-semibold min-w-[22px] text-center tabular-nums">{currentMarginBottom}</span>
              <ToolbarBtn onClick={() => updateSectionLayout(selectedElement.id, { marginBottom: Math.min(120, currentMarginBottom + 4) })} title="More bottom space">+</ToolbarBtn>
            </div>
          </div>
          <Divider />
          <div className="flex items-center gap-1">
            <ToolbarBtn active={currentAlign === "left"} onClick={() => updateSectionLayout(selectedElement.id, { textAlign: "left" })} title="Align left"><AlignLeftIcon /></ToolbarBtn>
            <ToolbarBtn active={currentAlign === "center"} onClick={() => updateSectionLayout(selectedElement.id, { textAlign: "center" })} title="Align center"><AlignCenterIcon /></ToolbarBtn>
            <ToolbarBtn active={currentAlign === "right"} onClick={() => updateSectionLayout(selectedElement.id, { textAlign: "right" })} title="Align right"><AlignRightIcon /></ToolbarBtn>
          </div>
        </>
      )}
      <Divider />
      <ToolbarBtn onClick={clearSelection} title="Close (Esc)"><span className="text-xs">✕</span></ToolbarBtn>
    </div>
  );
};

export default SelectionToolbar;
