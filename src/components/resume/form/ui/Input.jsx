import React from "react";
import { cleanText } from "../utils/formHelpers";

const Input = ({label, placeholder, value, onChange, type = "text", disabled = false}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
      )}

      <input type={type} value={value ?? ""} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(cleanText(e.target.value))} className="w-full min-h-[46px] px-3.5 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"/>
    </div>
  );
};

export default Input;