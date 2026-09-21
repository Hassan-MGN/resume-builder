import { motion } from "framer-motion";

const AIReviewPanel = ({ review, onApply, onClose }) => {
  if (!review) return null;

  const label = review.mode === "proofread" ? "Writing review" : "Suggested improvement";

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white border border-[#E2E4E6] rounded shadow-lg"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EEEFF1] flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-[#9BA3AE] uppercase tracking-[0.15em] mb-1">AI Review</p>
            <h3 className="text-base font-semibold text-[#151719]">{label}</h3>
            <p className="text-xs text-[#9BA3AE] mt-0.5">Review the suggestion before applying it.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9BA3AE] hover:text-[#626870] transition-colors text-lg leading-none mt-0.5 rounded"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Proofread issues */}
          {review.mode === "proofread" && review.issues?.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-[#9BA3AE] uppercase tracking-[0.15em] mb-3">Issues found</p>
              <div className="space-y-2">
                {review.issues.map((issue, i) => (
                  <div key={i} className="border border-[#EEEFF1] rounded p-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="line-through text-[#C94B4B]">{issue.original}</span>
                      <span className="text-[#9BA3AE]"></span>
                      <span className="text-[#087CB8]">{issue.correction}</span>
                    </div>
                    {issue.explanation && (
                      <p className="mt-1.5 text-[11px] text-[#9BA3AE]">{issue.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested text */}
          <div>
            <p className="text-[10px] font-mono text-[#9BA3AE] uppercase tracking-[0.15em] mb-2">Suggested text</p>
            <div className="border border-[#E2E4E6] rounded p-4 bg-[#F7F7F5]">
              <p className="text-sm leading-7 text-[#151719] whitespace-pre-line">{review.result}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded border border-[#E2E4E6] text-xs font-medium text-[#626870] hover:border-[#C8CDD3] hover:text-[#151719] transition-colors"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={onApply}
              className="h-9 px-4 rounded bg-[#151719] hover:bg-[#222831] text-white text-xs font-medium transition-colors"
            >
              Apply suggestion
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIReviewPanel;