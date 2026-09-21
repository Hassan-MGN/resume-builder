import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";

/**
 * Template9 — Elegant
 * Category: Simple & Elegant
 *
 * Layout: Centered header with serif-style typography,
 * contact details in a centered row with decorative separators,
 * double-rule section dividers, indented experience entries.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template9 = ({
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
    primary: theme?.primary || "#374151",
    secondary: theme?.secondary || "#6b7280",
    text: theme?.text || "#111827",
    muted: theme?.muted || "#9ca3af",
    border: theme?.border || "#d1d5db",
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
            <section className="mb-8">
              <ElegantHeading title="Profile" sectionId="summary" colors={colors} />
              <EditableText elementId="summary" value={pageData?.summary ?? resume?.summary} multiline onChange={(v) => update(["summary"], v)} className="text-[0.9em] leading-[1.85] text-gray-600 text-center px-8" />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-8">
              <ElegantHeading title="Experience" sectionId="experience" colors={colors} />
              <div className="space-y-7">
                {experience.map((item, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-6">
                    <div className="text-right text-[0.75em] leading-[1.5] pt-0.5" style={{ color: colors.muted }}>
                      <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} className="block" />
                      {item.startDate && item.endDate && <span className="block text-gray-300">—</span>}
                      <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} className="block" />
                    </div>
                    <div>
                      <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Position" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.9em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8em] italic block mt-0.5" style={{ color: colors.secondary }} />
                      {item.description && <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-2 text-[0.8em] leading-[1.7] text-gray-600 block" />}
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
            <section className="mb-8">
              <ElegantHeading title="Education" sectionId="education" colors={colors} />
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-6">
                    <div className="text-right text-[0.75em]" style={{ color: colors.muted }}>
                      <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} className="block" />
                      <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} className="block" />
                    </div>
                    <div>
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8em] italic block mt-0.5" style={{ color: colors.secondary }} />
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
            <section className="mb-8">
              <ElegantHeading title="Skills" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-2 text-[0.85em] text-gray-600">
                    {i > 0 && <span className="text-gray-300 text-xs">✦</span>}
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
              <ElegantHeading title="Key Achievements" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="flex items-center gap-2 text-[0.85em] text-gray-600">
                    {i > 0 && <span className="text-gray-300 text-xs">✦</span>}
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
              <ElegantHeading title="Core Skills" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-2 text-[0.85em] text-gray-600">
                    {i > 0 && <span className="text-gray-300 text-xs">✦</span>}
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
            <section className="mb-8">
              <ElegantHeading title="Projects" sectionId="projects" colors={colors} />
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-6">
                    <div className="text-right text-[0.7em]" style={{ color: colors.muted }}>
                      {proj.technologies && <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="block italic" />}
                    </div>
                    <div>
                      <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="mt-1.5 text-[0.8em] text-gray-600 block leading-[1.7]" />}
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
            <section className="mb-8">
              <ElegantHeading title="Additional Info" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-5">
                {additionalInformation.map((proj, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-6">
                    <div className="text-right text-[0.7em]" style={{ color: colors.muted }}>
                      {proj.technologies && <EditableText elementId={`additionalInformation.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["additionalInformation", i, "technologies"], v)} className="block italic" />}
                    </div>
                    <div>
                      <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="mt-1.5 text-[0.8em] text-gray-600 block leading-[1.7]" />}
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
            <section className="mb-8">
              <ElegantHeading title="Certifications" sectionId="certificates" colors={colors} />
              <div className="space-y-3 text-center">
                {certificates.map((item, i) => (
                  <div key={i}>
                    <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold" style={{ color: colors.primary }} />
                    {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8em] italic text-gray-500 block mt-0.5" />}
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
              <ElegantHeading title="Languages" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-1.5">
                {languages.map((item, i) => (
                  <div key={i} className="text-center text-[0.85em]">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" style={{ color: colors.primary }} />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400 block text-[0.9em] italic" />
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
            <section className="mb-8">
              <ElegantHeading title="Interests" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
                {hobbies.map((hobby, i) => (
                  <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.85em] text-gray-500 italic" />
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
    <div className="h-full bg-white" style={{ color: colors.text }}>
      {/* CENTERED HEADER */}
      {isFirstPage ? (
        <header className="px-14 pt-12 pb-8 text-center">
          <EditableText
            elementId="personal.fullname"
            value={personal.fullname}
            placeholder="Your Name"
            onChange={(v) => update(["personal", "fullname"], v)}
            className="block text-[2.75em] font-bold tracking-[0.04em] leading-none"
            style={{ color: colors.primary, fontFamily: "Georgia, serif" }}
          />
          <EditableText
            elementId="personal.title"
            value={personal.title}
            placeholder="Professional Title"
            onChange={(v) => update(["personal", "title"], v)}
            className="mt-2 block text-[0.9375em] italic font-light"
            style={{ color: colors.secondary }}
          />
          {/* Decorative double rule */}
          <div className="my-4 flex flex-col items-center gap-0.5">
            <div className="h-px w-40" style={{ backgroundColor: colors.border }} />
            <div className="h-px w-40" style={{ backgroundColor: colors.muted, opacity: 0.3 }} />
          </div>
          {/* Contact row */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[0.75em]" style={{ color: colors.muted }}>
            {contactItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-3">
                {idx > 0 && <span className="text-gray-300">✦</span>}
                <EditableText elementId={`personal.${item.key}`} value={item.val} onChange={(v) => update(["personal", item.key], v)} />
              </span>
            ))}
          </div>
        </header>
      ) : null}

      <main className="px-14 pb-12">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const ElegantHeading = ({ title, sectionId, colors }) => (
  <div className="mb-6 text-center">
    <div className="flex items-center justify-center gap-3">
      <div className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      <h2>
        <EditableText
          elementId={`heading.${sectionId}`}
          value={title}
          readOnly
          className="text-[0.75em] uppercase tracking-[0.25em] font-semibold px-2"
          style={{ color: colors.primary, fontFamily: "Georgia, serif" }}
        />
      </h2>
      <div className="h-px flex-1" style={{ backgroundColor: colors.border }} />
    </div>
    <div className="flex items-center justify-center gap-3 mt-px">
      <div className="h-px flex-1 opacity-30" style={{ backgroundColor: colors.muted }} />
      <div className="w-1 h-px" />
      <div className="h-px flex-1 opacity-30" style={{ backgroundColor: colors.muted }} />
    </div>
  </div>
);

export default Template9;
