import { stripEmojis } from "../utils/formHelpers";

const TextArea = ({ label, placeholder, value, onChange, rows = 5, maxLength, onAI, aiLoading = false, hint, required = false }) => {
  const length = (value || "").length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {label && <label className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[#626870]">{label}{required && <span className="ml-1 text-[#087CB8]">*</span>}</label>}
          {hint && <span className="text-[9px] text-[#B0B4AE]">{hint}</span>}
        </div>
        {onAI && (
          <button type="button" onClick={onAI} disabled={aiLoading || !value?.trim()} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#087CB8] hover:text-[#065E8C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 rounded">
            <span className="text-[11px]">✦</span>{aiLoading ? "Working…" : "Improve"}
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          value={value ?? ""}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          onChange={(e) => onChange(stripEmojis(e.target.value))}
          className="w-full min-h-[118px] px-3.5 py-3 rounded border border-[#D9DDE0] bg-[#FBFBFA] text-sm leading-6 text-[#151719] placeholder:text-[#B9BDB8] outline-none resize-y transition-[border-color,box-shadow,background] hover:border-[#C7CCD0] focus:bg-white focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10"
        />
        {maxLength && <div className="absolute bottom-2.5 right-3 text-[9px] text-[#B0B4AE] font-mono">{length}/{maxLength}</div>}
      </div>
    </div>
  );
};

export default TextArea;
