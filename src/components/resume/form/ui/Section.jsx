import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Section = ({id,number,title,description,children,badge,openSection,toggleSection,}) => {
  const isOpen = openSection === id;
  return (
    <motion.section id={`form-section-${id}`} layout className={`scroll-mt-6 overflow-hidden rounded-lg border transition-colors duration-200 ${ isOpen ? "border-slate-300 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}>
      <button type="button" onClick={() => {if (typeof toggleSection === "function") {toggleSection(id);}}} className="w-full px-4 py-4 sm:px-5 flex items-center gap-3.5 text-left">
        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-bold ${ isOpen ? "bg-[#111315] text-white" : "bg-slate-100 text-slate-500"}`}>{number}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-medium text-slate-500">{badge}</span>
            )}
          </div>
          {description && (<p className="text-[10px] text-slate-400 mt-0.5">{description}</p>)}
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 border border-slate-200 transition-transform duration-200 ${ isOpen ? "rotate-180" : ""}`}>↓</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{height: 0, opacity: 0,}} animate={{height: "auto", opacity: 1,}} exit={{height: 0, opacity: 0,}} transition={{duration: 0.2,}} className="overflow-hidden">
            <div className="px-4 pb-5 pt-1 sm:px-5">{children}</div>
          </motion.div>
        )}  
      </AnimatePresence>
    </motion.section>
  );
};

export default Section;