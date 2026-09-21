import { AnimatePresence } from "framer-motion";


import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import Select from "../ui/Select";
import AddButton from "../ui/AddButton";

const Languages = ({
  languages,
  updateArrayItem,
  removeArrayItem,
  addLanguage,
  openSection,
  toggleSection,
}) => {
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {languages.map((language, index) => (
            <ItemCard key={index} index={index} title={ language.language || `Language ${index + 1}`} subtitle={ language.proficiency || "Language proficiency"} onRemove={() => removeArrayItem("languages", index)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Language" placeholder="English" value={language.language} onChange={(value) => updateArrayItem("languages", index, "language", value)}/>
                <Select label="Proficiency" value={language.proficiency} onChange={(value) => updateArrayItem("languages", index, "proficiency", value)}>
                  <option value="">Select proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </Select>
              </div>
            </ItemCard>
          ))}
        </AnimatePresence>
      </div>

      <AddButton onClick={addLanguage}>+ Add language</AddButton>
    </>
  );
};

export default Languages;