import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";

/**
 * Template4 — Executive
 * Category: Highly Professional
 *
 * Layout: Full-width dark header band, single-column body,
 * thick left-border accent on experience entries,
 * uppercase section headings with short colored underline.
 */

const ALL_SECTIONS = ["summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

const Template4 = ({
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
    primary: theme?.primary || "#1e293b",
    secondary: theme?.secondary || "#475569",
    text: theme?.text || "#1e293b",
    muted: theme?.muted || "#64748b",
    border: theme?.border || "#e2e8f0",
    light: theme?.light || "#f8fafc",
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
              <ExecHeading title="EXECUTIVE PROFILE" sectionId="summary" colors={colors} />
              <EditableText
                elementId="summary"
                value={pageData?.summary ?? resume?.summary}
                multiline
                onChange={(v) => update(["summary"], v)}
                className="text-[0.875em] leading-[1.75] text-gray-700"
              />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mb-8">
              <ExecHeading title="PROFESSIONAL EXPERIENCE" sectionId="experience" colors={colors} />
              <div className="space-y-7">
                {experience.map((item, i) => (
                  <div key={i} className="pl-4" style={{ borderLeft: `3px solid ${colors.primary}` }}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <EditableText
                          elementId={`experience.${i}.position`}
                          value={item.position}
                          placeholder="Position"
                          onChange={(v) => update(["experience", i, "position"], v)}
                          className="text-[0.9375em] font-bold block"
                          style={{ color: colors.primary }}
                        />
                        <EditableText
                          elementId={`experience.${i}.company`}
                          value={item.company}
                          placeholder="Company"
                          onChange={(v) => update(["experience", i, "company"], v)}
                          className="text-[0.8125em] font-semibold text-gray-600 block mt-0.5"
                        />
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[0.75em] font-medium px-2 py-0.5 rounded text-white inline-block" style={{ backgroundColor: colors.secondary }}>
                          <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} placeholder="Start" onChange={(v) => update(["experience", i, "startDate"], v)} />
                          {item.startDate && item.endDate && " – "}
                          <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} placeholder="End" onChange={(v) => update(["experience", i, "endDate"], v)} />
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <EditableText
                        elementId={`experience.${i}.description`}
                        value={item.description}
                        multiline
                        onChange={(v) => update(["experience", i, "description"], v)}
                        className="mt-2 text-[0.8125em] leading-[1.65] text-gray-600 block"
                      />
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
            <section className="mb-8">
              <ExecHeading title="EDUCATION" sectionId="education" colors={colors} />
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                      <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.8125em] text-gray-600 block mt-0.5" />
                      {item.description && <EditableText elementId={`education.${i}.description`} value={item.description} multiline onChange={(v) => update(["education", i, "description"], v)} className="text-[0.75em] text-gray-500 block mt-1" />}
                    </div>
                    <div className="text-right shrink-0 text-[0.75em] text-gray-500">
                      <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} />
                      {item.startDate && item.endDate && " – "}
                      <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} />
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
              <ExecHeading title="CORE COMPETENCIES" sectionId="skills" colors={colors} />
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[0.8125em]" style={{ color: colors.text }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: colors.primary }} />
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
              <ExecHeading title="KEY ACHIEVEMENTS" sectionId="keyAchievements" colors={colors} />
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {keyAchievements.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[0.8125em]" style={{ color: colors.text }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: colors.primary }} />
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
              <ExecHeading title="CORE SKILLS" sectionId="coreSkills" colors={colors} />
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {coreSkills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[0.8125em]" style={{ color: colors.text }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: colors.primary }} />
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
              <ExecHeading title="KEY PROJECTS" sectionId="projects" colors={colors} />
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i} className="pl-4" style={{ borderLeft: `3px solid ${colors.border}` }}>
                    <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                    {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="text-[0.8125em] text-gray-600 block mt-1 leading-[1.6]" />}
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
            <section className="mb-8">
              <ExecHeading title="ADDITIONAL INFO" sectionId="additionalInformation" colors={colors} />
              <div className="space-y-5">
                {additionalInformation.map((proj, i) => (
                  <div key={i} className="pl-4" style={{ borderLeft: `3px solid ${colors.border}` }}>
                    <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold block" style={{ color: colors.primary }} />
                    {proj.description && <EditableText elementId={`additionalInformation.${i}.description`} value={proj.description} multiline onChange={(v) => update(["additionalInformation", i, "description"], v)} className="text-[0.8125em] text-gray-600 block mt-1 leading-[1.6]" />}
                    {Array.isArray(proj.bullets) && proj.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.6]" style={{ color: colors.text }}>
                        {proj.bullets.map((b, bIndex) => (
                          <li key={bIndex}>
                            <EditableText elementId={`additionalInformation.${i}.bullets.${bIndex}`} value={b} onChange={(v) => update(["additionalInformation", i, "bullets", bIndex], v)} />
                          </li>
                        ))}
                      </ul>
                    )}
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
            <section className="mb-8">
              <ExecHeading title="CERTIFICATIONS" sectionId="certificates" colors={colors} />
              <div className="space-y-3">
                {certificates.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold block" style={{ color: colors.primary }} />
                      {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8125em] text-gray-500 block mt-0.5" />}
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
            <section className="mb-8">
              <ExecHeading title="LANGUAGES" sectionId="languages" colors={colors} />
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {languages.map((item, i) => (
                  <div key={i} className="text-[0.8125em]">
                    <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-semibold" style={{ color: colors.primary }} />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-500 ml-1" />
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
              <ExecHeading title="INTERESTS" sectionId="hobbies" colors={colors} />
              <div className="flex flex-wrap gap-2">
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

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="h-full bg-white" style={{ color: colors.text }}>
      {isFirstPage ? (
        <header className="px-14 py-10" style={{ backgroundColor: colors.primary }}>
          <EditableText
            elementId="personal.fullname"
            value={personal.fullname}
            placeholder="YOUR NAME"
            onChange={(v) => update(["personal", "fullname"], v)}
            className="block text-[2.75em] font-extrabold tracking-tight text-white leading-none"
          />
          <EditableText
            elementId="personal.title"
            value={personal.title}
            placeholder="Executive Title"
            onChange={(v) => update(["personal", "title"], v)}
            className="mt-2 block text-[1em] font-light tracking-[0.18em] uppercase"
            style={{ color: `${colors.secondary}cc` }}
          />
          {/* Contact row */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
            {contactItems.map((val, i) => (
              <span key={i} className="text-[0.75em] text-white/70 flex items-center gap-2">
                {i > 0 && <span className="text-white/30">|</span>}
                <EditableText
                  elementId={Object.entries(personal).find(([, v]) => v === val)?.[0] === "email" ? "personal.email" : Object.entries(personal).find(([, v]) => v === val)?.[0] === "phone" ? "personal.phone" : Object.entries(personal).find(([, v]) => v === val)?.[0] === "location" ? "personal.location" : Object.entries(personal).find(([, v]) => v === val)?.[0] === "linkedin" ? "personal.linkedin" : "personal.website"}
                  value={val}
                  onChange={(v) => {
                    const key = Object.entries(personal).find(([, pv]) => pv === val)?.[0];
                    if (key) update(["personal", key], v);
                  }}
                  className="text-white/70"
                />
              </span>
            ))}
          </div>
        </header>
      ) : (
        /* Continuation strip */
        <div className="px-14 py-3 flex items-center justify-between border-b" style={{ backgroundColor: colors.primary, borderColor: `${colors.secondary}60` }}>
          <EditableText elementId="personal.fullname" value={personal.fullname} readOnly className="text-[0.875em] font-bold text-white tracking-wide" />
          <EditableText elementId="personal.title" value={personal.title} readOnly className="text-[0.6875em] uppercase tracking-[0.15em] text-white/60" />
        </div>
      )}

      {/* BODY */}
      <main className="px-14 py-10">
        {orderedSections.map(renderSection)}
      </main>
    </div>
  );
};

const ExecHeading = ({ title, sectionId, colors }) => (
  <div className="mb-5">
    <h2 className="text-[0.6875em] font-extrabold tracking-[0.22em]" style={{ color: colors.primary }}>
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.6875em] font-extrabold tracking-[0.22em]"
        style={{ color: colors.primary }}
      />
    </h2>
    <div className="mt-1.5 h-[2px] w-12" style={{ backgroundColor: colors.primary }} />
    <div className="mt-1 h-px w-full" style={{ backgroundColor: colors.border }} />
  </div>
);

export default Template4;
