import React, { useState, useEffect } from "react";
import { useResumeEditor } from "./ResumeEditorContext";
import { SectionSchemas } from "./SectionSchemas";

const EntryEditorPanel = () => {
  const { 
    activeSection, 
    activeEntryIndex, 
    resume, 
    setResume, 
    deleteEntry, 
    isExporting,
    clearSelection
  } = useResumeEditor();

  if (isExporting || !activeSection || activeEntryIndex === null) return null;

  const schema = SectionSchemas[activeSection];
  if (!schema) return null;

  const entry = resume[activeSection]?.[activeEntryIndex];
  if (!entry && schema.type !== "stringArray") return null;

  const updateEntry = (key, value) => {
    setResume((prev) => {
      const currentList = Array.isArray(prev[activeSection]) ? prev[activeSection] : [];
      const updatedList = [...currentList];
      
      if (schema.type === "stringArray") {
        updatedList[activeEntryIndex] = value;
      } else {
        updatedList[activeEntryIndex] = { ...updatedList[activeEntryIndex], [key]: value };
      }
      
      return { ...prev, [activeSection]: updatedList };
    });
  };

  const updateNestedArray = (key, index, value) => {
    setResume((prev) => {
      const currentList = Array.isArray(prev[activeSection]) ? prev[activeSection] : [];
      const updatedList = [...currentList];
      const entryObj = { ...updatedList[activeEntryIndex] };
      
      const arr = Array.isArray(entryObj[key]) ? [...entryObj[key]] : [];
      arr[index] = value;
      entryObj[key] = arr;
      
      updatedList[activeEntryIndex] = entryObj;
      return { ...prev, [activeSection]: updatedList };
    });
  };

  const addNestedArrayItem = (key) => {
    setResume((prev) => {
      const currentList = Array.isArray(prev[activeSection]) ? prev[activeSection] : [];
      const updatedList = [...currentList];
      const entryObj = { ...updatedList[activeEntryIndex] };
      
      const arr = Array.isArray(entryObj[key]) ? [...entryObj[key]] : [];
      arr.push("");
      entryObj[key] = arr;
      
      updatedList[activeEntryIndex] = entryObj;
      return { ...prev, [activeSection]: updatedList };
    });
  };

  const deleteNestedArrayItem = (key, index) => {
    setResume((prev) => {
      const currentList = Array.isArray(prev[activeSection]) ? prev[activeSection] : [];
      const updatedList = [...currentList];
      const entryObj = { ...updatedList[activeEntryIndex] };
      
      const arr = Array.isArray(entryObj[key]) ? [...entryObj[key]] : [];
      arr.splice(index, 1);
      entryObj[key] = arr;
      
      updatedList[activeEntryIndex] = entryObj;
      return { ...prev, [activeSection]: updatedList };
    });
  };

  const handleDelete = () => {
    deleteEntry(activeSection, activeEntryIndex);
  };

  return (
    <div  className="fixed right-6 top-24 w-80 max-h-[calc(100vh-140px)] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-[200] p-4 flex flex-col gap-4 text-gray-800" data-pdf-ignore="true">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-900">Edit {schema.label}</h3>
        <button onClick={clearSelection} className="text-gray-400 hover:text-gray-600 font-bold w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {schema.type === "stringArray" ? (
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{schema.label}</label>
            <input type="text" value={resume[activeSection]?.[activeEntryIndex] || ""} onChange={(e) => updateEntry(null, e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-cyan-500 outline-none"/>
          </div>
        ) : schema.fields?.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{field.label}</label>
              {field.type === "text" && (
                <input type="text" value={entry[field.key] || ""} onChange={(e) => updateEntry(field.key, e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-cyan-500 outline-none"/>
              )}

              {field.type === "textarea" && (
                <textarea value={entry[field.key] || ""} onChange={(e) => updateEntry(field.key, e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-cyan-500 outline-none min-h-[80px]"/>
              )}

              {field.type === "stringArray" && (
                <div className="space-y-2">
                  {(Array.isArray(entry[field.key]) ? entry[field.key] : []).map((val, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <textarea value={val || ""} onChange={(e) => updateNestedArray(field.key, idx, e.target.value)} className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-cyan-500 outline-none min-h-[40px]"/>
                      <button onClick={() => deleteNestedArrayItem(field.key, idx)} className="text-gray-400 hover:text-red-500 mt-1 p-1" title="Delete item">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addNestedArrayItem(field.key)} className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded px-2 py-1 transition-colors">
                    {field.addLabel || "+ Add"}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="pt-3 border-t border-gray-100">
        <button onClick={handleDelete} className="w-full text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded py-2 transition-colors">Delete {schema.label}</button>
      </div>
    </div>
  );
};

export default EntryEditorPanel;
