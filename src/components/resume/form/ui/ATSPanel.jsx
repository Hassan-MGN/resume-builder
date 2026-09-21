import { useState } from "react";
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
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-[#EEEFF1] mt-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <div>
          <p className="text-xs font-semibold text-[#151719]">ATS keyword match</p>
          <p className="text-[11px] text-[#9BA3AE] mt-0.5">Compare your resume to a job description</p>
        </div>

      </button>

      {expanded && (
        <div className="pb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#626870] mb-1.5">
              Job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here…"
              className="w-full px-3 py-2.5 rounded border border-[#E2E4E6] bg-white text-xs leading-5 text-[#151719] placeholder:text-[#C8CDD3] outline-none focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 min-h-[90px] resize-y transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="h-8 px-4 rounded bg-[#151719] hover:bg-[#222831] text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing…" : "Analyse"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-[#C94B4B] bg-[#FEF2F2] border border-[#FCA5A5]/30 rounded px-3 py-2">
              {error}
            </p>
          )}

          {result && (
            <div className="space-y-3">
              {/* Score */}
              <div className="flex items-center justify-between border border-[#E2E4E6] rounded px-4 py-3">
                <span className="text-xs font-semibold text-[#151719]">Match score</span>
                <span className={`text-base font-bold font-mono ${
                  result.score >= 70 ? "text-[#27865B]" : result.score >= 40 ? "text-[#B7791F]" : "text-[#C94B4B]"
                }`}>
                  {result.score}%
                </span>
              </div>

              {result.tip && (
                <div className="border border-[#E2E4E6] rounded px-4 py-3">
                  <p className="text-[10px] font-mono text-[#9BA3AE] uppercase tracking-[0.1em] mb-1">Tip</p>
                  <p className="text-xs text-[#626870] leading-relaxed">{result.tip}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#E2E4E6] rounded p-3">
                  <p className="text-[10px] font-mono text-[#27865B] uppercase tracking-[0.1em] mb-2">
                    Matched ({result.matched.length})
                  </p>
                  <ul className="text-xs text-[#626870] space-y-1">
                    {result.matched.map((m, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-[#27865B] mt-px">✓</span>{m}</li>)}
                    {result.matched.length === 0 && <li className="text-[#9BA3AE]">None found</li>}
                  </ul>
                </div>
                <div className="border border-[#E2E4E6] rounded p-3">
                  <p className="text-[10px] font-mono text-[#C94B4B] uppercase tracking-[0.1em] mb-2">
                    Missing ({result.missing.length})
                  </p>
                  <ul className="text-xs text-[#626870] space-y-1">
                    {result.missing.map((m, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-[#C94B4B] mt-px">–</span>{m}</li>)}
                    {result.missing.length === 0 && <li className="text-[#9BA3AE]">None missing</li>}
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
