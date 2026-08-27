import React from "react";
import { stripEmojis } from "../utils/formHelpers";

const TextArea = ({label, placeholder, value, onChange, rows = 5, maxLength, onAI, aiLoading = false,}) => {
  const length = (value || "").length;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        {label && (
          <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
        )}
        {onAI && (
          <button type="button" onClick={onAI} disabled={aiLoading || !value?.trim()} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#38B6FF]/30 bg-[#EAF7FF] text-[#087CB8] text-[10px] font-semibold hover:bg-[#DDF3FF] hover:border-[#38B6FF]/50 transition disabled:opacity-50 disabled:cursor-not-allowed"><span className={`w-1.5 h-1.5 rounded-full bg-[#38B6FF] ${aiLoading ? "animate-pulse" : ""}`}/>{aiLoading ? "Working..." : "AI Assist"}</button>
        )}
      </div>
      <div className="relative">
        <textarea value={value ?? ""} placeholder={placeholder} rows={rows} maxLength={maxLength} onChange={(e) => onChange(stripEmojis(e.target.value))} className="w-full px-3.5 py-3.5 rounded-md border border-slate-200 bg-slate-50 text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none resize-y transition duration-150 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300"/>
        <div className="absolute bottom-2 right-3 text-[9px] text-slate-400">{length}{maxLength ? `/${maxLength}` : ""}</div>
      </div>
    </div>
  );
};

export default TextArea;