import { useState } from "react";
import { rewriteWithTone } from "../../../../utils/aiEnhancer";
import TextArea from "../ui/TextArea";

const Summary = ({
  summary,
  updateSummary,
  runAI,
  proofread,
  aiLoading,
  openSection,
  toggleSection,
}) => {
  const [toneLoading, setToneLoading] = useState(null);

  const handleToneRewrite = async (tone) => {
    if (!summary?.trim()) return;
    setToneLoading(tone);
    try {
      const rewritten = await rewriteWithTone({ text: summary, tone });
      updateSummary(rewritten);
    } catch (err) {
      alert(err.message || `Failed to rewrite in ${tone} tone.`);
    } finally {
      setToneLoading(null);
    }
  };

  const tones = ["Executive", "Creative", "Technical", "Academic"];

  return (
    <>
      <TextArea label="Summary" placeholder="Write a concise professional summary..." value={summary} rows={7} maxLength={1000} onChange={updateSummary} onAI={() => runAI({ text: summary, section: "summary", mode: "enhance",})} aiLoading={aiLoading === "summary-main"}/>
      {summary?.trim() && (
        <div className="mt-3 flex items-center justify-between border border-[#38B6FF]/30 bg-[#EAF7FF]/50 px-3 py-2 rounded">
          <span className="text-[9px] text-[#087CB8] font-bold uppercase tracking-wider">Rewrite Tone:</span>
          <div className="flex items-center gap-1.5">
            {tones.map((tone) => (
              <button key={tone} type="button" onClick={() => handleToneRewrite(tone)} disabled={toneLoading !== null} className="px-2 py-1 bg-white border border-[#38B6FF]/40 text-[#087CB8] text-[9px] font-bold rounded hover:bg-[#DDF3FF] transition disabled:opacity-50 flex items-center gap-1">{toneLoading === tone && (<span className="animate-pulse w-1.5 h-1.5 bg-[#087CB8] rounded-full" />)} {tone}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 text-[9px] text-slate-400">
        <span>Recommended: 2–4 concise sentences.</span>
        <button type="button" onClick={() => proofread({ text: summary, section: "summary", })} disabled={!summary?.trim() || aiLoading === "summary-main"} className="text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button>
      </div>
    </>
  );
};

export default Summary;
