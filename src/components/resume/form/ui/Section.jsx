import { AnimatePresence, motion } from "framer-motion";

const Section = ({ id, number, title, description, children, badge, openSection, toggleSection }) => {
  const isOpen = openSection === id;

  return (
    <section id={`form-section-${id}`} className="border-b border-[#EEEFF1] last:border-b-0">
      <button
        type="button"
        onClick={() => { if (typeof toggleSection === "function") toggleSection(id); }}
        className="w-full py-4 flex items-center gap-4 text-left group"
      >
        {/* Section number */}
        <span className="flex-shrink-0 text-[10px] font-mono text-[#9BA3AE] w-5 select-none">
          {number}
        </span>

        {/* Title & badge */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <h3 className={`text-sm font-semibold transition-colors ${isOpen ? "text-[#151719]" : "text-[#626870] group-hover:text-[#151719]"}`}>
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-mono text-[#9BA3AE]">{badge}</span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-9">
              {description && (
                <p className="text-xs text-[#9BA3AE] mb-4 leading-relaxed">{description}</p>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Section;