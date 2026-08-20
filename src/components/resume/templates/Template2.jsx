import React from "react";

const Template2 = ({ resume, theme }) => {
  const personal = resume?.personal || {};
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const education = Array.isArray(resume?.education) ? resume.education : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const projects = Array.isArray(resume?.projects) ? resume.projects : [];
  const certificates = Array.isArray(resume?.certificates)
  ? resume.certificates
  : [];

const languages = Array.isArray(resume?.languages)
  ? resume.languages
  : [];

const hobbies = Array.isArray(resume?.hobbies)
  ? resume.hobbies
  : [];

  const colors = {
    primary: theme?.primary || "#4f46e5",
    secondary: theme?.secondary || "#6366f1",
    text: theme?.text || "#1f2937",
    muted: theme?.muted || "#6b7280",
    light: theme?.light || "#eef2ff",
    border: theme?.border || "#e5e7eb",
  };

  return (
    <div className="flex justify-center p-6 bg-[#eef1f5]">
      <div
        id="resume-preview"
        className="relative w-[794px] min-h-[1123px] overflow-hidden bg-white shadow-2xl"
        style={{ color: colors.text }}
      >

        {/* TOP ACCENT */}
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />

        {/* HEADER */}
        <header className="px-11 py-9">
          <div className="flex justify-between gap-10">

            <div className="flex-1">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: colors.primary }}
              >
                Resume
              </p>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {personal.fullname || "YOUR NAME"}
              </h1>

              <p
                className="mt-2 text-sm font-medium"
                style={{ color: colors.secondary }}
              >
                {personal.title || "Professional Title"}
              </p>
            </div>

            <div className="w-52 text-right text-[11px] leading-5 text-gray-500">
              {personal.email && <p>{personal.email}</p>}
              {personal.phone && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
              {personal.linkedin && <p className="break-all">{personal.linkedin}</p>}
              {personal.website && <p className="break-all">{personal.website}</p>}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[1fr_235px] border-t border-gray-100">

          {/* MAIN */}
          <main className="p-10">
            {resume.summary && (
              <ResumeSection title="PROFILE" colors={colors}>
                <p className="text-sm leading-7 text-gray-700">
                  {resume.summary}
                </p>
              </ResumeSection>
            )}

            {experience.length > 0 && (
              <ResumeSection title="EXPERIENCE" colors={colors}>
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
                          <h3 className="text-sm font-bold text-gray-900">
                            {item.position || "Job Position"}
                          </h3>

                          <p
                            className="mt-1 text-xs font-semibold"
                            style={{ color: colors.primary }}
                          >
                            {item.company || "Company Name"}
                          </p>
                        </div>

                        {(item.startDate || item.endDate) && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {item.startDate}
                            {item.startDate && item.endDate ? " — " : ""}
                            {item.endDate}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-3 text-sm leading-6 text-gray-700 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}

            {projects.length > 0 && (
              <ResumeSection title="PROJECTS" colors={colors}>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <article key={index}>
                      <h3 className="text-sm font-bold text-gray-900">
                        {project.name || "Project Name"}
                      </h3>

                      {project.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          {project.description}
                        </p>
                      )}

                      {project.technologies && (
                        <p className="mt-2 text-[11px] text-gray-500">
                          <strong>Technologies:</strong>{" "}
                          {project.technologies}
                        </p>
                      )}

                      {project.link && (
                        <p
                          className="mt-1 text-[11px] break-all"
                          style={{ color: colors.primary }}
                        >
                          {project.link}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="p-7 bg-gray-50 border-l border-gray-100">

            {education.length > 0 && (
              <SidebarSection title="EDUCATION" colors={colors}>
                <div className="space-y-6">
                  {education.map((item, index) => (
                    <article key={index}>
                      <h3 className="text-xs font-bold text-gray-900">
                        {item.degree || "Degree"}
                      </h3>

                      <p
                        className="mt-1 text-[11px] font-medium"
                        style={{ color: colors.primary }}
                      >
                        {item.institution || "Institution"}
                      </p>

                      {(item.startDate || item.endDate) && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          {item.startDate}
                          {item.startDate && item.endDate ? " — " : ""}
                          {item.endDate}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-2 text-[10px] leading-5 text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </SidebarSection>
            )}

            {skills.length > 0 && (
              <SidebarSection title="SKILLS" colors={colors}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-md text-[10px] font-medium"
                      style={{
                        backgroundColor: colors.light,
                        color: colors.primary,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SidebarSection>
            )}

            {(personal.linkedin || personal.website) && (
              <SidebarSection title="LINKS" colors={colors}>
                <div className="space-y-2 text-[10px] break-all">
                  {personal.linkedin && (
                    <p style={{ color: colors.primary }}>
                      {personal.linkedin}
                    </p>
                  )}

                  {personal.website && (
                    <p style={{ color: colors.primary }}>
                      {personal.website}
                    </p>
                  )}
                </div>
              </SidebarSection>
            )}

            {/* CERTIFICATES */}
{certificates.length > 0 && (
  <SidebarSection title="CERTIFICATES" colors={colors}>
    <div className="space-y-5">
      {certificates.map((item, index) => (
        <article key={index}>
          <h3 className="text-xs font-bold text-gray-900">
            {item.name || "Certificate"}
          </h3>

          {item.issuer && (
            <p
              className="mt-1 text-[11px] font-medium"
              style={{ color: colors.primary }}
            >
              {item.issuer}
            </p>
          )}

          {item.date && (
            <p className="mt-1 text-[10px] text-gray-400">
              {item.date}
            </p>
          )}
        </article>
      ))}
    </div>
  </SidebarSection>
)}

{/* LANGUAGES */}
{languages.length > 0 && (
  <SidebarSection title="LANGUAGES" colors={colors}>
    <div className="space-y-3">
      {languages.map((language, index) => (
        <div key={index}>
          <p className="text-xs font-semibold text-gray-900">
            {typeof language === "string"
              ? language
              : language.name || language.language}
          </p>

          {typeof language !== "string" && language.level && (
            <p
              className="mt-0.5 text-[10px]"
              style={{ color: colors.secondary }}
            >
              {language.level}
            </p>
          )}
        </div>
      ))}
    </div>
  </SidebarSection>
)}

{/* HOBBIES */}
{hobbies.length > 0 && (
  <SidebarSection title="HOBBIES" colors={colors}>
    <div className="flex flex-wrap gap-2">
      {hobbies.map((hobby, index) => (
        <span
          key={index}
          className="px-2.5 py-1 rounded-md text-[10px] font-medium"
          style={{
            backgroundColor: colors.light,
            color: colors.primary,
          }}
        >
          {typeof hobby === "string"
            ? hobby
            : hobby.name || hobby.hobby}
        </span>
      ))}
    </div>
  </SidebarSection>
)}
          </aside>
        </div>
      </div>
    </div>
  );
};

const ResumeSection = ({ title, children, colors }) => (
  <section className="mb-9">
    <div className="flex items-center gap-3 mb-5">
      <h2
        className="text-[10px] font-bold tracking-[0.22em]"
        style={{ color: colors.primary }}
      >
        {title}
      </h2>

      <div className="flex-1 h-px bg-gray-200" />
    </div>

    {children}
  </section>
);

const SidebarSection = ({ title, children, colors }) => (
  <section className="mb-9">
    <h2
      className="pb-2 mb-5 text-[10px] font-bold tracking-[0.22em] border-b border-gray-200"
      style={{ color: colors.primary }}
    >
      {title}
    </h2>

    {children}
  </section>
);

export default Template2;

