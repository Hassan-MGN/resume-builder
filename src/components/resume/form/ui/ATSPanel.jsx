import React, { useState } from "react";
import { analyzeATS } from "../../../../utils/aiEnhancer";

const ATSPanel = ({ resumeText }) => {
  const [expanded, setExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeATS({ resumeText, jobDescription });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze ATS keywords.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#38B6FF]/30 bg-[#EAF7FF]/50 rounded-lg overflow-hidden mt-6">
      <button type="button" onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-3 bg-[#EAF7FF] hover:bg-[#DDF3FF] transition">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-bold text-[#087CB8] text-sm">ATS Keyword Optimizer</span>
        </div>
        <span className="text-[#087CB8] text-xs font-bold">{expanded ? "▼" : "▶"}</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[#38B6FF]/20">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#087CB8] mb-2">Paste Job Description</label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the target job description here..." className="w-full px-3 py-2 rounded border border-[#38B6FF]/30 bg-white text-xs leading-5 text-gray-800 outline-none focus:border-[#38B6FF] focus:ring-1 focus:ring-[#38B6FF] min-h-[100px] resize-y" />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-[#087CB8]/80">Matches your resume content against requirements</span>
            <button type="button" onClick={handleAnalyze} disabled={loading || !jobDescription.trim()} className="px-3 py-1.5 bg-[#087CB8] text-white text-[10px] font-bold rounded hover:bg-[#065A86] disabled:opacity-50 transition flex items-center gap-2"> {loading && <span className="animate-pulse w-1.5 h-1.5 bg-white rounded-full" />} {loading ? "Analyzing..." : "Analyze ATS"}</button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-xs text-red-600">{error}</div>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-white p-3 rounded border border-[#38B6FF]/20">
                <span className="text-xs font-bold text-gray-700">ATS Match Score</span>
                <span className={`text-lg font-black ${result.score >= 70 ? 'text-green-600' : result.score >= 40 ? 'text-amber-500' : 'text-red-500'}`}> {result.score}%</span>
              </div>
              {result.tip && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                  <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">💡 Tip</p>
                  <p className="text-xs text-amber-900 leading-snug">{result.tip}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <h4 className="text-[10px] font-bold text-green-700 uppercase mb-2 border-b border-green-200 pb-1"> ✓ Matched ({result.matched.length})</h4>
                  <ul className="text-xs text-green-800 space-y-1 pl-3 list-disc">
                    {result.matched.map((m, i) => <li key={i}>{m}</li>)}
                    {result.matched.length === 0 && <span className="text-[10px] opacity-70">None</span>}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <h4 className="text-[10px] font-bold text-red-700 uppercase mb-2 border-b border-red-200 pb-1">✗ Missing ({result.missing.length})</h4>
                  <ul className="text-xs text-red-800 space-y-1 pl-3 list-disc">
                    {result.missing.map((m, i) => <li key={i}>{m}</li>)}
                    {result.missing.length === 0 && <span className="text-[10px] opacity-70">None</span>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSPanel;
