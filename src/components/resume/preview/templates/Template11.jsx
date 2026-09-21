import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";

/**
 * Template11 — Classic
 * Category: Simple & Elegant
 *
 * Layout: Traditional ATS-friendly chronological resume.
 * Bold name + ruled separator at top, bold ruled section headings,
 * compact density, purely black & gray, no decorative colors.
 * Clean, timeless, universally readable.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template11 = ({
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

  // Classic uses accent color only for name, all other text is neutral
  const colors = {
    primary: theme?.primary || "#111827",
    secondary: theme?.secondary || "#374151",
    text: theme?.text || "#111827",
    muted: theme?.muted || "#6b7280",
    border: theme?.border || "#9ca3af",
    light: theme?.light || "#f9fafb",
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
            <section className="mb-5">
              <ClassicHeading title="SUMMARY" sectionId="summary" colors={colors} />
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

      case "coreSkills":
        if (!coreSkills.length) return null;
        return (
          <DraggableSection key="coreSkills" sectionId="coreSkills">
            <section className="mb-5">
              <ClassicHeading title="CORE SKILLS" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="text-[0.8125em] text-gray-700 flex items-center gap-1">
                    {i > 0 && <span className="text-gray-400">·</span>}
                    <EditableText elementId={`coreSkills.${i}`} value={skill} onChange={(v) => update(["coreSkills", i], v)} />
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
            <section className="mb-5">
              <ClassicHeading title="KEY ACHIEVEMENTS" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="text-[0.8125em] text-gray-700 flex items-center gap-1">
                    {i > 0 && <span className="text-gray-400">·</span>}
                    <EditableText elementId={`keyAchievements.${i}`} value={skill} onChange={(v) => update(["keyAchievements", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-5">
              <ClassicHeading title="WORK EXPERIENCE" sectionId="experience" colors={colors} />
              <div className="space-y-5">
                {experience.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline gap-2">
                      <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Position" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      <span className="text-[0.75em] shrink-0" style={{ color: colors.muted }}>
                        <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} />
                        {item.startDate && item.endDate && " – "}
                        <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} />
                      </span>
                    </div>
                    <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8125em] italic block mt-0.5" style={{ color: colors.secondary }} />
                    {item.description && (
                      <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-1.5 text-[0.8125em] leading-[1.65] text-gray-600 block" />
                    )}
                    <ExperienceBullets item={item} index={i} update={update} />
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
            <section className="mb-5">
              <ClassicHeading title="EDUCATION" sectionId="education" colors={colors} />
              <div className="space-y-4">
                {education.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline gap-2">
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      <span className="text-[0.75em] shrink-0" style={{ color: colors.muted }}>
                        <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} />
                        {item.startDate && item.endDate && " – "}
                        <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} />
                      </span>
                    </div>
                    <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8125em] italic block mt-0.5" style={{ color: colors.secondary }} />
                    {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="text-[0.75em] text-gray-500 block mt-1" />}
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
            <section className="mb-5">
              <ClassicHeading title="SKILLS" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {skills.map((skill, i) => (
                  <span key={i} className="text-[0.8125em] text-gray-700 flex items-center gap-1">
                    {i > 0 && <span className="text-gray-400">·</span>}
                    <EditableText elementId={`skills.${i}`} value={skill} onChange={(v) => update(["skills", i], v)} />
                  </span>
                ))}
              </div>
            </section>
          </DraggableSection>
        );



      case "certificates":
        if (!certificates.length) return null;
        return (
          <DraggableSection key="certificates" sectionId="certificates">
            <section className="mb-5">
              <ClassicHeading title="CERTIFICATIONS" sectionId="certificates" colors={colors} />
              <div className="space-y-2">
                {certificates.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4 text-[0.8125em]">
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="font-semibold" style={{ color: colors.text }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-gray-500 italic block mt-0.5 text-[0.9em]" />}
                    </div>
                    <EditableText elementId={`certificates.${i}.issueDate`} value={item.issueDate} onChange={(v) => update(["certificates", i, "issueDate"], v)} className="text-gray-400 shrink-0 text-[0.9em]" />
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
            <section className="mb-5">
              <ClassicHeading title="LANGUAGES" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {languages.map((item, i) => (
                  <span key={i} className="text-[0.8125em] text-gray-700">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400 ml-1 italic" />
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
            <section className="mb-5">
              <ClassicHeading title="INTERESTS" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.8125em] text-gray-600" />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "projects":
        if (!projects.length) return null;
        return (
          <DraggableSection key="projects" sectionId="projects">
            <section className="mb-5">
              <ClassicHeading title="PROJECTS" sectionId="projects" colors={colors} />
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2">
                      <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      {proj.link && <EditableText elementId={`projects.${i}.link`} value={proj.link} onChange={(v) => update(["projects", i, "link"], v)} className="text-[0.7em] text-gray-400 break-all shrink-0" />}
                    </div>
                    {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="mt-1 text-[0.8125em] text-gray-600 block leading-[1.65]" />}
                    {proj.technologies && <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="text-[0.75em] text-gray-500 italic block mt-0.5" />}
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
            <section className="mb-5">
              <ClassicHeading title="ADDITIONAL INFO" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-4">
                {additionalInformation.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2">
                      <EditableText elementId={`additionalInformation.${i}.name`} value={item.name} placeholder="Info Name" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.text }} />
                      <EditableText elementId={`additionalInformation.${i}.link`} value={item.link} placeholder="Link" onChange={(v) => update(["additionalInformation", i, "link"], v)} className="text-[0.7em] text-gray-400 break-all shrink-0" />
                    </div>
                    {item.description && <EditableText elementId={`additionalInformation.${i}.description`} value={item.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="mt-1 text-[0.8125em] text-gray-600 block leading-[1.65]" />}
                    {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-4 text-[0.8125em] text-gray-600 leading-[1.65]">
                        {item.bullets.map((b, bIndex) => (
                          <li key={bIndex}>
                            <EditableText elementId={`additionalInformation.${i}.bullets.${bIndex}`} value={b} onChange={(v) => update(["additionalInformation", i, "bullets", bIndex], v)} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      default: return null;
    }
  };

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="h-full bg-white" style={{ color: colors.text }}>
      {/* CLASSIC HEADER */}
      {isFirstPage ? (
        <header className="px-12 pt-10 pb-5 text-center">
          <EditableText
            elementId="personal.fullname"
            value={personal.fullname}
            placeholder="YOUR NAME"
            onChange={(v) => update(["personal", "fullname"], v)}
            className="block text-[2.25em] font-extrabold tracking-[0.06em] uppercase leading-none"
            style={{ color: colors.primary }}
          />
          <EditableText
            elementId="personal.title"
            value={personal.title}
            placeholder="Professional Title"
            onChange={(v) => update(["personal", "title"], v)}
            className="mt-1.5 block text-[0.875em] tracking-wider"
            style={{ color: colors.secondary }}
          />

          {/* Ruled separator */}
          <div className="my-3 border-t-2 border-b border-gray-800 pt-px" />

          {/* Contact inline row */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[0.75em]" style={{ color: colors.muted }}>
            {contactItems.map((val, idx) => (
              <span key={idx} className="flex items-center gap-4">
                {idx > 0 && <span className="text-gray-300">|</span>}
                <EditableText
                  elementId={Object.entries(personal).find(([, v]) => v === val)?.[0] ? `personal.${Object.entries(personal).find(([, v]) => v === val)?.[0]}` : `personal.extra${idx}`}
                  value={val}
                  onChange={(v) => {
                    const key = Object.entries(personal).find(([, pv]) => pv === val)?.[0];
                    if (key) update(["personal", key], v);
                  }}
                />
              </span>
            ))}
          </div>
        </header>
      ) : null}

      <main className="px-12 pb-10">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const ClassicHeading = ({ title, sectionId, colors }) => (
  <div className="mb-3">
    <div className="flex items-center gap-0">
      <h2 className="shrink-0">
        <EditableText
          elementId={`heading.${sectionId}`}
          value={title}
          readOnly
          className="text-[0.8125em] font-extrabold tracking-[0.12em]"
          style={{ color: colors.text }}
        />
      </h2>
    </div>
    <div className="border-t-2 mt-1" style={{ borderColor: colors.text }} />
  </div>
);

export default Template11;
