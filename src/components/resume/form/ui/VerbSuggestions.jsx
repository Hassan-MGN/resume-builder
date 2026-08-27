import React, { useState } from "react";
import { suggestActionVerbs } from "../../../../utils/aiEnhancer";

const VerbSuggestions = ({ text, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(new Set());

  const analyze = async () => {
    if (!text?.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions(null);
    setApplied(new Set());

    try {
      const result = await suggestActionVerbs({ text });
      setSuggestions(result);
    } catch (err) {
      setError(err.message || "Failed to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyReplacement = (original, replacement) => {
    if (!text) return;
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const newText = text.replace(regex, replacement);
    onApply(newText);
    setApplied((prev) => new Set([...prev, original]));
  };

  const hasSuggestions = Array.isArray(suggestions);
  const visibleSuggestions = hasSuggestions
    ? suggestions.filter((s) => !applied.has(s.original))
    : [];

  return (
    <div className="mt-2">
      <button type="button" onClick={analyze} disabled={loading || !text?.trim()} className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-amber-600 hover:text-amber-800 disabled:opacity-40 transition"><span className={`w-1.5 h-1.5 rounded-full bg-amber-400 ${loading ? "animate-pulse" : ""}`}/>{loading ? "Analyzing verbs..." : "Suggest stronger verbs"}</button>
      {error && (
        <p className="mt-1.5 text-[9px] text-red-500">{error}</p>
      )}
      {hasSuggestions && !loading && (
        <div className="mt-2">
          {visibleSuggestions.length === 0 ? (
            <p className="text-[9px] text-green-600 font-medium">✓ No weak phrases found — your language looks strong!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {visibleSuggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => applyReplacement(s.original, s.replacement)} className="group flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] hover:bg-amber-100 hover:border-amber-300 transition" title={`Replace "${s.original}" with "${s.replacement}"`}><span className="text-amber-500 line-through max-w-[80px] truncate">{s.original}</span><span className="text-amber-400">→</span><span className="font-semibold text-amber-700">{s.replacement}</span></button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerbSuggestions;
