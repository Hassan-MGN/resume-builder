import React from "react";
import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";
import { useTwoColumnLayout, ColumnZone } from "../editor/TwoColumnDndContext";

// Default column sets — used as fallback when no TwoColumnDndContext is present
const SIDEBAR_SECTIONS = new Set(["education", "skills", "certificates", "languages", "hobbies"]);
const MAIN_SECTIONS   = new Set(["summary", "experience", "projects"]);

const Template1 = ({
  resume,
  theme,
  sectionOrder,
  onResumeChange,
}) => {
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
    primary: theme?.primary || "#172033",
    secondary: theme?.secondary || "#64748b",
    text: theme?.text || "#1f2937",
    muted: theme?.muted || "#64748b",
    border: theme?.border || "#e2e8f0",
    sidebarText: "#f8fafc",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") {
      onResumeChange(path, value);
    }
  };

  // Two-column layout: use live context columns when inside TwoColumnDndContext,
  // fall back to filtering sectionOrder for thumbnail/static renders.
  const twoCol = useTwoColumnLayout();

  const orderedSections = Array.isArray(sectionOrder) ? sectionOrder : [
    "summary", "experience", "projects", "education", "skills", "certificates", "languages", "hobbies",
  ];

  const sidebarOrder = twoCol
    ? twoCol.columns.left
    : orderedSections.filter(s => SIDEBAR_SECTIONS.has(s));

  const mainOrder = twoCol
    ? twoCol.columns.right
    : orderedSections.filter(s => MAIN_SECTIONS.has(s));

  const renderSection = (sectionId, isSidebar) => {
    let content = null;
    let title = "";

    switch (sectionId) {
      case "education":
        if (!education.length) return null;
        title = "EDUCATION";
        content = (
          <>
            {education.map((item, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <EditableText
                  elementId={`education.${index}.degree`}
                  value={item.degree}
                  placeholder="Degree"
                  onChange={(value) => update(["education", index, "degree"], value)}
                  className="text-[0.875em] font-semibold leading-[1.4]"
                />
                <EditableText
                  elementId={`education.${index}.institution`}
                  value={item.institution}
                  placeholder="Institution"
                  onChange={(value) => update(["education", index, "institution"], value)}
                  className="mt-1 block text-[0.75em] opacity-70"
                />
                {(item.startDate || item.endDate) && (
                  <div className="mt-1 text-[0.6875em] opacity-50">
                    <EditableText
                      elementId={`education.${index}.startDate`}
                      value={item.startDate}
                      placeholder="Start"
                      onChange={(value) => update(["education", index, "startDate"], value)}
                    />
                    {item.startDate && item.endDate && " — "}
                    <EditableText
                      elementId={`education.${index}.endDate`}
                      value={item.endDate}
                      placeholder="End"
                      onChange={(value) => update(["education", index, "endDate"], value)}
                    />
                  </div>
                )}
                {item.description && (
                  <EditableText
                    elementId={`education.${index}.description`}
                    value={item.description}
                    multiline
                    onChange={(value) => update(["education", index, "description"], value)}
                    className="mt-2 text-[0.6875em] leading-[1.4] opacity-70"
                  />
                )}
              </div>
            ))}
          </>
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
                className="rounded-md px-2.5 py-1 text-[0.6875em] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
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
                className="rounded-md px-2.5 py-1 text-[0.6875em] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
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
                className="rounded-md px-2.5 py-1 text-[0.6875em] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              />
            ))}
          </div>
        );
        break;

      case "certificates":
        if (!certificates.length) return null;
        title = "CERTIFICATES";
        content = (
          <>
            {certificates.map((certificate, index) => (
              <div key={index} className="mb-5 last:mb-0">
                <EditableText
                  elementId={`certificates.${index}.name`}
                  value={certificate.name}
                  placeholder="Certificate"
                  onChange={(value) => update(["certificates", index, "name"], value)}
                  className="text-[0.875em] font-semibold leading-[1.4]"
                />
                <EditableText
                  elementId={`certificates.${index}.issuer`}
                  value={certificate.issuer}
                  placeholder="Issuer"
                  onChange={(value) => update(["certificates", index, "issuer"], value)}
                  className="mt-1 block text-[0.75em] opacity-70"
                />
                {(certificate.issueDate || certificate.expiryDate) && (
                  <div className="mt-1 text-[0.625em] opacity-50">
                    <EditableText
                      elementId={`certificates.${index}.issueDate`}
                      value={certificate.issueDate}
                      placeholder="Issue date"
                      onChange={(value) => update(["certificates", index, "issueDate"], value)}
                    />
                    {certificate.issueDate && certificate.expiryDate && " — "}
                    <EditableText
                      elementId={`certificates.${index}.expiryDate`}
                      value={certificate.expiryDate}
                      placeholder="Expiry"
                      onChange={(value) => update(["certificates", index, "expiryDate"], value)}
                    />
                  </div>
                )}
                {certificate.credentialId && (
                  <div className="mt-1 text-[0.625em] opacity-50">
                    ID:{" "}
                    <EditableText
                      elementId={`certificates.${index}.credentialId`}
                      value={certificate.credentialId}
                      onChange={(value) => update(["certificates", index, "credentialId"], value)}
                    />
                  </div>
                )}
                {certificate.credentialUrl && (
                  <EditableText
                    elementId={`certificates.${index}.credentialUrl`}
                    value={certificate.credentialUrl}
                    onChange={(value) => update(["certificates", index, "credentialUrl"], value)}
                    className="mt-1 block break-all text-[0.625em] opacity-60"
                  />
                )}
              </div>
            ))}
          </>
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
                  value={item.language}
                  placeholder="Language"
                  onChange={(value) => update(["languages", index, "language"], value)}
                  className="text-[0.75em] font-semibold"
                />
                <EditableText
                  elementId={`languages.${index}.proficiency`}
                  value={item.proficiency}
                  placeholder="Proficiency"
                  onChange={(value) => update(["languages", index, "proficiency"], value)}
                  className="mt-0.5 block text-[0.625em] opacity-60"
                />
              </div>
            ))}
          </div>
        );
        break;

      case "hobbies":
        if (!hobbies.length) return null;
        title = "HOBBIES & INTERESTS";
        content = (
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <EditableText
                elementId={`hobbies.${index}`}
                key={index}
                value={hobby}
                onChange={(value) => update(["hobbies", index], value)}
                className="rounded-md px-2.5 py-1 text-[0.625em]"
                style={{
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              />
            ))}
          </div>
        );
        break;

      case "summary":
        if (!resume.summary) return null;
        title = "PROFILE";
        content = (
          <EditableText
            elementId="summary"
            value={resume.summary}
            multiline
            onChange={(value) => update(["summary"], value)}
            className="text-[0.875em] leading-[1.6]"
          />
        );
        break;

      case "experience":
        if (!experience.length) return null;
        title = "EXPERIENCE";
        content = (
          <div className="space-y-7">
            {experience.map((item, index) => (
              <article key={index}>
                <div className="flex justify-between gap-5">
                  <div>
                    <EditableText
                      elementId={`experience.${index}.position`}
                      value={item.position}
                      placeholder="Job Position"
                      onChange={(value) => update(["experience", index, "position"], value)}
                      className="text-[1em] font-bold"
                      style={{ color: colors.primary }}
                    />
                    <EditableText
                      elementId={`experience.${index}.company`}
                      value={item.company}
                      placeholder="Company Name"
                      onChange={(value) => update(["experience", index, "company"], value)}
                      className="mt-1 block text-[0.875em] font-medium"
                      style={{ color: colors.secondary }}
                    />
                  </div>
                  <div
                    className="text-[0.6875em] font-medium whitespace-nowrap"
                    style={{ color: colors.muted }}
                  >
                    <EditableText
                      elementId={`experience.${index}.startDate`}
                      value={item.startDate}
                      placeholder="Start"
                      onChange={(value) => update(["experience", index, "startDate"], value)}
                    />
                    {item.startDate && item.endDate && " — "}
                    <EditableText
                      elementId={`experience.${index}.endDate`}
                      value={item.endDate}
                      placeholder="End"
                      onChange={(value) => update(["experience", index, "endDate"], value)}
                    />
                  </div>
                </div>
                {item.description && (
                  <EditableText
                    elementId={`experience.${index}.description`}
                    value={item.description}
                    multiline
                    onChange={(value) => update(["experience", index, "description"], value)}

                    className="mt-3 text-[0.875em] leading-[1.5] whitespace-pre-line"
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
                <div className="flex justify-between gap-4">
                  <EditableText
                    elementId={`projects.${index}.name`}
                    value={project.name}
                    placeholder="Project Name"
                    onChange={(value) => update(["projects", index, "name"], value)}
                    className="text-[0.875em] font-bold"
                    style={{ color: colors.primary }}
                  />
                  <EditableText
                    elementId={`projects.${index}.link`}
                    value={project.link}
                    placeholder="Project link"
                    onChange={(value) => update(["projects", index, "link"], value)}
                    className="break-all text-[0.6875em]"
                    style={{ color: colors.secondary }}
                  />
                </div>
                {project.description && (
                  <EditableText
                    elementId={`projects.${index}.description`}
                    value={project.description}
                    multiline
                    onChange={(value) => update(["projects", index, "description"], value)}
                    className="mt-2 text-[0.875em] leading-[1.5]"
                  />
                )}
                {project.technologies && (
                  <div className="mt-2 text-[0.6875em]" style={{ color: colors.muted }}>
                    <strong>Tech:</strong>{" "}
                    <EditableText
                      elementId={`projects.${index}.technologies`}
                      value={project.technologies}
                      onChange={(value) => update(["projects", index, "technologies"], value)}
                    />
                  </div>
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
                <div className="flex justify-between gap-4">
                  <EditableText
                    elementId={`additionalInformation.${index}.name`}
                    value={item.heading}
                    placeholder="Project Name"
                    onChange={(value) => update(["additionalInformation", index, "heading"], value)}
                    className="text-[0.875em] font-bold"
                    style={{ color: colors.primary }}
                  />
                  <EditableText
                    elementId={`additionalInformation.${index}.link`}
                    value={item.link}
                    placeholder="Project link"
                    onChange={(value) => update(["additionalInformation", index, "link"], value)}
                    className="break-all text-[0.6875em]"
                    style={{ color: colors.secondary }}
                  />
                </div>
                {item.content && (
                  <EditableText
                    elementId={`additionalInformation.${index}.description`}
                    value={item.content}
                    multiline
                    onChange={(value) => update(["additionalInformation", index, "content"], value)}
                    className="mt-2 text-[0.875em] leading-[1.5]"
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


      default:
        return null;
    }

    if (!content) return null;

    if (isSidebar) {
      return (
        <SidebarSection key={sectionId} sectionId={sectionId} title={title}>
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
        <div className="grid min-h-[1123px] grid-cols-[270px_1fr]">

          {/* ================= SIDEBAR (left column) ================= */}

          <ColumnZone
            columnId="left"
            className="relative p-8"
            style={{ backgroundColor: colors.primary, color: colors.sidebarText }}
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-white/20" />

            {/* PROFILE PHOTO + NAME */}
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,.12)",
                  border: "3px solid rgba(255,255,255,.7)",
                }}
              >
                {personal.photo ? (
                  <img src={personal.photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[2.25em] opacity-80">👤</span>
                )}
              </div>

              <EditableText
                elementId="personal.fullname"
                value={personal.fullname}
                placeholder="YOUR NAME"
                onChange={(value) => update(["personal", "fullname"], value)}
                className="text-[1.25em] font-bold tracking-tight text-center"
              />

              <EditableText
                elementId="personal.title"
                value={personal.title}
                placeholder="Professional"
                onChange={(value) => update(["personal", "title"], value)}
                className="mt-2 text-[0.75em] uppercase tracking-[0.22em] text-center opacity-70"
              />
            </div>

            {/* CONTACT — always first in sidebar */}
            <SidebarSection title="CONTACT">
              <SidebarItem elementId="personal.phone" label="PHONE" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} />
              <SidebarItem elementId="personal.email" label="EMAIL" value={personal.email} onChange={(v) => update(["personal", "email"], v)} />
              <SidebarItem elementId="personal.location" label="LOCATION" value={personal.location} onChange={(v) => update(["personal", "location"], v)} />
              <SidebarItem elementId="personal.linkedin" label="LINKEDIN" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} />
              <SidebarItem elementId="personal.website" label="WEBSITE" value={personal.website} onChange={(v) => update(["personal", "website"], v)} />
            </SidebarSection>

            {/* DYNAMIC SIDEBAR SECTIONS IN ORDER */}
            {sidebarOrder.map(id => renderSection(id, true))}
          </ColumnZone>

          {/* ================= MAIN (right column) ================= */}

          <ColumnZone columnId="right" className="p-10">

            {/* HEADER */}
            <header className="border-b pb-7" style={{ borderColor: colors.border }}>
              <p
                className="mb-3 text-[0.75em] font-semibold uppercase tracking-[0.3em]"
                style={{ color: colors.secondary }}
              >
                Curriculum Vitae
              </p>

              <EditableText
                elementId="personal.fullname"
                value={personal.fullname}
                placeholder="YOUR NAME"
                onChange={(value) => update(["personal", "fullname"], value)}
                className="text-[2.25em] font-extrabold tracking-tight"
                style={{ color: colors.primary }}
              />

              <EditableText
                elementId="personal.title"
                value={personal.title}
                placeholder="Professional Title"
                onChange={(value) => update(["personal", "title"], value)}
                className="mt-2 block text-[0.875em] font-medium"
                style={{ color: colors.muted }}
              />
            </header>

            {/* DYNAMIC MAIN SECTIONS IN ORDER */}
            {mainOrder.map(id => renderSection(id, false))}

          </ColumnZone>
      </div>
    </div>
  );
};

const SidebarSection = ({ sectionId, title, children }) => (
  <DraggableSection sectionId={sectionId}>
    <section className="mt-9">
      <h2 className="mb-4 border-b border-white/20 pb-2">
        <EditableText
          elementId={`heading.${sectionId}`}
          value={title}
          readOnly
          className="text-[0.6875em] font-bold tracking-[0.24em]"
        />
      </h2>
      {children}
    </section>
  </DraggableSection>
);

const SidebarItem = ({ elementId, label, value, onChange }) => {
  if (!value) return null;
  return (
    <div className="mb-3">
      <p className="text-[0.5625em] uppercase tracking-[0.15em] opacity-40">{label}</p>
      <EditableText
        elementId={elementId}
        value={value}
        onChange={onChange}
        className="mt-0.5 block break-words text-[0.75em] leading-[1.4] opacity-85"
      />
    </div>
  );
};

const ResumeSection = ({ sectionId, title, children, colors }) => (
  <DraggableSection sectionId={sectionId}>
    <section className="mt-8">
      <div className="mb-5 flex items-center gap-4">
        <h2 className="text-[0.6875em] font-bold tracking-[0.22em]" style={{ color: colors.primary }}>
          <EditableText
            elementId={`heading.${sectionId}`}
            value={title}
            readOnly
            className="text-[0.6875em] font-bold tracking-[0.22em]"
            style={{ color: colors.primary }}
          />
        </h2>
        <div className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      </div>
      {children}
    </section>
  </DraggableSection>
);

export default Template1;