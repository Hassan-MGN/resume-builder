import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ResumeEditorContext = createContext(null);

export const useResumeEditor = () => {
  const context = useContext(ResumeEditorContext);
  if (!context) {
    throw new Error("useResumeEditor must be used within a ResumeEditorProvider");
  }
  return context;
};

export const ResumeEditorProvider = ({ children, resume, setResume }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const selectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const updateElementStyle = useCallback((elementId, newStyles) => {
    setResume((prev) => {
      const existingStyles = prev.layout?.elementStyles?.[elementId] || {};
      return {...prev, layout: {...prev.layout, elementStyles: {...(prev.layout?.elementStyles || {}), [elementId]: {...existingStyles,...newStyles,},
          },
        },
      };
    });
  }, [setResume]);

  const updateSectionLayout = useCallback((sectionId, newLayout) => {
    setResume((prev) => {
      const existingLayout = prev.layout?.sectionStyles?.[sectionId] || {};
      return { ...prev, layout: { ...prev.layout, sectionStyles: { ...(prev.layout?.sectionStyles || {}), [sectionId]: {...existingLayout,...newLayout,},
          },  
        },
      };
    });
  }, [setResume]);

  const getSelectedFontSize = useCallback(() => {
    if (!selectedElement || selectedElement.type !== "text") return null;
    const stored = resume.layout?.elementStyles?.[selectedElement.id]?.fontSize;
    if (stored) return stored;
    return selectedElement.defaultFontSize || 14;
  }, [selectedElement, resume.layout]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedElement(null);
        return;
      }

      if (!selectedElement) return;

      const activeEl = document.activeElement;
      const isTyping = activeEl.isContentEditable && activeEl.textContent !== undefined;

      if (selectedElement.type === "text") {
        const currentSize = resume.layout?.elementStyles?.[selectedElement.id]?.fontSize || selectedElement.defaultFontSize || 14;
        if ((e.ctrlKey || e.metaKey) && e.key === "]") {
          e.preventDefault();
          updateElementStyle(selectedElement.id, { fontSize: Math.min(currentSize + 1, 72) });
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "[") {
          e.preventDefault();
          updateElementStyle(selectedElement.id, { fontSize: Math.max(currentSize - 1, 6) });
          return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
          e.preventDefault();
          updateElementStyle(selectedElement.id, { fontSize: Math.min(currentSize + 1, 72) });
          return;
        } 
        if ((e.ctrlKey || e.metaKey) && e.key === "-") {
          e.preventDefault();
          updateElementStyle(selectedElement.id, { fontSize: Math.max(currentSize - 1, 6) });
          return;
        }
        if (!isTyping) {
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "L") {
            e.preventDefault();
            updateElementStyle(selectedElement.id, { textAlign: "left" });
          }
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
            e.preventDefault();
            updateElementStyle(selectedElement.id, { textAlign: "center" });
          }
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "R") {
            e.preventDefault();
            updateElementStyle(selectedElement.id, { textAlign: "right" });
          }
        }
      }

      if (selectedElement.type === "section" && !isTyping) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "L") {
          e.preventDefault();
          updateSectionLayout(selectedElement.id, { textAlign: "left" });
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
          e.preventDefault();
          updateSectionLayout(selectedElement.id, { textAlign: "center" });
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "R") {
          e.preventDefault();
          updateSectionLayout(selectedElement.id, { textAlign: "right" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, resume.layout, updateElementStyle, updateSectionLayout]);

  const value = { selectedElement, selectElement, clearSelection, updateElementStyle, updateSectionLayout, getSelectedFontSize, isExporting, setIsExporting, resume, setResume,};
  return (
    <ResumeEditorContext.Provider value={value}>{children}</ResumeEditorContext.Provider>
  );
};
