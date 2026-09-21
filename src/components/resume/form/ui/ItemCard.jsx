import { motion } from "framer-motion";

const ItemCard = ({ index, title, subtitle, onRemove, children }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="border border-[#E2E4E6] bg-[#FCFCFB] px-4 py-4 sm:px-5 sm:py-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#EEEFF1] pb-3.5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-[#DDE1E2] bg-white text-[9px] font-mono text-[#7D837D]">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#151719]">{title || `Entry ${index + 1}`}</p>
            {subtitle && <p className="mt-0.5 truncate text-[10px] text-[#9BA3AE]">{subtitle}</p>}
          </div>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9BA3AE] hover:text-[#C94B4B] transition-colors rounded">Remove</button>
        )}
      </div>
      {children}
    </motion.div>
  );
};

export default ItemCard;
