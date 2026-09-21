import { AnimatePresence, motion } from "framer-motion";
import { stripEmojis } from "../utils/formHelpers";

const KeyAchievements = ({
  keyAchievements,
  keyAchievementInput,
  setKeyAchievementInput,
  handleKeyAchievementKeyDown,
  removeArrayItem,
}) => {
  return (
    <>
      <div className="min-h-[58px] p-3 rounded border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/15 transition">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {keyAchievements.map((achievement, index) => (
              <motion.div key={`${achievement}-${index}`} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start justify-between gap-2 p-2 rounded bg-white border border-slate-200 text-[12px] text-slate-700">
                <span>{achievement}</span>
                <button type="button" onClick={() => removeArrayItem("keyAchievements", index)} className="text-slate-400 hover:text-red-500 shrink-0">×</button>
              </motion.div>
            ))}
          </AnimatePresence>
          <input type="text" value={keyAchievementInput} onChange={(e) => setKeyAchievementInput(stripEmojis(e.target.value))} onKeyDown={handleKeyAchievementKeyDown} placeholder={ keyAchievements.length ? "Add another achievement..." : "Type an achievement and press Enter"} className="w-full bg-transparent outline-none text-sm px-2 py-1 placeholder:text-slate-400"/>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3"><p className="text-[9px] text-slate-400">Press Enter to add an achievement.</p><span className="text-[9px] text-slate-400">{keyAchievements.length} added</span></div>
    </>
  );
};

export default KeyAchievements;
