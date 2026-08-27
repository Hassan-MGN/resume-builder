import React from "react";
import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";

/**
 * Template10 — Refined
 * Category: Simple & Elegant
 *
 * Layout: Warm soft tones, left-border accent on section headings,
 * header with a warm background band, skills grouped inline,
 * subtle and approachable professional look.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template10 = ({ resume, theme, sectionOrder, onResumeChange }) => {
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
    primary: theme?.primary || "#92400e",
    secondary: theme?.secondary || "#b45309",
    text: theme?.text || "#1c1917",
    muted: theme?.muted || "#78716c",
    border: theme?.border || "#e7e5e4",
    light: theme?.light || "#fffbeb",
    headerBg: theme?.light || "#fef3c7",
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
            <section className="mb-7">
              <RefinedHeading title="About Me" sectionId="summary" colors={colors} />
              <EditableText
                elementId="summary"
                value={resume.summary}
                multiline
                onChange={(v) => update(["summary"], v)}
                className="text-[0.875em] leading-[1.8] text-stone-600"
              />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-7">
              <RefinedHeading title="Work Experience" sectionId="experience" colors={colors} />
              <div className="space-y-6">
                {experience.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Position" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.9em] font-bold block" style={{ color: colors.primary }} />
                        <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8125em] text-stone-500 block mt-0.5" />
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[0.7em] px-2 py-0.5 rounded text-stone-600" style={{ backgroundColor: colors.headerBg }}>
                          <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} />
                          {item.startDate && item.endDate && " – "}
                          <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} />
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-2 text-[0.8125em] leading-[1.7] text-stone-500 block" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "education":
        if (!education.length) return null;
        return (
          <DraggableSection key="education" sectionId="education">
            <section className="mb-7">
              <RefinedHeading title="Education" sectionId="education" colors={colors} />
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8125em] text-stone-500 block mt-0.5" />
                      {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="text-[0.75em] text-stone-400 block mt-1" />}
                    </div>
                    <div className="shrink-0 text-right text-[0.7em] text-stone-400">
                      <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} className="block" />
                      <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} className="block" />
                    </div>
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
            <section className="mb-7">
              <RefinedHeading title="Skills" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-md text-[0.8em] border" style={{ borderColor: colors.border, color: colors.primary, backgroundColor: colors.light }}>
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
            <section className="mb-7">
              <RefinedHeading title="Skills" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-md text-[0.8em] border" style={{ borderColor: colors.border, color: colors.primary, backgroundColor: colors.light }}>
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
            <section className="mb-7">
              <RefinedHeading title="Skills" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-md text-[0.8em] border" style={{ borderColor: colors.border, color: colors.primary, backgroundColor: colors.light }}>
                    <EditableText elementId={`coreSkills.${i}`} value={skill} onChange={(v) => update(["coreSkills", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "projects":
        if (!projects.length) return null;
        return (
          <DraggableSection key="projects" sectionId="projects">
            <section className="mb-7">
              <RefinedHeading title="Projects" sectionId="projects" colors={colors} />
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                    {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="text-[0.8125em] text-stone-500 block mt-1 leading-[1.7]" />}
                    {proj.technologies && <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="text-[0.75em] mt-1 block" style={{ color: colors.secondary }} />}
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
            <section className="mb-7">
              <RefinedHeading title="Projects" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-5">
                {additionalInformation.map((proj, i) => (
                  <div key={i}>
                    <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                    {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="text-[0.8125em] text-stone-500 block mt-1 leading-[1.7]" />}
                    {proj.technologies && <EditableText elementId={`additionalInformation.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["additionalInformation", i, "technologies"], v)} className="text-[0.75em] mt-1 block" style={{ color: colors.secondary }} />}
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
            <section className="mb-7">
              <RefinedHeading title="Certifications" sectionId="certificates" colors={colors} />
              <div className="space-y-3">
                {certificates.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold" style={{ color: colors.primary }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8em] text-stone-400 block mt-0.5" />}
                    </div>
                    <EditableText elementId={`certificates.${i}.issueDate`} value={item.issueDate} onChange={(v) => update(["certificates", i, "issueDate"], v)} className="text-[0.75em] text-stone-400 shrink-0" />
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
            <section className="mb-7">
              <RefinedHeading title="Languages" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {languages.map((item, i) => (
                  <div key={i} className="text-[0.875em]">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" style={{ color: colors.primary }} />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-stone-400 ml-1.5" />
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
            <section className="mb-7">
              <RefinedHeading title="Interests" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.875em] text-stone-500" />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-[1123px] bg-white" style={{ color: colors.text }}>
      {/* WARM HEADER BAND */}
      <header style={{ backgroundColor: colors.headerBg }}>
        <div className="px-12 py-10">
          <EditableText
            elementId="personal.fullname"
            value={personal.fullname}
            placeholder="Your Name"
            onChange={(v) => update(["personal", "fullname"], v)}
            className="block text-[2.5em] font-bold tracking-tight leading-none"
            style={{ color: colors.primary }}
          />
          <EditableText
            elementId="personal.title"
            value={personal.title}
            placeholder="Professional Title"
            onChange={(v) => update(["personal", "title"], v)}
            className="mt-2 block text-[0.9375em] font-light"
            style={{ color: colors.secondary }}
          />
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[0.75em]" style={{ color: colors.muted }}>
            {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} />}
            {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} />}
            {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} />}
            {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} />}
            {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} />}
          </div>
        </div>
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}55)` }} />
      </header>

      <main className="px-12 py-9">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const RefinedHeading = ({ title, sectionId, colors }) => (
  <div className="mb-4 pl-3" style={{ borderLeft: `3px solid ${colors.primary}` }}>
    <h2>
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.8125em] font-bold tracking-[0.1em] uppercase"
        style={{ color: colors.primary }}
      />
    </h2>
  </div>
);

export default Template10;
