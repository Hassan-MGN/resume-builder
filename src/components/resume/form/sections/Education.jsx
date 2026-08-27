import React from "react";
import { AnimatePresence } from "framer-motion";


import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import AddButton from "../ui/AddButton";

const Education = ({
  education,
  updateArrayItem,
  removeArrayItem,
  addEducation,
  runAI,
  aiLoading,
  openSection,
  toggleSection,
}) => {
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {education.map((item, index) => (
            <ItemCard key={index} index={index} title={ item.degree || `Education ${index + 1}`} subtitle={ item.institution || "Academic qualification"} onRemove={() => removeArrayItem("education", index)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Institution" placeholder="University / College" value={item.institution} onChange={(value) => updateArrayItem("education", index, "institution", value)} />
                <Input label="Degree" placeholder="Computer Science" value={item.degree} onChange={(value) => updateArrayItem("education", index, "degree",value)}/>
                <Input label="Start Date" placeholder="2021" value={item.startDate} onChange={(value) => updateArrayItem("education", index, "startDate", value)}/>
                <Input label="End Date" placeholder="2025" value={item.endDate} onChange={(value) => updateArrayItem("education", index, "endDate", value)}/>
              </div>
              <div className="mt-4">
                <TextArea label="Additional Information" placeholder="Achievements, coursework, honors..." value={item.description} rows={4} onChange={(value) => updateArrayItem("education",index,"description",value)}
                  onAI={() => runAI({text: item.description, section: "education", target: index, mode: "enhance"})}
                  aiLoading={aiLoading === `education-${index}`}/>
              </div>
            </ItemCard>
          ))}
        </AnimatePresence>
      </div>
      <AddButton onClick={addEducation}>Add education</AddButton>
    </>
  );
};

export default Education;