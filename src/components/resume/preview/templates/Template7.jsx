import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";

/**
 * Template7 — CleanTech
 * Category: Highly Minimal & Modern
 *
 * Layout: Technical / developer aesthetic.
 * Section headings styled as `// SECTION_NAME`.
 * Pill badges for skills, right-aligned dates,
 * monospace-inspired information density.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template7 = ({
  resume,
  pageData,
  continuationSections, theme, sectionOrder, onResumeChange, isFirstPage = true }) => {
  const personal = resume?.personal || {};
  const getSectionData = (key) => pageData?.[key] ?? resume?.[key] ?? [];
  const experience = Array.isArray(getSectionData("experience")) ? getSectionData("experience") : [];
  const education = Array.isArray(getSectionData("education")) ? getSectionData("education") : [];
  const skills = Array.isArray(getSectionData("skills")) ? getSectionData("skills") : [];
  const certificates = Array.isArray(getSectionData("certificates")) ? getSectionData("certificates") : [];
  const languages = Array.isArray(getSectionData("languages")) ? getSectionData("languages") : [];
  const hobbies = Array.isArray(getSectionData("hobbies")) ? getSectionData("hobbies") : [];
  const coreSkills = Array.isArray(getSectionData("coreSkills")) ? getSectionData("coreSkills") : [];
  const keyAchievements = Array.isArray(getSectionData("keyAchievements")) ? getSectionData("keyAchievements") : [];
  const additionalInformation = Array.isArray(getSectionData("additionalInformation")) ? getSectionData("additionalInformation") : [];
  const projects = Array.isArray(getSectionData("projects")) ? getSectionData("projects") : [];

  const colors = {
    primary: theme?.primary || "#0ea5e9",
    secondary: theme?.secondary || "#06b6d4",
    text: theme?.text || "#0f172a",
    muted: theme?.muted || "#475569",
    border: theme?.border || "#e2e8f0",
    light: theme?.light || "#f0f9ff",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") onResumeChange(path, value);
  };

  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder : ALL_SECTIONS;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        if (!(pageData?.summary ?? resume?.summary)) return null;
        return (
          <DraggableSection key="summary" sectionId="summary">
            <section className="mb-8">
              <TechHeading title="ABOUT" sectionId="summary" colors={colors} />
              <EditableText elementId="summary" value={pageData?.summary ?? resume?.summary} multiline onChange={(v) => update(["summary"], v)} className="text-[0.875em] leading-[1.75] text-gray-600" />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-8">
              <TechHeading title="EXPERIENCE" sectionId="experience" colors={colors} />
              <div className="space-y-7">
                {experience.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Role" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.9em] font-bold block" style={{ color: colors.text }} />
                        <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8em] font-medium mt-0.5 block" style={{ color: colors.primary }} />
                      </div>
                      <span className="text-[0.7em] font-mono shrink-0 pt-0.5" style={{ color: colors.muted }}>
                        <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} />
                        {item.startDate && item.endDate && " · "}
                        <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} />
                      </span>
                    </div>
                    {item.description && (
                      <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-2 text-[0.8em] leading-[1.65] text-gray-500 block border-l-2 pl-3" style={{ borderColor: colors.border }} />
                    )}
                    <ExperienceBullets item={item} index={i} update={update} />
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
            <section className="mb-8">
              <TechHeading title="PROJECTS" sectionId="projects" colors={colors} />
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i} className="rounded p-4" style={{ backgroundColor: colors.light, borderLeft: `3px solid ${colors.primary}` }}>
                    <div className="flex justify-between items-start gap-2">
                      <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      {proj.link && <EditableText elementId={`projects.${i}.link`} value={proj.link} onChange={(v) => update(["projects", i, "link"], v)} className="text-[0.7em] break-all" style={{ color: colors.primary }} />}
                    </div>
                    {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="mt-1.5 text-[0.8em] text-gray-600 block leading-[1.6]" />}
                    {proj.technologies && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {String(proj.technologies).split(/[,;]/).map((tech, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded text-[0.65em] font-medium" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
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
            <section className="mb-8">
              <TechHeading title="ADDITIONAL INFO" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-5">
                {additionalInformation.map((proj, i) => (
                  <div key={i} className="rounded p-4" style={{ backgroundColor: colors.light, borderLeft: `3px solid ${colors.primary}` }}>
                    <div className="flex justify-between items-start gap-2">
                      <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      {proj.link && <EditableText elementId={`additionalInformation.${i}.link`} value={proj.link} onChange={(v) => update(["additionalInformation", i, "link"], v)} className="text-[0.7em] break-all" style={{ color: colors.primary }} />}
                    </div>
                    {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="mt-1.5 text-[0.8em] text-gray-600 block leading-[1.6]" />}
                    {Array.isArray(proj.bullets) && proj.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.6]" style={{ color: colors.text }}>
                        {proj.bullets.map((b, bIndex) => (
                          <li key={bIndex}>
                            <EditableText elementId={`additionalInformation.${i}.bullets.${bIndex}`} value={b} onChange={(v) => update(["additionalInformation", i, "bullets", bIndex], v)} />
                          </li>
                        ))}
                      </ul>
                    )}
                    {proj.technologies && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {String(proj.technologies).split(/[,;]/).map((tech, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded text-[0.65em] font-medium" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
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
            <section className="mb-8">
              <TechHeading title="SKILLS" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[0.75em] font-medium border" style={{ borderColor: colors.primary, color: colors.primary }}>
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
            <section className="mb-8">
              <TechHeading title="KEY ACHIEVEMENTS" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[0.75em] font-medium border" style={{ borderColor: colors.primary, color: colors.primary }}>
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
            <section className="mb-8">
              <TechHeading title="CORE SKILLS" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap gap-2">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[0.75em] font-medium border" style={{ borderColor: colors.primary, color: colors.primary }}>
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
            <section className="mb-8">
              <TechHeading title="EDUCATION" sectionId="education" colors={colors} />
              <div className="space-y-4">
                {education.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.text }} />
                      <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8em] block mt-0.5" style={{ color: colors.primary }} />
                      {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="text-[0.75em] text-gray-500 block mt-1" />}
                    </div>
                    <span className="text-[0.7em] font-mono shrink-0 text-gray-400">
                      <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} className="block" />
                      <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} className="block" />
                    </span>
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
            <section className="mb-8">
              <TechHeading title="CERTIFICATIONS" sectionId="certificates" colors={colors} />
              <div className="space-y-2">
                {certificates.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4 text-[0.8125em]">
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="font-semibold" style={{ color: colors.text }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-gray-400 block mt-0.5 text-[0.9em]" />}
                    </div>
                    <EditableText elementId={`certificates.${i}.issueDate`} value={item.issueDate} onChange={(v) => update(["certificates", i, "issueDate"], v)} className="text-gray-400 text-[0.85em] font-mono shrink-0" />
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
            <section className="mb-8">
              <TechHeading title="LANGUAGES" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap gap-3">
                {languages.map((item, i) => (
                  <span key={i} className="text-[0.8125em] px-3 py-1 rounded" style={{ backgroundColor: colors.light, color: colors.text }}>
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-medium" />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400 ml-1" />
                    )}
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "hobbies":
        if (!hobbies.length) return null;
        return (
          <DraggableSection key="hobbies" sectionId="hobbies">
            <section className="mb-8">
              <TechHeading title="INTERESTS" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.8125em] text-gray-500" />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      default: return null;
    }
  };

  return (
    <div className="h-full bg-white" style={{ color: colors.text }}>
      {/* HEADER */}
      {isFirstPage ? (
        <header className="px-12 pt-11 pb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <EditableText elementId="personal.fullname" value={personal.fullname} placeholder="Your Name" onChange={(v) => update(["personal", "fullname"], v)} className="block text-[2.5em] font-black tracking-tight leading-none" style={{ color: colors.text }} />
              <EditableText elementId="personal.title" value={personal.title} placeholder="Your Role" onChange={(v) => update(["personal", "title"], v)} className="mt-2 block text-[0.9375em] font-light" style={{ color: colors.primary }} />
            </div>
            <div className="text-right text-[0.72em] space-y-1 font-mono" style={{ color: colors.muted }}>
              {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} className="block" />}
              {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} className="block" />}
              {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} className="block" />}
              {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} className="block break-all" />}
              {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} className="block break-all" />}
            </div>
          </div>
          <div className="mt-7 h-px" style={{ backgroundColor: colors.border }} />
        </header>
      ) : null}

      <main className="px-12 pb-10">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const TechHeading = ({ title, sectionId, colors }) => (
  <div className="mb-5">
    <h2 className="flex items-center gap-2">
      <span className="font-mono font-bold text-[0.75em]" style={{ color: colors.primary }}>//</span>
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.75em] font-bold tracking-[0.16em]"
        style={{ color: colors.text }}
      />
    </h2>
  </div>
);

export default Template7;
