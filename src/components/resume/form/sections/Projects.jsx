import React from "react";
import { AnimatePresence } from "framer-motion";


import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import AddButton from "../ui/AddButton";
import VerbSuggestions from "../ui/VerbSuggestions";

const Projects = ({
  projects,
  updateArrayItem,
  removeArrayItem,
  addProject,
  runAI,
  proofread,
  aiLoading,
  openSection,
  toggleSection,
}) => {
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <ItemCard key={index} index={index} title={ project.name || `Project ${index + 1}`} subtitle={project.technologies || "Project"} onRemove={() => removeArrayItem("projects",index)}>
              <div className="space-y-4">
                <Input label="Project Name" placeholder="AI Resume Builder" value={project.name} onChange={(value) => updateArrayItem("projects",index,"name", value)} />
                <TextArea label="Project Description" placeholder="Explain what the project does and what you contributed." value={project.description} rows={5} onChange={(value) => updateArrayItem("projects",index,"description", value)} onAI={() => runAI({ text: project.description, section: "project",target: index,mode: "enhance", })} aiLoading={ aiLoading === `project-${index}`}/>
                <VerbSuggestions text={project.description} onApply={(newText) => updateArrayItem("projects",index,"description", newText)}/>
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => proofread({ text: project.description, section: "project", target: index,})} disabled={ !project.description?.trim()} className="text-[9px] text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button>
                </div>
                <Input label="Technologies" placeholder="React, Python, PostgreSQL..." value={project.technologies} onChange={(value) =>updateArrayItem("projects",index,"technologies",value)}/>
                <Input label="Project Link" placeholder="https://github.com/..." value={project.link} onChange={(value) =>updateArrayItem("projects",index,"link",value)}/>
              </div>
            </ItemCard>
          ))}
        </AnimatePresence>
      </div>
      <AddButton onClick={addProject}>+ Add project</AddButton>
    </>
  );
};

export default Projects;