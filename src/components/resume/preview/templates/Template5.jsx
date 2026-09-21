import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";

/**
 * Template5 — Corporate
 * Category: Highly Professional
 *
 * Layout: Name on left + contact box on right in header,
 * section headings with full-width ruled line,
 * experience as date-right / content-left 2-col grid,
 * skills in a 3-column structured grid.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template5 = ({
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
    primary: theme?.primary || "#0f172a",
    secondary: theme?.secondary || "#334155",
    text: theme?.text || "#1e293b",
    muted: theme?.muted || "#64748b",
    border: theme?.border || "#cbd5e1",
    light: theme?.light || "#f1f5f9",
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
            <section className="mb-7">
              <CorpHeading title="PROFILE SUMMARY" sectionId="summary" colors={colors} />
              <EditableText
                elementId="summary"
                value={pageData?.summary ?? resume?.summary}
                multiline
                onChange={(v) => update(["summary"], v)}
                className="text-[0.875em] leading-[1.7] text-gray-700"
              />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-7">
              <CorpHeading title="WORK EXPERIENCE" sectionId="experience" colors={colors} />
              <div className="space-y-6">
                {experience.map((item, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                    {/* Date column */}
                    <div className="text-right pt-0.5">
                      <div className="text-[0.7em] font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                        <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} placeholder="Start" onChange={(v) => update(["experience", i, "startDate"], v)} className="block" />
                        <span className="text-gray-400 text-[0.9em]">—</span>
                        <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} placeholder="End" onChange={(v) => update(["experience", i, "endDate"], v)} className="block" />
                      </div>
                    </div>
                    {/* Content column */}
                    <div>
                      <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Position" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.9em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8em] font-medium text-gray-500 block mt-0.5" />
                      {item.description && (
                        <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-2 text-[0.8em] leading-[1.65] text-gray-600 block" />
                      )}
                    <ExperienceBullets item={item} index={i} update={update} />
                    </div>
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
              <CorpHeading title="EDUCATION" sectionId="education" colors={colors} />
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                    <div className="text-right text-[0.7em] font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                      <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} className="block" />
                      <span className="text-gray-400">—</span>
                      <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} className="block" />
                    </div>
                    <div>
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8em] text-gray-500 block mt-0.5" />
                      {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="text-[0.75em] text-gray-500 block mt-1" />}
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
              <CorpHeading title="KEY SKILLS" sectionId="skills" colors={colors} />
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.8125em]">
                    
                    <EditableText elementId={`skills.${i}`} value={skill} onChange={(v) => update(["skills", i], v)} className="text-gray-700" />
                  </div>
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
              <CorpHeading title="KEY ACHIEVEMENTS" sectionId="keyAchievements" colors={colors} />
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {keyAchievements.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.8125em]">
                    
                    <EditableText elementId={`keyAchievements.${i}`} value={skill} onChange={(v) => update(["keyAchievements", i], v)} className="text-gray-700" />
                  </div>
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
              <CorpHeading title="CORE SKILLS" sectionId="coreSkills" colors={colors} />
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {coreSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.8125em]">
                    
                    <EditableText elementId={`coreSkills.${i}`} value={skill} onChange={(v) => update(["coreSkills", i], v)} className="text-gray-700" />
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
            <section className="mb-7">
              <CorpHeading title="PROJECTS" sectionId="projects" colors={colors} />
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                    <div className="text-right">
                      {proj.technologies && (
                        <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="text-[0.7em] text-gray-400 block" />
                      )}
                    </div>
                    <div>
                      <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="text-[0.8em] text-gray-600 block mt-1 leading-[1.6]" />}
                    </div>
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
              <CorpHeading title="ADDITIONAL INFO" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-5">
                {additionalInformation.map((proj, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                    <div className="text-right">
                      {proj.technologies && (
                        <EditableText elementId={`additionalInformation.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["additionalInformation", i, "technologies"], v)} className="text-[0.7em] text-gray-400 block" />
                      )}
                    </div>
                    <div>
                      <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="text-[0.8em] text-gray-600 block mt-1 leading-[1.6]" />}
                    {Array.isArray(proj.bullets) && proj.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.6]" style={{ color: colors.text }}>
                        {proj.bullets.map((b, bIndex) => (
                          <li key={bIndex}>
                            <EditableText elementId={`additionalInformation.${i}.bullets.${bIndex}`} value={b} onChange={(v) => update(["additionalInformation", i, "bullets", bIndex], v)} />
                          </li>
                        ))}
                      </ul>
                    )}
                    </div>
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
              <CorpHeading title="CERTIFICATIONS" sectionId="certificates" colors={colors} />
              <div className="space-y-3">
                {certificates.map((item, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                    <EditableText elementId={`certificates.${i}.issueDate`} value={item.issueDate} onChange={(v) => update(["certificates", i, "issueDate"], v)} className="text-[0.7em] text-gray-400 text-right block" />
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold block" style={{ color: colors.primary }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8em] text-gray-500 block mt-0.5" />}
                    </div>
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
              <CorpHeading title="LANGUAGES" sectionId="languages" colors={colors} />
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {languages.map((item, i) => (
                  <div key={i} className="text-[0.8125em]">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" style={{ color: colors.primary }} />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400 ml-1" />
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
              <CorpHeading title="INTERESTS" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.8125em] text-gray-600" />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-white" style={{ color: colors.text }}>
      {/* HEADER — Name left, contact right */}
      {isFirstPage ? (
        <header className="px-12 pt-10 pb-7">
          <div className="flex justify-between items-start gap-8">
            <div>
              <EditableText
                elementId="personal.fullname"
                value={personal.fullname}
                placeholder="Your Name"
                onChange={(v) => update(["personal", "fullname"], v)}
                className="block text-[2.5em] font-black tracking-tight leading-none"
                style={{ color: colors.primary }}
              />
              <EditableText
                elementId="personal.title"
                value={personal.title}
                placeholder="Professional Title"
                onChange={(v) => update(["personal", "title"], v)}
                className="mt-2 block text-[0.9375em] font-light tracking-wider uppercase"
                style={{ color: colors.secondary }}
              />
            </div>

            {/* Contact box */}
            <div className="text-right text-[0.75em] space-y-1 pt-1 shrink-0" style={{ color: colors.muted }}>
              {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} className="block" />}
              {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} className="block" />}
              {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} className="block" />}
              {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} className="block" />}
              {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} className="block" />}
            </div>
          </div>
          {/* Full-width thick ruled separator */}
          <div className="mt-7 h-[3px]" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.border})` }} />
        </header>
      ) : (
        /* Continuation strip */
        <div className="px-12 py-3 flex items-center justify-between" style={{ borderBottom: `3px solid ${colors.primary}` }}>
          <EditableText elementId="personal.fullname" value={personal.fullname} readOnly className="text-[0.875em] font-bold tracking-tight" style={{ color: colors.primary }} />
          <EditableText elementId="personal.title" value={personal.title} readOnly className="text-[0.6875em] uppercase tracking-[0.15em]" style={{ color: colors.muted }} />
        </div>
      )}

      <main className="px-12 pb-10">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const CorpHeading = ({ title, sectionId, colors }) => (
  <div className="mb-4 flex items-center gap-3">
    <h2>
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.625em] font-black tracking-[0.28em] uppercase"
        style={{ color: colors.primary }}
      />
    </h2>
    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
  </div>
);

export default Template5;
