import React from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";


import { stripEmojis } from "../utils/formHelpers";

const Skills = ({
  skills,
  skillInput,
  setSkillInput,
  handleSkillKeyDown,
  removeArrayItem,
  openSection,
  toggleSection,
}) => {
  return (
    <>
      <div className="min-h-[58px] p-3 rounded-md border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/15 transition">
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.span key={`${skill}-${index}`} initial={{ opacity: 0, scale: 0.95,}} animate={{ opacity: 1, scale: 1,}} exit={{ opacity: 0, scale: 0.95,}}className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#111315] text-white text-[10px] font-medium">{skill}<button type="button" onClick={() => removeArrayItem( "skills",index)}className="text-white/60 hover:text-white">×</button></motion.span>
            ))}
          </AnimatePresence>
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(stripEmojis(e.target.value))} onKeyDown={handleSkillKeyDown} placeholder={skills.length ? "Add another skill..." : "Type a skill and press Enter"} className="flex-1 min-w-[180px] bg-transparent outline-none text-sm px-2 py-1 placeholder:text-slate-400"/>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[9px] text-slate-400">Press Enter or comma to add a skill.</p>
        <span className="text-[9px] text-slate-400">{skills.length} added</span>
      </div>
    </>
  );
};

export default Skills;