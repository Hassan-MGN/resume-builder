import React, { useState } from "react";
import Template1 from "../preview/templates/Template1";
import Template2 from "../preview/templates/Template2";
import Template3 from "../preview/templates/Template3";
import Template4 from "../preview/templates/Template4";
import Template5 from "../preview/templates/Template5";
import Template6 from "../preview/templates/Template6";
import Template7 from "../preview/templates/Template7";
import Template8 from "../preview/templates/Template8";
import Template9 from "../preview/templates/Template9";
import Template10 from "../preview/templates/Template10";
import Template11 from "../preview/templates/Template11";

/* Demo data for thumbnails */
const DEMO_RESUME = {
  personal: {
    fullname: "Alexandra Chen",
    title: "Senior Product Designer",
    email: "alex.chen@email.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexchen",
    website: "alexchen.design",
    photo: "",
  },
  summary: "Experienced designer with 8+ years building intuitive digital products for millions of users across fintech and SaaS platforms.",
  experience: [{ company: "Stripe", position: "Senior Product Designer", startDate: "2021", endDate: "Present", description: "Led redesign of core payments dashboard, reducing task completion time by 40%." }, { company: "Figma", position: "UI/UX Designer", startDate: "2018", endDate: "2021", description: "Designed collaborative features used by 4M+ users globally." },],
  education: [{ institution: "Stanford University", degree: "M.S. Human-Computer Interaction", startDate: "2016", endDate: "2018", description: "" },],
  skills: ["Figma", "React", "Design Systems", "User Research", "Prototyping", "TypeScript"],
  projects: [{ name: "Design System Library", description: "Built a comprehensive component library adopted across 12 product teams.", technologies: "Figma, Storybook, React", link: "" },],
  certificates: [{ name: "Google UX Design Certificate", issuer: "Google", issueDate: "2020" }],
  languages: [{ language: "English", proficiency: "Native" }, { language: "Mandarin", proficiency: "Fluent" }],
  hobbies: ["Photography", "Rock Climbing", "Typography"],
};

const TEMPLATE_REGISTRY = {
  Professional: { Component: Template1, defaultTheme: { primary: "#1e3a5f", secondary: "#64748b", text: "#111827" } },
  Executive:    { Component: Template4, defaultTheme: { primary: "#1e293b", secondary: "#475569", text: "#1e293b" } },
  Corporate:    { Component: Template5, defaultTheme: { primary: "#0f172a", secondary: "#334155", text: "#1e293b" } },
  Strategic:    { Component: Template6, defaultTheme: { primary: "#1d4ed8", secondary: "#3b82f6", text: "#1e293b" } },
  Modern:       { Component: Template2, defaultTheme: { primary: "#0ea5e9", secondary: "#38bdf8", text: "#0f172a" } },
  Minimal:      { Component: Template3, defaultTheme: { primary: "#374151", secondary: "#6b7280", text: "#111827" } },
  CleanTech:    { Component: Template7, defaultTheme: { primary: "#0ea5e9", secondary: "#06b6d4", text: "#0f172a" } },
  Contemporary: { Component: Template8, defaultTheme: { primary: "#7c3aed", secondary: "#a78bfa", text: "#111827" } },
  Elegant:      { Component: Template9, defaultTheme: { primary: "#374151", secondary: "#6b7280", text: "#111827" } },
  Refined:      { Component: Template10, defaultTheme: { primary: "#92400e", secondary: "#b45309", text: "#1c1917" } },
  Classic:      { Component: Template11, defaultTheme: { primary: "#111827", secondary: "#374151", text: "#111827" } },
};

