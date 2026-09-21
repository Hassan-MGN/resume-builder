import { stripEmojis } from "../utils/formHelpers";

const Input = ({ label, placeholder, value, onChange, type = "text", disabled = false, hint, required = false }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[#626870]">
            {label}{required && <span className="ml-1 text-[#087CB8]">*</span>}
          </label>
          {hint && <span className="text-[9px] text-[#B0B4AE]">{hint}</span>}
        </div>
      )}
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(stripEmojis(e.target.value))}
        className="w-full h-[42px] px-3.5 rounded border border-[#D9DDE0] bg-[#FBFBFA] text-sm text-[#151719] placeholder:text-[#B9BDB8] outline-none transition-[border-color,box-shadow,background] hover:border-[#C7CCD0] focus:bg-white focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F2F2EE]"
      />
    </div>
  );
};

export default Input;
