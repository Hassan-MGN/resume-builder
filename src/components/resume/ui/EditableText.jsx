import React, { useRef, useEffect } from "react";
import { useResumeEditor } from "../preview/editor/ResumeEditorContext";

const EditableText = ({value, onChange, className = "", style = {}, placeholder = "", multiline = false, elementId, readOnly = false,}) => {
  const editor = (() => {
    try {
      return useResumeEditor();
    } catch {
      return null;
    }
  })();
  const elementRef = useRef(null);
  const customStyles = elementId && editor?.resume?.layout?.elementStyles?.[elementId] ? editor.resume.layout.elementStyles[elementId] : {};
  const isSelected = elementId && editor?.selectedElement?.id === elementId;
  const isExporting = editor?.isExporting ?? false;
  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    const domText = node.innerText ?? node.textContent ?? "";
    if (domText.trim() !== String(value || "").trim()) {
      node.innerText = value || "";
    }
  }, [value]);
  const handleBlur = (event) => {
    if (readOnly) return;
    const nextValue = event.currentTarget.innerText.trim();
    if (nextValue !== String(value || "").trim()) {
      onChange?.(nextValue);
    }
  };

  const handleClick = (e) => {
    if (!editor || !elementId) return;
    e.stopPropagation();
    let defaultFontSize = 14;
    if (elementRef.current) {
      const computed = window.getComputedStyle(elementRef.current);
      const px = parseFloat(computed.fontSize);
      if (!isNaN(px)) defaultFontSize = Math.round(px);
    }
    editor.selectElement({ type: "text", id: elementId, defaultFontSize });
  };
  const handleKeyDown = (e) => {
    if (readOnly) {
      e.preventDefault();
      return;
    }
    if (multiline && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };
  const Tag = multiline ? "div" : "span";
  const combinedStyles = { ...style, ...customStyles,};
  const selectionClass =!isExporting && isSelected ? "ring-1 ring-cyan-400 ring-offset-1 bg-cyan-50/40" : !isExporting? "hover:bg-black/[0.04]" : "";
  return (
    <Tag ref={elementRef} contentEditable={!readOnly} suppressContentEditableWarning onBlur={handleBlur} onClick={handleClick} onKeyDown={handleKeyDown} className={`${className} cursor-text rounded outline-none transition-colors duration-150 ${selectionClass}`} style={combinedStyles}>{value || placeholder}</Tag>
  );
};

export default EditableText;
