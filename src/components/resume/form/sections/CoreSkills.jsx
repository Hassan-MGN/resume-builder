import { AnimatePresence, motion } from "framer-motion";
import { stripEmojis } from "../utils/formHelpers";

const CoreSkills = ({
  coreSkills,
  coreSkillInput,
  setCoreSkillInput,
  handleCoreSkillKeyDown,
  removeArrayItem,
}) => {
  return (
    <>
      <div className="min-h-[58px] p-3 rounded border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/15 transition">
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {coreSkills.map((skill, index) => (
              <motion.span key={`${skill}-${index}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#111315] text-white text-[10px] font-medium">{skill}<button type="button" onClick={() => removeArrayItem("coreSkills", index)} className="text-white/60 hover:text-white">×</button></motion.span>
            ))}
          </AnimatePresence>
          <input type="text" value={coreSkillInput} onChange={(e) => setCoreSkillInput(stripEmojis(e.target.value))} onKeyDown={handleCoreSkillKeyDown} placeholder={coreSkills.length ? "Add another core skill..." : "Type a core skill and press Enter"} className="flex-1 min-w-[180px] bg-transparent outline-none text-sm px-2 py-1 placeholder:text-slate-400"/>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-[9px] text-slate-400">Press Enter or comma to add a skill.</p>
        <span className="text-[9px] text-slate-400">{coreSkills.length} added</span>
      </div>
    </>
  );
};

export default CoreSkills;
