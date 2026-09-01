import React from "react";
import EditableText from "../../ui/EditableText";
import DraggableSection from "../editor/DraggableSection";

const Template3 = ({ resume, theme, sectionOrder, onResumeChange }) => {
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
    primary: theme?.primary || "#111827",
    secondary: theme?.secondary || "#6b7280",
    text: theme?.text || "#374151",
    border: theme?.border || "#d1d5db",
  };

  const update = (path, value) => {
    if (typeof onResumeChange === "function") {
      onResumeChange(path, value);
    }
  };

  const ALL_SECTIONS = new Set(["summary", "experience", "education", "skills", "projects", "certificates", "languages", "hobbies", "coreSkills", "keyAchievements", "additionalInformation"]);
  const orderedSections = Array.isArray(sectionOrder)
    ? sectionOrder.filter(s => ALL_SECTIONS.has(s))
    : ["summary", "experience", "education", "skills", "projects", "certificates", "languages", "hobbies"];

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        if (!resume.summary) return null;
        return (
          <DraggableSection key="summary" sectionId="summary">
            <section className="mt-9">
              <SectionTitle sectionId="summary" title="PROFILE" colors={colors} />
              <EditableText
                elementId="summary"
                value={resume.summary}
                multiline
                onChange={(value) => update(["summary"], value)}
                className="max-w-2xl text-[0.875em] leading-[1.6]"
              />
            </section>
          </DraggableSection>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <DraggableSection key="experience" sectionId="experience">
            <section className="mt-10">
              <SectionTitle sectionId="experience" title="EXPERIENCE" colors={colors} />
              <div className="space-y-8">
                {experience.map((item, index) => (
                  <article key={index} className="grid grid-cols-[125px_1fr] gap-8">
                    <div className="text-[0.625em] leading-[1.4]" style={{ color: colors.secondary }}>
                      <EditableText
                        elementId={`experience.${index}.startDate`}
                        value={item.startDate}
                        onChange={(value) => update(["experience", index, "startDate"], value)}
                        className="block"
                      />
                      <EditableText
                        elementId={`experience.${index}.endDate`}
                        value={item.endDate}
                        onChange={(value) => update(["experience", index, "endDate"], value)}
                        className="block mt-1"
                      />
                    </div>
                    <div>
                      <EditableText
                        elementId={`experience.${index}.position`}
                        value={item.position}
                        placeholder="Job Position"
                        onChange={(value) => update(["experience", index, "position"], value)}
                        className="text-[0.875em] font-bold block"
                        style={{ color: colors.primary }}
                      />
                      <EditableText
                        elementId={`experience.${index}.company`}
                        value={item.company}
                        placeholder="Company Name"
                        onChange={(value) => update(["experience", index, "company"], value)}
                        className="mt-1 text-[0.75em] block"
                        style={{ color: colors.secondary }}
                      />
                      {item.description && (
                        <EditableText
                          elementId={`experience.${index}.description`}
                          value={item.description}
                          multiline
                          onChange={(value) => update(["experience", index, "description"], value)}

                          className="mt-3 block text-[0.875em] leading-[1.5] whitespace-pre-line"
                        />
                      )}
                    </div>
                  
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
            </section>
          </DraggableSection>
        );

      case "education":
        if (!education.length) return null;
        return (
          <DraggableSection key="education" sectionId="education">
            <section className="mt-10">
              <SectionTitle sectionId="education" title="EDUCATION" colors={colors} />
              <div className="space-y-7">
                {education.map((item, index) => (
                  <article key={index} className="grid grid-cols-[125px_1fr] gap-8">
                    <div className="text-[0.625em] leading-[1.4]" style={{ color: colors.secondary }}>
                      <EditableText
                        elementId={`education.${index}.startDate`}
                        value={item.startDate}
                        onChange={(value) => update(["education", index, "startDate"], value)}
                        className="block"
                      />
                      <EditableText
                        elementId={`education.${index}.endDate`}
                        value={item.endDate}
                        onChange={(value) => update(["education", index, "endDate"], value)}
                        className="block mt-1"
                      />
                    </div>
                    <div>
                      <EditableText
                        elementId={`education.${index}.degree`}
                        value={item.degree}
                        placeholder="Degree"
                        onChange={(value) => update(["education", index, "degree"], value)}
                        className="text-[0.875em] font-bold block"
                        style={{ color: colors.primary }}
                      />
                      <EditableText
                        elementId={`education.${index}.institution`}
                        value={item.institution}
                        placeholder="Institution"
                        onChange={(value) => update(["education", index, "institution"], value)}
                        className="mt-1 text-[0.75em] block"
                        style={{ color: colors.secondary }}
                      />
                      {item.description && (
                        <EditableText
                          elementId={`education.${index}.description`}
                          value={item.description}
                          multiline
                          onChange={(value) => update(["education", index, "description"], value)}
                          className="mt-2 text-[0.875em] leading-[1.5] block"
                        />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "skills":
        if (!skills.length) return null;
        return (
          <DraggableSection key="skills" sectionId="skills">
            <section className="mt-10">
              <SectionTitle sectionId="skills" title="SKILLS" colors={colors} />
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {skills.map((skill, index) => (
                  <EditableText
                    elementId={`skills.${index}`}
                    key={index}
                    value={skill}
                    onChange={(value) => update(["skills", index], value)}
                    className="text-[0.75em] font-medium inline-block"
                    style={{ color: colors.text }}
                  />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "keyAchievements":
        if (!keyAchievements.length) return null;
        return (
          <DraggableSection key="keyAchievements" sectionId="keyAchievements">
            <section className="mt-10">
              <SectionTitle sectionId="keyAchievements" title="KEY ACHIEVEMENTS" colors={colors} />
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {keyAchievements.map((skill, index) => (
                  <EditableText
                    elementId={`keyAchievements.${index}`}
                    key={index}
                    value={skill}
                    onChange={(value) => update(["keyAchievements", index], value)}
                    className="text-[0.75em] font-medium inline-block"
                    style={{ color: colors.text }}
                  />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "coreSkills":
        if (!coreSkills.length) return null;
        return (
          <DraggableSection key="coreSkills" sectionId="coreSkills">
            <section className="mt-10">
              <SectionTitle sectionId="coreSkills" title="CORE SKILLS" colors={colors} />
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {coreSkills.map((skill, index) => (
                  <EditableText
                    elementId={`coreSkills.${index}`}
                    key={index}
                    value={skill}
                    onChange={(value) => update(["coreSkills", index], value)}
                    className="text-[0.75em] font-medium inline-block"
                    style={{ color: colors.text }}
                  />
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "projects":
        if (!projects.length) return null;
        return (
          <DraggableSection key="projects" sectionId="projects">
            <section className="mt-10">
              <SectionTitle sectionId="projects" title="PROJECTS" colors={colors} />
              <div className="space-y-7">
                {projects.map((project, index) => (
                  <article key={index}>
                    <div className="flex justify-between gap-5">
                      <EditableText
                        elementId={`projects.${index}.name`}
                        value={project.name}
                        placeholder="Project Name"
                        onChange={(value) => update(["projects", index, "name"], value)}
                        className="text-[0.875em] font-bold"
                        style={{ color: colors.primary }}
                      />
                      {project.link && (
                        <EditableText
                          elementId={`projects.${index}.link`}
                          value={project.link}
                          onChange={(value) => update(["projects", index, "link"], value)}
                          className="text-[0.625em] break-all"
                          style={{ color: colors.secondary }}
                        />
                      )}
                    </div>
                    {project.description && (
                      <EditableText
                        elementId={`projects.${index}.description`}
                        value={project.description}
                        multiline
                        onChange={(value) => update(["projects", index, "description"], value)}
                        className="mt-2 block text-[0.875em] leading-[1.5]"
                      />
                    )}
                    {project.technologies && (
                      <p className="mt-2 text-[0.625em]" style={{ color: colors.secondary }}>
                        <strong>Technologies:</strong>{" "}
                        <EditableText
                          elementId={`projects.${index}.technologies`}
                          value={project.technologies}
                          onChange={(value) => update(["projects", index, "technologies"], value)}
                        />
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </DraggableSection>
        );

      case "additionalInformation":
        if (!additionalInformation.length) return null;
        return (
          <DraggableSection key="additionalInformation" sectionId="additionalInformation">
            <section className="mt-10">
              <SectionTitle sectionId="additionalInformation" title="ADDITIONAL INFO" colors={colors} />
              <div className="space-y-7">
                {additionalInformation.map((item, index) => (
                  <article key={index}>
                    <div className="flex justify-between gap-5">
                      <EditableText
                        elementId={`additionalInformation.${index}.name`}
                        value={item.heading}
                        placeholder="Project Name"
                        onChange={(value) => update(["additionalInformation", index, "heading"], value)}
                        className="text-[0.875em] font-bold"
                        style={{ color: colors.primary }}
                      />
                      
                    </div>
                    {item.content && (
                      <EditableText
                        elementId={`additionalInformation.${index}.description`}
                        value={item.content}
                        multiline
                        onChange={(value) => update(["additionalInformation", index, "content"], value)}
                        className="mt-2 block text-[0.875em] leading-[1.5]"
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
            </section>
          </DraggableSection>
        );

      case "certificates":
        if (!certificates.length) return null;
        return (
          <DraggableSection key="certificates" sectionId="certificates">
            <section className="mt-10">
              <SectionTitle sectionId="certificates" title="CERTIFICATES" colors={colors} />
              <div className="space-y-6">
                {certificates.map((item, index) => (
                  <article key={index}>
                    <EditableText
                      elementId={`certificates.${index}.name`}
                      value={item.name}
                      placeholder="Certificate"
                      onChange={(value) => update(["certificates", index, "name"], value)}
                      className="text-[0.875em] font-bold block"
                      style={{ color: colors.primary }}
                    />
                    {item.issuer && (
                      <EditableText
                        elementId={`certificates.${index}.issuer`}
                        value={item.issuer}
                        onChange={(value) => update(["certificates", index, "issuer"], value)}
                        className="mt-1 block text-[0.75em]"
                        style={{ color: colors.secondary }}
                      />
                    )}
                    {(item.issueDate || item.expiryDate) && (
                      <p className="mt-1 text-[0.625em]" style={{ color: colors.secondary }}>
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
            </section>
          </DraggableSection>
        );

      case "languages":
        if (!languages.length) return null;
        return (
          <DraggableSection key="languages" sectionId="languages">
            <section className="mt-10">
              <SectionTitle sectionId="languages" title="LANGUAGES" colors={colors} />
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {languages.map((item, index) => (
                  <div key={index}>
                    <EditableText
                      elementId={`languages.${index}.language`}
                      value={typeof item === "string" ? item : item.language || item.name}
                      onChange={(value) => update(["languages", index, "language"], value)}
                      className="text-[0.75em] font-semibold block"
                      style={{ color: colors.primary }}
                    />
                    {typeof item !== "string" && (item.proficiency || item.level) && (
                      <EditableText
                        elementId={`languages.${index}.proficiency`}
                        value={item.proficiency || item.level}
                        onChange={(value) => update(["languages", index, "proficiency"], value)}
                        className="mt-1 block text-[0.625em]"
                        style={{ color: colors.secondary }}
                      />
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
            <section className="mt-10">
              <SectionTitle sectionId="hobbies" title="HOBBIES" colors={colors} />
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {hobbies.map((hobby, index) => (
                  <EditableText
                    elementId={`hobbies.${index}`}
                    key={index}
                    value={typeof hobby === "string" ? hobby : hobby.name || hobby.hobby}
                    onChange={(value) => update(["hobbies", index], value)}
                    className="text-[0.75em] font-medium inline-block"
                    style={{ color: colors.text }}
                  />
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
    <div
      className="w-full h-full bg-white relative overflow-hidden"
      style={{ color: colors.text }}
    >
        {/* HEADER */}
        <header className="px-12 pt-12 pb-8">
          <div className="flex justify-between gap-10">
            <div>
              <p
                className="text-[0.625em] uppercase tracking-[0.3em] font-semibold"
                style={{ color: colors.secondary }}
              >
                Curriculum Vitae
              </p>
              <EditableText
                elementId="personal.fullname"
                value={personal.fullname}
                placeholder="YOUR NAME"
                onChange={(value) => update(["personal", "fullname"], value)}
                className="mt-3 block text-[2.25em] font-bold tracking-tight"
                style={{ color: colors.primary }}
              />
              <EditableText
                elementId="personal.title"
                value={personal.title}
                placeholder="Professional Title"
                onChange={(value) => update(["personal", "title"], value)}
                className="mt-2 block text-[0.875em]"
                style={{ color: colors.secondary }}
              />
            </div>

            <div className="text-right text-[0.625em] leading-[1.4] text-gray-500 max-w-[220px]">
              {personal.email && <EditableText elementId="personal.email" value={personal.email} onChange={(v) => update(["personal", "email"], v)} className="block" />}
              {personal.phone && <EditableText elementId="personal.phone" value={personal.phone} onChange={(v) => update(["personal", "phone"], v)} className="block" />}
              {personal.location && <EditableText elementId="personal.location" value={personal.location} onChange={(v) => update(["personal", "location"], v)} className="block" />}
              {personal.linkedin && <EditableText elementId="personal.linkedin" value={personal.linkedin} onChange={(v) => update(["personal", "linkedin"], v)} className="block break-all" />}
              {personal.website && <EditableText elementId="personal.website" value={personal.website} onChange={(v) => update(["personal", "website"], v)} className="block break-all" />}
            </div>
          </div>
        </header>

        <div className="mx-12 border-t" style={{ borderColor: colors.border }} />

        <main className="px-12 pb-12">
          {orderedSections.map(renderSection)}
        </main>
      </div>
  );
};

const SectionTitle = ({ sectionId, title, colors }) => (
  <div className="flex items-center gap-4 mb-5">
    <h2
      className="text-[0.625em] font-bold tracking-[0.25em] whitespace-nowrap"
      style={{ color: colors.primary }}
    >
      <EditableText
        elementId={`heading.${sectionId}`}
        value={title}
        readOnly
        className="text-[0.625em] font-bold tracking-[0.25em] whitespace-nowrap"
        style={{ color: colors.primary }}
      />
    </h2>
    <div className="flex-1 border-t" style={{ borderColor: colors.border }} />
  </div>
);

export default Template3;