const CATEGORIES = [
  {
    id: "all", label: "All Templates", icon: "◈",
    templates: [
      { id: "Professional", name: "Professional", description: "Elegant two-column layout with sidebar" },
      { id: "Executive", name: "Executive", description: "Bold header band with left-border accents" },
      { id: "Corporate", name: "Corporate", description: "Split header with structured date grid" },
      { id: "Strategic", name: "Strategic", description: "Two-column strategic sidebar layout" },
      { id: "Modern", name: "Modern", description: "Color strip sidebar with clean grid" },
      { id: "Minimal", name: "Minimal", description: "Single column with fine dividers" },
      { id: "CleanTech", name: "CleanTech", description: "Developer aesthetic with // headings" },
      { id: "Contemporary", name: "Contemporary", description: "Oversized name with gradient accent" },
      { id: "Elegant", name: "Elegant", description: "Centered serif style with double rules" },
      { id: "Refined", name: "Refined", description: "Warm tones with left-border accents" },
      { id: "Classic", name: "Classic", description: "Traditional ATS-friendly chronological" },
    ],
  },
  {
    id: "professional", label: "Highly Professional", icon: "⬛",
    templates: [
      { id: "Professional", name: "Professional", description: "Elegant two-column layout with sidebar" },
      { id: "Executive", name: "Executive", description: "Bold header band with left-border accents" },
      { id: "Corporate", name: "Corporate", description: "Split header with structured date grid" },
      { id: "Strategic", name: "Strategic", description: "Two-column strategic sidebar layout" },
    ],
  },
  {
    id: "modern", label: "Minimal & Modern", icon: "◻",
    templates: [
      { id: "Modern", name: "Modern", description: "Color strip sidebar with clean grid" },
      { id: "Minimal", name: "Minimal", description: "Single column with fine dividers" },
      { id: "CleanTech", name: "CleanTech", description: "Developer aesthetic with // headings" },
      { id: "Contemporary", name: "Contemporary", description: "Oversized name with gradient accent" },
    ],
  },
  {
    id: "elegant", label: "Simple & Elegant", icon: "○", 
    templates: [
      { id: "Elegant", name: "Elegant", description: "Centered serif style with double rules" },
      { id: "Refined", name: "Refined", description: "Warm tones with left-border accents" },
      { id: "Classic", name: "Classic", description: "Traditional ATS-friendly chronological" },
    ],
  },
];

const TemplateThumbnail = ({ templateId }) => {
  const entry = TEMPLATE_REGISTRY[templateId];
  if (!entry) return null;
  const { Component, defaultTheme } = entry;
  return (
    <Component resume={DEMO_RESUME} theme={defaultTheme} sectionOrder={["summary", "experience", "education", "skills", "projects"]} onResumeChange={() => {}}/>
  );
};


const TemplateCard = ({ templateId, name, description, selected, onSelect, category }) => (
  <button type="button" onClick={() => onSelect(templateId)} className={`group text-left bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${ selected ? "border-cyan-500 shadow-xl shadow-cyan-100/60 scale-[1.02]" : "border-gray-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-50 hover:scale-[1.01]"}`}>
    <div className="h-[220px] bg-gray-50 overflow-hidden relative">
      <div className="origin-top-left scale-[0.278] w-[794px] h-[1123px] pointer-events-none overflow-hidden"><TemplateThumbnail templateId={templateId} /></div>
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
      {selected && (<div className="absolute top-3 right-3 bg-cyan-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>)}
      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selected ? "bg-cyan-500/20 text-cyan-700" : "bg-white/80 text-gray-500"} backdrop-blur-sm`}>{category}</span>
      </div>
    </div>
    <div className="px-4 py-3.5 border-t border-gray-100">
      <h3 className={`font-bold text-sm ${selected ? "text-cyan-700" : "text-gray-900"} transition-colors`}>{name}</h3>
      <p className="text-xs text-gray-400 mt-0.5 leading-4">{description}</p>
    </div>
  </button>
);

const TemplateSelection = ({ currentTemplate, onSelect }) => {
  const [activeCat, setActiveCat] = useState("all");
  const activeCategory = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];

  const categoryLabel = (templateId) => {
    if (["Professional", "Executive", "Corporate", "Strategic"].includes(templateId)) return "Professional";
    if (["Modern", "Minimal", "CleanTech", "Contemporary"].includes(templateId)) return "Modern";
    return "Elegant";
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Template</h2>
        <p className="text-sm text-gray-500 mt-1">11 professional designs · Switch anytime without losing your data</p>
      </div>
      <div className="flex gap-1.5 mb-7 p-1 bg-gray-100 rounded-xl w-fit">
        {CATEGORIES.map(cat => (
          <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${ activeCat === cat.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}> <span className="text-xs">{cat.icon}</span>{cat.label}<span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${activeCat === cat.id ? "bg-cyan-100 text-cyan-700" : "bg-gray-200 text-gray-500"}`}>{cat.templates.length}</span></button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {activeCategory.templates.map(({ id, name, description }) => (
          <TemplateCard key={id} templateId={id} name={name} description={description} selected={currentTemplate === id} onSelect={onSelect} category={categoryLabel(id)}/>
        ))}
      </div>
      {currentTemplate && (
        <div className="mt-6 flex items-center gap-2 text-sm text-cyan-700 bg-cyan-50 rounded-xl px-4 py-3 border border-cyan-200">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span><strong>{currentTemplate}</strong> selected — click Next to proceed to the editor.</span>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;
