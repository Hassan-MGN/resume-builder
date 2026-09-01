import React from "react";
import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import { useTwoColumnLayout, ColumnZone } from "../editor/TwoColumnDndContext";

const Template2 = ({ resume, theme, sectionOrder, onResumeChange }) => {
  const personal = resume?.personal || {};
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const education = Array.isArray(resume?.education) ? resume.education : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const projects = Array.isArray(resume?.projects) ? resume.projects : [];
  const certificates = Array.isArray(resume?.certificates) ? resume.certificates : [];
  const languages = Array.isArray(resume?.languages) ? resume.languages : [];
  const hobbies = Array.isArray(resume?.hobbies) ? resume.hobbies : [];
  const coreSkills = Array.isArray(resume?.coreSkills) ? resume.coreSkills : [];
  const keyAchievements = Array.isArray(resume?.keyAchievements) ? resume.keyAchievements : [];
  const additionalInformation = Array.isArray(resume?.additionalInformation) ? resume.additionalInformation : [];

  const colors = {
    primary: theme?.primary || "#4f46e5",
    secondary: theme?.secondary || "#6366f1",
    text: theme?.text || "#1f2937",
    muted: theme?.muted || "#6b7280",
    light: theme?.light || "#eef2ff",
    border: theme?.border || "#e5e7eb",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") {
      onResumeChange(path, value);
    }
  };

  const SIDEBAR_SECTIONS = new Set(["education", "skills", "certificates", "languages", "hobbies"]);
  const MAIN_SECTIONS = new Set(["summary", "experience", "projects"]);

  const twoCol = useTwoColumnLayout();

  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder : [
    "summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies",
  ];

  // Left column = main content (summary, experience, projects)
  const mainOrder = twoCol
    ? twoCol.columns.left
    : orderedSections.filter(s => MAIN_SECTIONS.has(s));

  // Right column = sidebar content (education, skills, etc.)
  const sidebarOrder = twoCol
    ? twoCol.columns.right
    : orderedSections.filter(s => SIDEBAR_SECTIONS.has(s));

  const renderSection = (sectionId, isSidebar) => {
    let content = null;
    let title = "";

    switch (sectionId) {
      case "summary":
        if (!resume.summary) return null;
        title = "PROFILE";
        content = (
          <EditableText
            elementId="summary"
            value={resume.summary}
            multiline
            onChange={(value) => update(["summary"], value)}
            className="text-[0.875em] leading-[1.6] text-gray-700"
          />
        );
        break;

      case "experience":
        if (!experience.length) return null;
        title = "EXPERIENCE";
        content = (
          <div className="space-y-7">
            {experience.map((item, index) => (
              <article
                key={index}
                className="relative pl-5 border-l-2"
                style={{ borderColor: colors.light }}
              >
                <span
                  className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <div className="flex justify-between gap-4">
                  <div>
                    <EditableText
                      elementId={`experience.${index}.position`}
                      value={item.position}
                      placeholder="Job Position"
                      onChange={(value) => update(["experience", index, "position"], value)}
                      className="text-[0.875em] font-bold text-gray-900 block"
                    />
                    <EditableText
                      elementId={`experience.${index}.company`}
                      value={item.company}
                      placeholder="Company Name"
                      onChange={(value) => update(["experience", index, "company"], value)}
                      className="mt-1 block text-[0.75em] font-semibold"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  {(item.startDate || item.endDate) && (
                    <span className="text-[0.625em] text-gray-400 whitespace-nowrap">
                      <EditableText
                        elementId={`experience.${index}.startDate`}
                        value={item.startDate}
                        onChange={(value) => update(["experience", index, "startDate"], value)}
                      />
                      {item.startDate && item.endDate ? " — " : ""}
                      <EditableText
                        elementId={`experience.${index}.endDate`}
                        value={item.endDate}
                        onChange={(value) => update(["experience", index, "endDate"], value)}
                      />
                    </span>
                  )}
                </div>
                {item.description && (
                  <EditableText
                    elementId={`experience.${index}.description`}
                    value={item.description}
                    multiline
                    onChange={(value) => update(["experience", index, "description"], value)}

                    className="mt-3 text-[0.875em] leading-[1.5] text-gray-700 whitespace-pre-line"
                  />
                )}
              
                {Array.isArray(item.responsibilities) && item.responsibilities.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.5]">
                    {item.responsibilities.map((resp, rIndex) => (
                      <li key={rIndex}>
                        <EditableText
                          elementId={`experience.${index}.responsibilities.${rIndex}`}
                          value={resp}
                          onChange={(value) => update(["experience", index, "responsibilities", rIndex], value)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        );
        break;

      case "projects":
        if (!projects.length) return null;
        title = "PROJECTS";
        content = (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <article key={index}>
                <EditableText
                  elementId={`projects.${index}.name`}
                  value={project.name}
                  placeholder="Project Name"
                  onChange={(value) => update(["projects", index, "name"], value)}
                  className="text-[0.875em] font-bold text-gray-900 block"
                />
                {project.description && (
                  <EditableText
                    elementId={`projects.${index}.description`}
                    value={project.description}
                    multiline
                    onChange={(value) => update(["projects", index, "description"], value)}
                    className="mt-2 block text-[0.875em] leading-[1.5] text-gray-700"
                  />
                )}
                {project.technologies && (
                  <p className="mt-2 text-[0.6875em] text-gray-500">
                    <strong>Technologies:</strong>{" "}
                    <EditableText
                      elementId={`projects.${index}.technologies`}
                      value={project.technologies}
                      onChange={(value) => update(["projects", index, "technologies"], value)}
                    />
                  </p>
                )}
                {project.link && (
                  <EditableText
                    elementId={`projects.${index}.link`}
                    value={project.link}
                    onChange={(value) => update(["projects", index, "link"], value)}
                    className="mt-1 block text-[0.6875em] break-all"
                    style={{ color: colors.primary }}
                  />
                )}
              </article>
            ))}
          </div>
        );
        break;

      case "additionalInformation":
        if (!additionalInformation.length) return null;
        title = "ADDITIONAL INFO";
        content = (
          <div className="space-y-6">
            {additionalInformation.map((item, index) => (
              <article key={index}>
                <EditableText
                  elementId={`additionalInformation.${index}.name`}
                  value={item.heading}
                  placeholder="Project Name"
                  onChange={(value) => update(["additionalInformation", index, "heading"], value)}
                  className="text-[0.875em] font-bold text-gray-900 block"
                />
                {item.content && (
                  <EditableText
                    elementId={`additionalInformation.${index}.description`}
                    value={item.content}
                    multiline
                    onChange={(value) => update(["additionalInformation", index, "content"], value)}
                    className="mt-2 block text-[0.875em] leading-[1.5] text-gray-700"
                  />
                )}
                
                
              
                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.5]">
                    {item.bullets.map((b, bIndex) => (
                      <li key={bIndex}>
                        <EditableText
                          elementId={`additionalInformation.${index}.bullets.${bIndex}`}
                          value={b}
                          onChange={(value) => update(["additionalInformation", index, "bullets", bIndex], value)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        );
        break;

      case "education":
        if (!education.length) return null;
        title = "EDUCATION";
        content = (
          <div className="space-y-6">
            {education.map((item, index) => (
              <article key={index}>
                <EditableText
                  elementId={`education.${index}.degree`}
                  value={item.degree}
                  placeholder="Degree"
                  onChange={(value) => update(["education", index, "degree"], value)}
                  className="text-[0.75em] font-bold text-gray-900 block"
                />
                <EditableText
                  elementId={`education.${index}.institution`}
                  value={item.institution}
                  placeholder="Institution"
                  onChange={(value) => update(["education", index, "institution"], value)}
                  className="mt-1 block text-[0.6875em] font-medium"
                  style={{ color: colors.primary }}
                />
                {(item.startDate || item.endDate) && (
                  <p className="mt-1 text-[0.625em] text-gray-400">
                    <EditableText
                      elementId={`education.${index}.startDate`}
                      value={item.startDate}
                      onChange={(value) => update(["education", index, "startDate"], value)}
                    />
                    {item.startDate && item.endDate ? " — " : ""}
                    <EditableText
                      elementId={`education.${index}.endDate`}
                      value={item.endDate}
                      onChange={(value) => update(["education", index, "endDate"], value)}
                    />
                  </p>
                )}
                {item.description && (
                  <EditableText
                    elementId={`education.${index}.description`}
                    value={item.description}
                    multiline
                    onChange={(value) => update(["education", index, "description"], value)}
                    className="mt-2 block text-[0.625em] leading-[1.4] text-gray-500"
                  />
                )}
              </article>
            ))}
          </div>
        );
        break;

      case "skills":
        if (!skills.length) return null;
        title = "SKILLS";
        content = (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <EditableText
                elementId={`skills.${index}`}
                key={index}
                value={skill}
                onChange={(value) => update(["skills", index], value)}
                className="px-2.5 py-1 rounded-md text-[0.625em] font-medium inline-block"
                style={{ backgroundColor: colors.light, color: colors.primary }}
              />
            ))}
          </div>
        );
        break;

      case "keyAchievements":
        if (!keyAchievements.length) return null;
        title = "KEY ACHIEVEMENTS";
        content = (
          <div className="flex flex-wrap gap-2">
            {keyAchievements.map((skill, index) => (
              <EditableText
                elementId={`keyAchievements.${index}`}
                key={index}
                value={skill}
                onChange={(value) => update(["keyAchievements", index], value)}
                className="px-2.5 py-1 rounded-md text-[0.625em] font-medium inline-block"
                style={{ backgroundColor: colors.light, color: colors.primary }}
              />
            ))}
          </div>
        );
        break;

      case "coreSkills":
        if (!coreSkills.length) return null;
        title = "CORE SKILLS";
        content = (
          <div className="flex flex-wrap gap-2">
            {coreSkills.map((skill, index) => (
              <EditableText
                elementId={`coreSkills.${index}`}
                key={index}
                value={skill}
                onChange={(value) => update(["coreSkills", index], value)}
                className="px-2.5 py-1 rounded-md text-[0.625em] font-medium inline-block"
                style={{ backgroundColor: colors.light, color: colors.primary }}
              />
            ))}
          </div>
        );
        break;

      case "certificates":
        if (!certificates.length) return null;
        title = "CERTIFICATES";
        content = (
          <div className="space-y-5">
            {certificates.map((item, index) => (
              <article key={index}>
                <EditableText
                  elementId={`certificates.${index}.name`}
                  value={item.name}
                  placeholder="Certificate"
                  onChange={(value) => update(["certificates", index, "name"], value)}
                  className="text-[0.75em] font-bold text-gray-900 block"
                />
                {item.issuer && (
                  <EditableText
                    elementId={`certificates.${index}.issuer`}
                    value={item.issuer}
                    onChange={(value) => update(["certificates", index, "issuer"], value)}
                    className="mt-1 block text-[0.6875em] font-medium"
                    style={{ color: colors.primary }}
                  />
                )}
                {(item.issueDate || item.expiryDate) && (
                  <p className="mt-1 text-[0.625em] text-gray-400">
                    <EditableText
                      elementId={`certificates.${index}.issueDate`}
                      value={item.issueDate}
                      onChange={(value) => update(["certificates", index, "issueDate"], value)}
                    />
                    {item.issueDate && item.expiryDate ? " — " : ""}
                    <EditableText
                      elementId={`certificates.${index}.expiryDate`}
                      value={item.expiryDate}
                      onChange={(value) => update(["certificates", index, "expiryDate"], value)}
                    />
                  </p>
                )}
              </article>
            ))}
          </div>
        );
        break;

      case "languages":
        if (!languages.length) return null;
        title = "LANGUAGES";
        content = (
          <div className="space-y-3">
            {languages.map((item, index) => (
              <div key={index}>
                <EditableText
                  elementId={`languages.${index}.language`}
                  value={typeof item === "string" ? item : item.language || item.name}
                  onChange={(value) => update(["languages", index, "language"], value)}
                  className="text-[0.75em] font-semibold text-gray-900 block"
                />
                {typeof item !== "string" && (item.proficiency || item.level) && (
                  <EditableText
                    elementId={`languages.${index}.proficiency`}
                    value={item.proficiency || item.level}
                    onChange={(value) => update(["languages", index, "proficiency"], value)}
                    className="mt-0.5 block text-[0.625em]"
                    style={{ color: colors.secondary }}
                  />
                )}
              </div>
            ))}
          </div>
        );
        break;

      case "hobbies":
        if (!hobbies.length) return null;
        title = "HOBBIES";
        content = (
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <EditableText
                elementId={`hobbies.${index}`}
                key={index}
                value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby}
                onChange={(value) => update(["hobbies", index], value)}
                className="px-2.5 py-1 rounded-md text-[0.625em] font-medium inline-block"
                style={{ backgroundColor: colors.light, color: colors.primary }}
              />
            ))}
          </div>
        );
        break;

      default:
        return null;
    }

    if (!content) return null;

    if (isSidebar) {
      return (
        <SidebarSection key={sectionId} sectionId={sectionId} title={title} colors={colors}>
          {content}
        </SidebarSection>
      );
    }

    return (
      <ResumeSection key={sectionId} sectionId={sectionId} title={title} colors={colors}>
        {content}
      </ResumeSection>
    );
  };

  return (
    <div
      className="w-full h-full bg-white relative overflow-hidden"
      style={{ color: colors.text }}
    >
        {/* TOP ACCENT */}
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
        />

        {/* HEADER */}
        <header className="px-11 py-9">
          <div className="flex justify-between gap-10">
            <div className="flex-1">
              <p
                className="text-[0.625em] font-bold uppercase tracking-[0.28em]"
                style={{ color: colors.primary }}
              >
                Resume
              </p>
              <EditableText
                elementId="personal.fullname"
                value={personal.fullname}
                placeholder="YOUR NAME"
                onChange={(value) => update(["personal", "fullname"], value)}
                className="mt-2 block text-[2.25em] font-extrabold tracking-tight text-gray-900"
              />
              <EditableText
                elementId="personal.title"
                value={personal.title}
                placeholder="Professional Title"
                onChange={(value) => update(["personal", "title"], value)}
                className="mt-2 block text-[0.875em] font-medium"
                style={{ color: colors.secondary }}
              />
            </div>

            <div className="w-52 text-right text-[0.6875em] leading-[1.4] text-gray-500">
              {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} className="block" />}
              {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} className="block" />}
              {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} className="block" />}
              {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} className="block break-all" />}
              {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} className="block break-all" />}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[1fr_235px] border-t border-gray-100">

          {/* MAIN (left column) */}
          <ColumnZone columnId="left" className="p-10">
            {mainOrder.map(id => renderSection(id, false))}

            {/* Links (always shown in main) */}
            {(personal.linkedin || personal.website) && (
              <ResumeSection sectionId="links" title="LINKS" colors={colors}>
                <div className="space-y-2 text-[0.625em] break-all">
                  {personal.linkedin && (
                    <p style={{ color: colors.primary }}>{personal.linkedin}</p>
                  )}
                  {personal.website && (
                    <p style={{ color: colors.primary }}>{personal.website}</p>
                  )}
                </div>
              </ResumeSection>
            )}
          </ColumnZone>

          {/* SIDEBAR (right column) */}
          <ColumnZone columnId="right" className="p-7 bg-gray-50 border-l border-gray-100">
            {sidebarOrder.map(id => renderSection(id, true))}
          </ColumnZone>
      </div>
    </div>
  );
};

const ResumeSection = ({ sectionId, title, children, colors }) => (
  <DraggableSection sectionId={sectionId}>
    <section className="mb-9">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-[0.625em] font-bold tracking-[0.22em]" style={{ color: colors.primary }}>
          <EditableText
            elementId={`heading.${sectionId}`}
            value={title}
            readOnly
            className="text-[0.625em] font-bold tracking-[0.22em]"
            style={{ color: colors.primary }}
          />
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {children}
    </section>
  </DraggableSection>
);

const SidebarSection = ({ sectionId, title, children, colors }) => (
  <DraggableSection sectionId={sectionId}>
    <section className="mb-9">
      <h2
        className="pb-2 mb-5 border-b border-gray-200"
        style={{ color: colors.primary }}
      >
        <EditableText
          elementId={`heading.${sectionId}`}
          value={title}
          readOnly
          className="text-[0.625em] font-bold tracking-[0.22em]"
          style={{ color: colors.primary }}
        />
      </h2>
      {children}
    </section>
  </DraggableSection>
);

export default Template2;
