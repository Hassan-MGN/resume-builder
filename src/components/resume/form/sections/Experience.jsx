import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { generateBulletPoints } from "../../../../utils/aiEnhancer";

import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import AddButton from "../ui/AddButton";
import VerbSuggestions from "../ui/VerbSuggestions";

const Experience = ({
  experience,
  updateArrayItem,
  removeArrayItem,
  addExperience,
  runAI,
  proofread,
  aiLoading,
  openSection,
  toggleSection,
}) => {
  const [bulletLoading, setBulletLoading] = useState(null);
  const [generatedBullets, setGeneratedBullets] = useState({});

  const handleGenerateBullets = async (index, jobTitle) => {
    if (!jobTitle) return;
    setBulletLoading(index);
    try {
      const bullets = await generateBulletPoints({ jobTitle });
      setGeneratedBullets((prev) => ({ ...prev, [index]: bullets }));
    } catch (err) {
      alert(err.message || "Failed to generate bullets.");
    } finally {
      setBulletLoading(null);
    }
  };

  const insertBullet = (index, bullet) => {
    const currentArray = experience[index]?.responsibilities || [];
    updateArrayItem("experience", index, "responsibilities", [...currentArray, bullet]);
    
    setGeneratedBullets((prev) => ({ ...prev, [index]: prev[index].filter((b) => b !== bullet),}));
  };
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {experience.map((item, index) => (
            <ItemCard key={index} index={index} title={item.position || `Experience ${index + 1}`} subtitle={item.company || "Professional experience"} onRemove={() => removeArrayItem("experience", index)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company" placeholder="Company name" value={item.company} onChange={(value) => updateArrayItem("experience", index, "company", value)}/>
                <Input label="Position" placeholder="Job title" value={item.position} onChange={(value) => updateArrayItem("experience", index, "position", value)}/>
                <Input label="Start Date" placeholder="Jan 2024" value={item.startDate} onChange={(value) => updateArrayItem("experience", index, "startDate", value)}/>
                <Input label="End Date" placeholder="Present" value={item.endDate} onChange={(value) => updateArrayItem("experience", index, "endDate", value)}/>
              </div>
              <div className="mt-4 flex items-center justify-between border border-[#38B6FF]/30 bg-[#EAF7FF]/50 px-3 py-2 rounded">
                <span className="text-[10px] text-[#087CB8] font-semibold">Need ideas?</span>
                <button type="button" onClick={() => handleGenerateBullets(index, item.position)} disabled={bulletLoading === index || !item.position?.trim()} className="px-2.5 py-1 bg-white border border-[#38B6FF]/40 text-[#087CB8] text-[9px] font-bold rounded hover:bg-[#DDF3FF] transition disabled:opacity-50 flex items-center gap-1.5" >
                  {bulletLoading === index && <span className="animate-pulse w-1.5 h-1.5 bg-[#087CB8] rounded-full" />}
                  {bulletLoading === index ? "Generating..." : "Generate AI Bullets"}
                </button>
              </div>

              {generatedBullets[index]?.length > 0 && (
                <div className="mt-2 p-3 bg-white border border-[#38B6FF]/20 rounded text-xs space-y-2 max-h-[200px] overflow-y-auto">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Click to add:</p>
                  {generatedBullets[index].map((bullet, i) => (
                    <button key={i} type="button" onClick={() => insertBullet(index, bullet)} className="block w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition text-gray-700 leading-snug"><span className="text-gray-400 mr-2">•</span>{bullet}</button>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <TextArea label="Description" placeholder="General description of the role (optional)." value={item.description} rows={3} onChange={(value) => updateArrayItem("experience", index, "description", value)} onAI={() => runAI({ text: item.description, section: "experience", target: index, mode: "enhance" })} aiLoading={aiLoading === `experience-${index}`} />
                <TextArea label="Bullet Points (one per line)" hint="Start each line with • or -" placeholder="• Describe what you accomplished..." value={Array.isArray(item.responsibilities) ? item.responsibilities.join("\n") : ""} rows={6} onChange={(value) => updateArrayItem("experience", index, "responsibilities", value.split("\n"))} />
                <VerbSuggestions text={item.description} onApply={(newText) => updateArrayItem("experience", index, "description", newText)} />
                <div className="mt-2 text-right"><button type="button" onClick={() => proofread({ text: item.description, section: "experience", target: index })} disabled={!item.description?.trim()} className="text-[9px] text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button></div>
              </div>
            </ItemCard>
          ))}
        </AnimatePresence>
      </div>

      <AddButton onClick={addExperience}>+ Add another position</AddButton>
    </>
  );
};

export default Experience;
