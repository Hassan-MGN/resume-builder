import React from "react";
import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";

/**
 * Template8 — Contemporary
 * Category: Highly Minimal & Modern
 *
 * Layout: Oversized name dominates header, thin gradient accent bar below name,
 * contact in a single compact row, generous whitespace, section headings with
 * subtle underline + accent dot, experience with large company name above position.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template8 = ({ resume, theme, sectionOrder, onResumeChange }) => {
  const personal = resume?.personal || {};
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const education = Array.isArray(resume?.education) ? resume.education : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const certificates = Array.isArray(resume?.certificates) ? resume.certificates : [];
  const languages = Array.isArray(resume?.languages) ? resume.languages : [];
  const hobbies = Array.isArray(resume?.hobbies) ? resume.hobbies : [];
  const coreSkills = Array.isArray(resume?.coreSkills) ? resume.coreSkills : [];
  const keyAchievements = Array.isArray(resume?.keyAchievements) ? resume.keyAchievements : [];
  const additionalInformation = Array.isArray(resume?.additionalInformation) ? resume.additionalInformation : [];
  const projects = Array.isArray(resume?.projects) ? resume.projects : [];

  const colors = {
    primary: theme?.primary || "#7c3aed",
    secondary: theme?.secondary || "#a78bfa",
    text: theme?.text || "#111827",
    muted: theme?.muted || "#6b7280",
    border: theme?.border || "#e5e7eb",
    light: theme?.light || "#faf5ff",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") onResumeChange(path, value);
  };

  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder : ALL_SECTIONS;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        if (!resume?.summary) return null;
        return (
          <DraggableSection key="summary" sectionId="summary">
            <section className="mb-10">
              <ContempoHeading title="About" sectionId="summary" colors={colors} />
              <EditableText elementId="summary" value={resume.summary} multiline onChange={(v) => update(["summary"], v)} className="text-[0.9375em] leading-[1.85] text-gray-600" />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-10">
              <ContempoHeading title="Experience" sectionId="experience" colors={colors} />
              <div className="space-y-8">
                {experience.map((item, i) => (
                  <div key={i}>
                    <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[1.05em] font-black block" style={{ color: colors.text }} />
                    <div className="flex items-center gap-3 mt-1">
                      <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Role" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.875em] font-medium" style={{ color: colors.primary }} />
                      <span className="text-gray-300 text-sm">·</span>
                      <span className="text-[0.75em] text-gray-400">
                        <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} />
                        {item.startDate && item.endDate && " — "}
                        <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} />
                      </span>
                    </div>
                    {item.description && (
                      <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-3 text-[0.85em] leading-[1.7] text-gray-500 block" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "projects":
        if (!projects.length) return null;
        return (
          <DraggableSection key="projects" sectionId="projects">
            <section className="mb-10">
              <ContempoHeading title="Projects" sectionId="projects" colors={colors} />
              <div className="space-y-6">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[1em] font-bold block" style={{ color: colors.text }} />
                    {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="mt-1.5 text-[0.85em] text-gray-500 block leading-[1.7]" />}
                    {proj.technologies && <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="mt-1.5 text-[0.75em] font-medium block" style={{ color: colors.secondary }} />}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "additionalInformation":
        if (!additionalInformation.length) return null;
        return (
          <DraggableSection key="additionalInformation" sectionId="additionalInformation">
            <section className="mb-10">
              <ContempoHeading title="Projects" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-6">
                {additionalInformation.map((proj, i) => (
                  <div key={i}>
                    <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[1em] font-bold block" style={{ color: colors.text }} />
                    {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="mt-1.5 text-[0.85em] text-gray-500 block leading-[1.7]" />}
                    {proj.technologies && <EditableText elementId={`additionalInformation.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["additionalInformation", i, "technologies"], v)} className="mt-1.5 text-[0.75em] font-medium block" style={{ color: colors.secondary }} />}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "skills":
        if (!skills.length) return null;
        return (
          <DraggableSection key="skills" sectionId="skills">
            <section className="mb-10">
              <ContempoHeading title="Skills" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full text-[0.8em] font-medium" style={{ backgroundColor: colors.light, color: colors.primary }}>
                    <EditableText elementId={`skills.${i}`} value={skill} onChange={(v) => update(["skills", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "keyAchievements":
        if (!keyAchievements.length) return null;
        return (
          <DraggableSection key="keyAchievements" sectionId="keyAchievements">
            <section className="mb-10">
              <ContempoHeading title="Skills" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap gap-2.5">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full text-[0.8em] font-medium" style={{ backgroundColor: colors.light, color: colors.primary }}>
                    <EditableText elementId={`keyAchievements.${i}`} value={skill} onChange={(v) => update(["keyAchievements", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "coreSkills":
        if (!coreSkills.length) return null;
        return (
          <DraggableSection key="coreSkills" sectionId="coreSkills">
            <section className="mb-10">
              <ContempoHeading title="Skills" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap gap-2.5">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full text-[0.8em] font-medium" style={{ backgroundColor: colors.light, color: colors.primary }}>
                    <EditableText elementId={`coreSkills.${i}`} value={skill} onChange={(v) => update(["coreSkills", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "education":
        if (!education.length) return null;
        return (
          <DraggableSection key="education" sectionId="education">
            <section className="mb-10">
              <ContempoHeading title="Education" sectionId="education" colors={colors} />
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={i}>
                    <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[1em] font-bold block" style={{ color: colors.text }} />
                    <div className="flex items-center gap-3 mt-1">
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-medium" style={{ color: colors.primary }} />
                      <span className="text-gray-300">·</span>
                      <span className="text-[0.75em] text-gray-400">
                        <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} />
                        {item.startDate && item.endDate && " — "}
                        <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} />
                      </span>
                    </div>
                    {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="mt-2 text-[0.8em] text-gray-500 block" />}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "certificates":
        if (!certificates.length) return null;
        return (
          <DraggableSection key="certificates" sectionId="certificates">
            <section className="mb-10">
              <ContempoHeading title="Certifications" sectionId="certificates" colors={colors} />
              <div className="space-y-3">
                {certificates.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold" style={{ color: colors.text }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8em] text-gray-400 block mt-0.5" />}
                    </div>
                    <EditableText elementId={`certificates.${i}.issueDate`} value={item.issueDate} onChange={(v) => update(["certificates", i, "issueDate"], v)} className="text-[0.75em] text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "languages":
        if (!languages.length) return null;
        return (
          <DraggableSection key="languages" sectionId="languages">
            <section className="mb-10">
              <ContempoHeading title="Languages" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {languages.map((item, i) => (
                  <div key={i} className="text-[0.875em]">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" style={{ color: colors.text }} />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400 ml-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "hobbies":
        if (!hobbies.length) return null;
        return (
          <DraggableSection key="hobbies" sectionId="hobbies">
            <section className="mb-10">
              <ContempoHeading title="Interests" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.875em] text-gray-500" />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      default: return null;
    }
  };

  const contactItems = [
    { key: "email", val: personal.email },
    { key: "phone", val: personal.phone },
    { key: "location", val: personal.location },
    { key: "linkedin", val: personal.linkedin },
    { key: "website", val: personal.website },
  ].filter(c => c.val);

  return (
    <div className="min-h-[1123px] bg-white" style={{ color: colors.text }}>
      {/* HEADER */}
      <header className="px-14 pt-14 pb-10">
        <EditableText
          elementId="personal.fullname"
          value={personal.fullname}
          placeholder="Your Name"
          onChange={(v) => update(["personal", "fullname"], v)}
          className="block text-[3.25em] font-black tracking-tight leading-none"
          style={{ color: colors.text }}
        />
        {/* Gradient accent bar */}
        <div className="mt-3 h-[3px] w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} />
        <EditableText
          elementId="personal.title"
          value={personal.title}
          placeholder="Professional Title"
          onChange={(v) => update(["personal", "title"], v)}
          className="mt-3 block text-[1.0625em] font-light"
          style={{ color: colors.muted }}
        />
        {/* Contact row */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.75em]" style={{ color: colors.muted }}>
          {contactItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-4">
              {idx > 0 && <span className="text-gray-300">·</span>}
              <EditableText
                elementId={`personal.${item.key}`}
                value={item.val}
                onChange={(v) => update(["personal", item.key], v)}
              />
            </span>
          ))}
        </div>
      </header>

      <main className="px-14 pb-14">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const ContempoHeading = ({ title, sectionId, colors }) => (
  <div className="mb-6">
    <h2 className="flex items-center gap-2">
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[1.1em] font-bold tracking-tight"
        style={{ color: colors.text }}
      />
      <span className="w-1.5 h-1.5 rounded-full mb-0.5" style={{ backgroundColor: colors.primary }} />
    </h2>
    <div className="mt-1.5 h-px" style={{ backgroundColor: colors.border }} />
  </div>
);

export default Template8;
