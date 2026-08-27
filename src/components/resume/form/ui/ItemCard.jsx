import React from "react";
import { motion } from "framer-motion";

const ItemCard = ({index, title, subtitle, onRemove, children}) => {
  return (
    <motion.div layout initial={{ opacity: 0, y: 5,}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -5,}} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#111315] text-white flex items-center justify-center text-[9px] font-bold">{String(index + 1).padStart(2, "0")}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{title || `Item ${index + 1}`}</p>
            {subtitle && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className="flex-shrink-0 text-[10px] font-medium text-red-500 px-2 py-1.5 rounded-md hover:bg-red-50 transition">Remove</button>
        )}
      </div>
      {children}
    </motion.div>
  );
};

export default ItemCard;