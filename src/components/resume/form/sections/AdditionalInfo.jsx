import React from "react";
import { AnimatePresence } from "framer-motion";
import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import AddButton from "../ui/AddButton";

const AdditionalInfo = ({
  additionalInformation,
  updateArrayItem,
  removeArrayItem,
  addAdditionalInfo,
}) => {
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {additionalInformation.map((item, index) => (
            <ItemCard key={index} index={index} title={item.heading || `Section ${index + 1}`} subtitle="Additional Information" onRemove={() => removeArrayItem("additionalInformation", index)}>
              <div className="grid grid-cols-1 gap-4">
                <Input label="Heading" placeholder="e.g. Awards, Volunteer Experience" value={item.heading || ""} onChange={(value) => updateArrayItem("additionalInformation", index, "heading", value)}/>
                <TextArea label="Description / Content" placeholder="Write a short paragraph..." value={item.content || ""} rows={3} onChange={(value) => updateArrayItem("additionalInformation", index, "content", value)}/>
                <TextArea label="Bullet Points (one per line)" placeholder="• Won Employee of the Year..." value={Array.isArray(item.bullets) ? item.bullets.join("\n") : ""} rows={4} onChange={(value) => updateArrayItem("additionalInformation", index,"bullets", value.split("\n"))}/>
              </div>
            </ItemCard>
          ))}
        </AnimatePresence>
      </div>

      <AddButton onClick={addAdditionalInfo}>+ Add custom section</AddButton>
    </>
  );
};

export default AdditionalInfo;
