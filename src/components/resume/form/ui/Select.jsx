import React from "react";

const Select = ({label, value, onChange, children}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
      )}
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[46px] px-3.5 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300">{children}</select>
    </div>
  );
};

export default Select;