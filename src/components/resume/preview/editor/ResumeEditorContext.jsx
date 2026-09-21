import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ResumeEditorContext = createContext(null);

export const useResumeEditor = () => {
  return useContext(ResumeEditorContext) || null;
};

export const ResumeEditorProvider = ({ children, resume, setResume }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeEntryIndex, setActiveEntryIndex] = useState(null);
  const [activeEntryId, setActiveEntryId] = useState(null);

  const selectElement = useCallback((element) => {
    setSelectedElement(element);
    
    // Parse element id to determine active section and entry
    if (element?.id) {
      const parts = element.id.split('.');
      setActiveSection(parts[0]);
      if (parts.length > 1 && !isNaN(parseInt(parts[1], 10))) {
        const index = parseInt(parts[1], 10);
        setActiveEntryIndex(index);
        const entry = resume?.[parts[0]]?.[index];
        setActiveEntryId(entry && typeof entry === "object" ? (entry.__editorId || null) : null);
      } else {
        setActiveEntryIndex(null);
        setActiveEntryId(null);
      }
    } else {
      setActiveSection(null);
      setActiveEntryIndex(null);
      setActiveEntryId(null);
    }
  }, [resume]);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setActiveSection(null);
    setActiveEntryIndex(null);
    setActiveEntryId(null);
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

  const addEntry = useCallback((sectionId, newEntry) => {
    const withId = newEntry && typeof newEntry === "object" ? { ...newEntry, __editorId: globalThis.crypto?.randomUUID?.() || `entry-${Date.now()}-${Math.random().toString(36).slice(2)}` } : newEntry;
    setResume((prev) => {
      const currentList = Array.isArray(prev[sectionId]) ? prev[sectionId] : [];
      return { ...prev, [sectionId]: [...currentList, withId] };
    });
  }, [setResume]);

  const deleteEntry = useCallback((sectionId, index) => {
    setResume((prev) => {
      const currentList = Array.isArray(prev[sectionId]) ? prev[sectionId] : [];
      const updatedList = [...currentList];
      updatedList.splice(index, 1);
      return { ...prev, [sectionId]: updatedList };
    });
    if (activeSection === sectionId) {
      if (activeEntryId) {
        const deletedId = resume?.[sectionId]?.[index]?.__editorId;
        if (deletedId === activeEntryId) clearSelection();
      } else if (activeEntryIndex === index) {
        clearSelection();
      } else if (activeEntryIndex > index) {
        setActiveEntryIndex((current) => (typeof current === "number" ? current - 1 : current));
      }
    }
  }, [setResume, activeSection, activeEntryIndex, clearSelection]);

  const deleteSection = useCallback((sectionId) => {
    setResume((prev) => {
      const currentOrder = Array.isArray(prev.layout?.sectionOrder) ? prev.layout.sectionOrder : [];
      const updatedOrder = currentOrder.filter(id => id !== sectionId);
      const currentLayout = prev.layout?.sectionLayout || {};
      const nextSectionLayout = {
        ...currentLayout,
        leftColumn: Array.isArray(currentLayout.leftColumn) ? currentLayout.leftColumn.filter(id => id !== sectionId) : currentLayout.leftColumn,
        rightColumn: Array.isArray(currentLayout.rightColumn) ? currentLayout.rightColumn.filter(id => id !== sectionId) : currentLayout.rightColumn,
      };
      return { ...prev, layout: { ...prev.layout, sectionOrder: updatedOrder, sectionLayout: nextSectionLayout } };
    });
    if (activeSection === sectionId) {
      clearSelection();
    }
  }, [setResume, activeSection, clearSelection]);

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

  useEffect(() => {
    if (!resume || typeof resume !== "object") return;
    let changed = false;
    const next = { ...resume };
    Object.keys(next).forEach((key) => {
      if (!Array.isArray(next[key])) return;
      const mapped = next[key].map((entry) => {
        if (!entry || typeof entry !== "object" || entry.__editorId) return entry;
        changed = true;
        return { ...entry, __editorId: globalThis.crypto?.randomUUID?.() || `entry-${Date.now()}-${Math.random().toString(36).slice(2)}` };
      });
      next[key] = mapped;
    });
    if (changed) setResume(next);
  }, [resume, setResume]);

  const value = { 
    selectedElement, selectElement, clearSelection, updateElementStyle, updateSectionLayout, getSelectedFontSize, 
    isExporting, setIsExporting, resume, setResume,
    activeSection, setActiveSection, activeEntryIndex, setActiveEntryIndex, activeEntryId, setActiveEntryId,
    addEntry, deleteEntry, deleteSection
  };
  return (
    <ResumeEditorContext.Provider value={value}>{children}</ResumeEditorContext.Provider>
  );
};
