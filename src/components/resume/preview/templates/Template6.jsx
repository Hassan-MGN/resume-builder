import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import ExperienceBullets from "../editor/ExperienceBullets";
import { useTwoColumnLayout, ColumnZone } from "../editor/MultiContainerDndContext";

/**
 * Template6 — Strategic
 * Category: Highly Professional
 *
 * Layout: 70/30 two-column — wide main (experience, summary, projects)
 * on left, narrow sidebar (contact, skills, education, languages) on right.
 * Sidebar has a light tinted background. Section headings use small-caps
 * style with a square accent marker.
 */

const MAIN_SECTIONS = new Set(["summary", "experience", "projects", "certificates", "keyAchievements"]);
const SIDEBAR_SECTIONS = new Set(["skills", "education", "languages", "hobbies", "coreSkills", "additionalInformation"]);

const Template6 = ({
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
    primary: theme?.primary || "#1d4ed8",
    secondary: theme?.secondary || "#3b82f6",
    text: theme?.text || "#1e293b",
    muted: theme?.muted || "#64748b",
    border: theme?.border || "#dbeafe",
    light: theme?.light || "#eff6ff",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") onResumeChange(path, value);
  };

  const twoCol = useTwoColumnLayout();

  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder : ["summary", "experience", "projects", "certificates", "education", "skills", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"];

  const mainOrder = twoCol
    ? twoCol.columns.left
    : orderedSections.filter(s => MAIN_SECTIONS.has(s));

  const sidebarOrder = twoCol
    ? twoCol.columns.right
    : orderedSections.filter(s => SIDEBAR_SECTIONS.has(s));

  const renderSection = (sectionId, isSidebar) => {
    let content;
    let title;

    switch (sectionId) {
      case "summary":
        if (!(pageData?.summary ?? resume?.summary)) return null;
        title = "PROFILE";
        content = (
          <EditableText elementId="summary" value={pageData?.summary ?? resume?.summary} multiline onChange={(v) => update(["summary"], v)} className="text-[0.875em] leading-[1.7] text-gray-700" />
        );
        break;

      case "experience":
        if (!experience.length) return null;
        title = "EXPERIENCE";
        content = (
          <div className="space-y-6">
            {experience.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-2">
                  <EditableText elementId={`experience.${i}.position`} value={item.position} placeholder="Position" onChange={(v) => update(["experience", i, "position"], v)} className="text-[0.9em] font-bold" style={{ color: colors.primary }} />
                  <span className="text-[0.7em] text-gray-400 shrink-0 font-medium">
                    <EditableText elementId={`experience.${i}.startDate`} value={item.startDate} onChange={(v) => update(["experience", i, "startDate"], v)} />
                    {item.startDate && item.endDate && " – "}
                    <EditableText elementId={`experience.${i}.endDate`} value={item.endDate} onChange={(v) => update(["experience", i, "endDate"], v)} />
                  </span>
                </div>
                <EditableText elementId={`experience.${i}.company`} value={item.company} placeholder="Company" onChange={(v) => update(["experience", i, "company"], v)} className="text-[0.8em] font-semibold text-gray-500 block mt-0.5" />
                {item.description && <EditableText elementId={`experience.${i}.description`} value={item.description} multiline onChange={(v) => update(["experience", i, "description"], v)} className="mt-2 text-[0.8em] leading-[1.65] text-gray-600 block" />}
                <ExperienceBullets item={item} index={(Number.isInteger(item?._globalIndex) ? item._globalIndex : i)} update={update} />
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        if (!projects.length) return null;
        title = "PROJECTS";
        content = (
          <div className="space-y-5">
            {projects.map((proj, i) => (
              <div key={i}>
                <EditableText elementId={`projects.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["projects", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.primary }} />
                {proj.description && <EditableText elementId={`projects.${i}.description`} value={proj.description} multiline onChange={(v) => update(["projects", i, "description"], v)} className="text-[0.8em] text-gray-600 block mt-1 leading-[1.6]" />}
                {proj.technologies && <EditableText elementId={`projects.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["projects", i, "technologies"], v)} className="text-[0.75em] mt-1 block font-medium" style={{ color: colors.secondary }} />}
              </div>
            ))}
          </div>
        );
        break;

      case "additionalInformation":
        if (!additionalInformation.length) return null;
        title = "ADDITIONAL INFO";
        content = (
          <div className="space-y-5">
            {additionalInformation.map((proj, i) => (
              <div key={i}>
                <EditableText elementId={`additionalInformation.${i}.name`} value={proj.name} placeholder="Project" onChange={(v) => update(["additionalInformation", i, "name"], v)} className="text-[0.875em] font-bold" style={{ color: colors.primary }} />
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
                {proj.technologies && <EditableText elementId={`additionalInformation.${i}.technologies`} value={proj.technologies} onChange={(v) => update(["additionalInformation", i, "technologies"], v)} className="text-[0.75em] mt-1 block font-medium" style={{ color: colors.secondary }} />}
              </div>
            ))}
          </div>
        );
        break;

      case "certificates":
        if (!certificates.length) return null;
        title = "CERTIFICATIONS";
        content = (
          <div className="space-y-3">
            {certificates.map((item, i) => (
              <div key={i}>
                <EditableText elementId={`certificates.${i}.name`} value={item.name} onChange={(v) => update(["certificates", i, "name"], v)} className="text-[0.875em] font-semibold" style={{ color: colors.primary }} />
                {item.issuer && <EditableText elementId={`certificates.${i}.issuer`} value={item.issuer} onChange={(v) => update(["certificates", i, "issuer"], v)} className="text-[0.8em] text-gray-500 block mt-0.5" />}
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        if (!skills.length) return null;
        title = "SKILLS";
        content = (
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                <EditableText elementId={`skills.${i}`} value={skill} onChange={(v) => update(["skills", i], v)} className="text-[0.8em] text-gray-700" />
              </div>
            ))}
          </div>
        );
        break;

      case "keyAchievements":
        if (!keyAchievements.length) return null;
        title = "KEY ACHIEVEMENTS";
        content = (
          <div className="space-y-2">
            {keyAchievements.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                <EditableText elementId={`keyAchievements.${i}`} value={skill} onChange={(v) => update(["keyAchievements", i], v)} className="text-[0.8em] text-gray-700" />
              </div>
            ))}
          </div>
        );
        break;

      case "coreSkills":
        if (!coreSkills.length) return null;
        title = "CORE SKILLS";
        content = (
          <div className="space-y-2">
            {coreSkills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                <EditableText elementId={`coreSkills.${i}`} value={skill} onChange={(v) => update(["coreSkills", i], v)} className="text-[0.8em] text-gray-700" />
              </div>
            ))}
          </div>
        );
        break;

      case "education":
        if (!education.length) return null;
        title = "EDUCATION";
        content = (
          <div className="space-y-4">
            {education.map((item, i) => (
              <div key={i}>
                <EditableText elementId={`education.${i}.degree`} value={item.degree} placeholder="Degree" onChange={(v) => update(["education", i, "degree"], v)} className="text-[0.8125em] font-bold block" style={{ color: colors.primary }} />
                <EditableText elementId={`education.${i}.institution`} value={item.institution} placeholder="Institution" onChange={(v) => update(["education", i, "institution"], v)} className="text-[0.75em] text-gray-600 block mt-0.5" />
                <div className="text-[0.7em] text-gray-400 mt-0.5">
                  <EditableText elementId={`education.${i}.startDate`} value={item.startDate} onChange={(v) => update(["education", i, "startDate"], v)} />
                  {item.startDate && item.endDate && " – "}
                  <EditableText elementId={`education.${i}.endDate`} value={item.endDate} onChange={(v) => update(["education", i, "endDate"], v)} />
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "languages":
        if (!languages.length) return null;
        title = "LANGUAGES";
        content = (
          <div className="space-y-2">
            {languages.map((item, i) => (
              <div key={i} className="flex justify-between text-[0.8em]">
                <EditableText elementId={`languages.${i}.language`} value={typeof item === "string" ? item : item.language || item.name} onChange={(v) => update(["languages", i, "language"], v)} className="font-medium text-gray-700" />
                {typeof item !== "string" && (item.proficiency || item.level) && (
                  <EditableText elementId={`languages.${i}.proficiency`} value={item.proficiency || item.level} onChange={(v) => update(["languages", i, "proficiency"], v)} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        );
        break;

      case "hobbies":
        if (!hobbies.length) return null;
        title = "INTERESTS";
        content = (
          <div className="flex flex-wrap gap-1.5">
            {hobbies.map((hobby, i) => (
              <EditableText key={i} elementId={`hobbies.${i}`} value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby} onChange={(v) => update(["hobbies", i], v)} className="text-[0.75em] text-gray-600" />
            ))}
          </div>
        );
        break;

      default: return null;
    }

    if (!content) return null;

    return (
      <DraggableSection key={sectionId} sectionId={sectionId}>
        <section className="mb-7">
          <StratHeading title={title} sectionId={sectionId} colors={colors} sidebar={isSidebar} />
          {content}
        </section>
      </DraggableSection>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col" style={{ color: colors.text }}>
      {/* HEADER */}
      {isFirstPage ? (
        <header className="px-0 shrink-0">
          <div className="flex">
            {/* Main header area */}
            <div className="flex-1 px-10 py-9">
              <EditableText elementId="personal.fullname" value={personal.fullname} placeholder="Your Name" onChange={(v) => update(["personal", "fullname"], v)} className="block text-[2.4em] font-black tracking-tight leading-none" style={{ color: colors.primary }} />
              <EditableText elementId="personal.title" value={personal.title} placeholder="Professional Title" onChange={(v) => update(["personal", "title"], v)} className="mt-2 block text-[0.9em] font-light tracking-[0.14em] uppercase text-gray-500" />
            </div>
            {/* Sidebar header — contact */}
            <div className="w-[220px] shrink-0 px-7 py-9" style={{ backgroundColor: colors.light }}>
              <div className="space-y-2 text-[0.72em]" style={{ color: colors.muted }}>
                {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} className="block break-all" />}
                {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} className="block" />}
                {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} className="block" />}
                {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} className="block break-all" />}
                {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} className="block break-all" />}
              </div>
            </div>
          </div>
          <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${colors.primary} 70%, ${colors.light} 100%)` }} />
        </header>
      ) : null}

      {/* BODY */}
      <div className="flex flex-1">
        {/* MAIN column (left) */}
        <ColumnZone columnId="left" className="flex-1 px-10 py-8">
          {mainOrder.map(id => renderSection(id, false))}
        </ColumnZone>

        {/* SIDEBAR column (right) */}
        <ColumnZone columnId="right" className="w-[220px] shrink-0 px-7 py-8" style={{ backgroundColor: colors.light }}>
          {sidebarOrder.map(id => renderSection(id, true))}
        </ColumnZone>
      </div>
    </div>
  );
};

const StratHeading = ({ title, sectionId, colors, sidebar }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className="w-2.5 h-2.5 rounded inline-block shrink-0" style={{ backgroundColor: colors.primary }} />
    <h2>
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.6em] font-black tracking-[0.22em] uppercase"
        style={{ color: colors.primary }}
      />
    </h2>
  </div>
);

export default Template6;
