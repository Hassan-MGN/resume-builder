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
  experience: [
    { company: "Stripe", position: "Senior Product Designer", startDate: "2021", endDate: "Present", description: "Led redesign of core payments dashboard, reducing task completion time by 40%." },
    { company: "Figma", position: "UI/UX Designer", startDate: "2018", endDate: "2021", description: "Designed collaborative features used by 4M+ users globally." },
  ],
  education: [{ institution: "Stanford University", degree: "M.S. Human-Computer Interaction", startDate: "2016", endDate: "2018", description: "" }],
  skills: ["Figma", "React", "Design Systems", "User Research", "Prototyping", "TypeScript"],
  projects: [{ name: "Design System Library", description: "Built a comprehensive component library adopted across 12 product teams.", technologies: "Figma, Storybook, React", link: "" }],
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
    id: "all", label: "All",
    templates: [
      { id: "Professional", name: "Professional", description: "Two-column with sidebar" },
      { id: "Executive", name: "Executive", description: "Bold header band" },
      { id: "Corporate", name: "Corporate", description: "Split header, date grid" },
      { id: "Strategic", name: "Strategic", description: "Strategic sidebar layout" },
      { id: "Modern", name: "Modern", description: "Color strip sidebar" },
      { id: "Minimal", name: "Minimal", description: "Single column, fine dividers" },
      { id: "CleanTech", name: "CleanTech", description: "Developer aesthetic" },
      { id: "Contemporary", name: "Contemporary", description: "Oversized name header" },
      { id: "Elegant", name: "Elegant", description: "Centered serif style" },
      { id: "Refined", name: "Refined", description: "Warm tones, left accents" },
      { id: "Classic", name: "Classic", description: "ATS-friendly chronological" },
    ],
  },
  {
    id: "professional", label: "Professional",
    templates: [
      { id: "Professional", name: "Professional", description: "Two-column with sidebar" },
      { id: "Executive", name: "Executive", description: "Bold header band" },
      { id: "Corporate", name: "Corporate", description: "Split header, date grid" },
      { id: "Strategic", name: "Strategic", description: "Strategic sidebar layout" },
    ],
  },
  {
    id: "modern", label: "Modern",
    templates: [
      { id: "Modern", name: "Modern", description: "Color strip sidebar" },
      { id: "Minimal", name: "Minimal", description: "Single column, fine dividers" },
      { id: "CleanTech", name: "CleanTech", description: "Developer aesthetic" },
      { id: "Contemporary", name: "Contemporary", description: "Oversized name header" },
    ],
  },
  {
    id: "elegant", label: "Elegant",
    templates: [
      { id: "Elegant", name: "Elegant", description: "Centered serif style" },
      { id: "Refined", name: "Refined", description: "Warm tones, left accents" },
      { id: "Classic", name: "Classic", description: "ATS-friendly chronological" },
    ],
  },
];

const TemplateThumbnail = ({ templateId }) => {
  const entry = TEMPLATE_REGISTRY[templateId];
  if (!entry) return null;
  const { Component, defaultTheme } = entry;
  return (
    <Component
      resume={DEMO_RESUME}
      theme={defaultTheme}
      sectionOrder={["summary", "experience", "education", "skills", "projects"]}
      onResumeChange={() => {}}
    />
  );
};

const TemplateCard = ({ templateId, name, description, selected, onSelect }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(templateId)}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(templateId)}
    className={`group rounded text-left bg-white overflow-hidden transition-all duration-200 border cursor-pointer ${
      selected
        ? "border-[#087CB8] shadow-[0_8px_24px_rgba(8,124,184,0.10)]"
        : "border-[#E2E4E6] hover:border-[#C8CDD3] hover:shadow-[0_8px_24px_rgba(21,23,25,0.06)]"
    }`}
  >
    {/* Thumbnail */}
    <div className="h-[200px] bg-[#F7F7F5] overflow-hidden relative">
      <div className="origin-top-left scale-[0.252] w-[794px] h-[1123px] pointer-events-none overflow-hidden">
        <TemplateThumbnail templateId={templateId} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F7F5] to-transparent pointer-events-none" />
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#087CB8] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>

    {/* Card footer */}
    <div className="px-3.5 py-3 border-t border-[#EEEFF1]">
      <h3 className={`text-sm font-semibold ${selected ? "text-[#087CB8]" : "text-[#151719]"}`}>{name}</h3>
      <p className="text-[11px] text-[#9BA3AE] mt-0.5">{description}</p>
    </div>
  </div>
);


const TemplateSelection = ({ currentTemplate, onSelect, initialCategory = "all" }) => {
  const [activeCat, setActiveCat] = useState(initialCategory);
  const activeCategory = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#151719]">Choose a template</h2>
        <p className="text-sm text-[#626870] mt-1">11 designs · switch anytime without losing your data</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#EEEFF1]">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCat(cat.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeCat === cat.id
                ? "border-[#151719] text-[#151719]"
                : "border-transparent text-[#9BA3AE] hover:text-[#626870]"
            }`}
          >
            {cat.label}
            <span className="ml-1.5 text-[10px] font-mono text-[#9BA3AE]">{cat.templates.length}</span>
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeCategory.templates.map(({ id, name, description }) => (
          <TemplateCard
            key={id}
            templateId={id}
            name={name}
            description={description}
            selected={currentTemplate === id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {currentTemplate && (
        <div className="mt-5 flex items-center gap-2 text-[11px] text-[#27865B] border border-[#27865B]/20 bg-[#F0FDF4] px-4 py-2.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span><strong>{currentTemplate}</strong> selected — click Continue to proceed.</span>
        </div>
      )}
    </div>
  );
};

export { CATEGORIES };
export default TemplateSelection;
