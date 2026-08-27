import React from "react";
import { motion } from "framer-motion";

const AIReviewPanel = ({
  review,
  onApply,
  onClose,
}) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 12,}} animate={{ opacity: 1, y: 0, }} className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#38B6FF]" /> <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#087CB8]">AI Review</span></div>
            <h3 className="mt-1 text-lg font-semibold text-slate-900"> {review.mode === "proofread"? "Writing review": "Suggested improvement"}</h3>
            <p className="mt-1 text-xs text-slate-500">Review the suggestion before applying it to your resume.</p>
          </div><button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">×</button></div>
        <div className="p-5 space-y-5">
          {review.mode === "proofread" &&
            review.issues?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-3">Issues found</h4>
                <div className="space-y-2">
                  {review.issues.map((issue, index) => (
                    <div key={index} className="border border-slate-200 rounded-md p-3">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-md bg-red-50 text-red-600 line-through">{issue.original}</span>
                        <span className="text-slate-400">→</span>
                        <span className="px-2 py-1 rounded-md bg-[#EAF7FF] text-[#087CB8]">{issue.correction}</span>
                      </div>
                      {issue.explanation && (
                        <p className="mt-2 text-[11px] text-slate-500">{issue.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-3">Suggested text</h4>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-7 whitespace-pre-line text-slate-700">{review.result}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Keep current</button>
            <button type="button" onClick={onApply} className="px-4 py-2.5 rounded-md bg-[#111315] text-white text-xs font-semibold hover:bg-[#222831] transition"> Apply suggestion</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIReviewPanel;