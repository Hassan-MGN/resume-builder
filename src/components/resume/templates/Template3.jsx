import React from "react";

const Template3 = ({ resume, theme }) => {
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
    primary: theme?.primary || "#111827",
    secondary: theme?.secondary || "#6b7280",
    text: theme?.text || "#374151",
    border: theme?.border || "#d1d5db",
  };

  return (
    <div className="flex justify-center p-6 bg-[#eef1f5]">
      <div
        id="resume-preview"
        className="relative w-[794px] min-h-[1123px] bg-white shadow-2xl overflow-hidden"
        style={{ color: colors.text }}
      >

        {/* HEADER */}
        <header className="px-12 pt-12 pb-8">
          <div className="flex justify-between gap-10">

            <div>
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-semibold"
                style={{ color: colors.secondary }}
              >
                Curriculum Vitae
              </p>

              <h1
                className="mt-3 text-4xl font-bold tracking-tight"
                style={{ color: colors.primary }}
              >
                {personal.fullname || "YOUR NAME"}
              </h1>

              <p
                className="mt-2 text-sm"
                style={{ color: colors.secondary }}
              >
                {personal.title || "Professional Title"}
              </p>
            </div>

            <div className="text-right text-[10px] leading-5 text-gray-500 max-w-[220px]">
              {personal.email && <p>{personal.email}</p>}
              {personal.phone && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
              {personal.linkedin && (
                <p className="break-all">{personal.linkedin}</p>
              )}
              {personal.website && (
                <p className="break-all">{personal.website}</p>
              )}
            </div>
          </div>
        </header>

        <div
          className="mx-12 border-t"
          style={{ borderColor: colors.border }}
        />

        <main className="px-12 pb-12">

          {resume.summary && (
            <section className="mt-9">
              <SectionTitle title="PROFILE" colors={colors} />

              <p className="max-w-2xl text-sm leading-7">
                {resume.summary}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mt-10">
              <SectionTitle title="EXPERIENCE" colors={colors} />

              <div className="space-y-8">
                {experience.map((item, index) => (
                  <article
                    key={index}
                    className="grid grid-cols-[125px_1fr] gap-8"
                  >
                    <div
                      className="text-[10px] leading-5"
                      style={{ color: colors.secondary }}
                    >
                      {item.startDate && <p>{item.startDate}</p>}
                      {item.endDate && <p>{item.endDate}</p>}
                    </div>

                    <div>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: colors.primary }}
                      >
                        {item.position || "Job Position"}
                      </h3>

                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.secondary }}
                      >
                        {item.company || "Company Name"}
                      </p>

                      {item.description && (
                        <p className="mt-3 text-sm leading-6 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mt-10">
              <SectionTitle title="EDUCATION" colors={colors} />

              <div className="space-y-7">
                {education.map((item, index) => (
                  <article
                    key={index}
                    className="grid grid-cols-[125px_1fr] gap-8"
                  >
                    <div
                      className="text-[10px] leading-5"
                      style={{ color: colors.secondary }}
                    >
                      {item.startDate && <p>{item.startDate}</p>}
                      {item.endDate && <p>{item.endDate}</p>}
                    </div>

                    <div>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: colors.primary }}
                      >
                        {item.degree || "Degree"}
                      </h3>

                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.secondary }}
                      >
                        {item.institution || "Institution"}
                      </p>

                      {item.description && (
                        <p className="mt-2 text-sm leading-6">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section className="mt-10">
              <SectionTitle title="SKILLS" colors={colors} />

              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mt-10">
              <SectionTitle title="PROJECTS" colors={colors} />

              <div className="space-y-7">
                {projects.map((project, index) => (
                  <article key={index}>
                    <div className="flex justify-between gap-5">
                      <h3
                        className="text-sm font-bold"
                        style={{ color: colors.primary }}
                      >
                        {project.name || "Project Name"}
                      </h3>

                      {project.link && (
                        <span
                          className="text-[10px] break-all"
                          style={{ color: colors.secondary }}
                        >
                          {project.link}
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="mt-2 text-sm leading-6">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <p
                        className="mt-2 text-[10px]"
                        style={{ color: colors.secondary }}
                      >
                        <strong>Technologies:</strong>{" "}
                        {project.technologies}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
          {/* CERTIFICATES */}
{certificates.length > 0 && (
  <section className="mt-10">
    <SectionTitle title="CERTIFICATES" colors={colors} />

    <div className="space-y-6">
      {certificates.map((item, index) => (
        <article key={index}>
          <h3
            className="text-sm font-bold"
            style={{ color: colors.primary }}
          >
            {item.name || "Certificate"}
          </h3>

          {item.issuer && (
            <p
              className="mt-1 text-xs"
              style={{ color: colors.secondary }}
            >
              {item.issuer}
            </p>
          )}

          {item.date && (
            <p
              className="mt-1 text-[10px]"
              style={{ color: colors.secondary }}
            >
              {item.date}
            </p>
          )}
        </article>
      ))}
    </div>
  </section>
)}

{/* LANGUAGES */}
{languages.length > 0 && (
  <section className="mt-10">
    <SectionTitle title="LANGUAGES" colors={colors} />

    <div className="flex flex-wrap gap-x-10 gap-y-4">
      {languages.map((language, index) => (
        <div key={index}>
          <p
            className="text-xs font-semibold"
            style={{ color: colors.primary }}
          >
            {typeof language === "string"
              ? language
              : language.name || language.language}
          </p>

          {typeof language !== "string" && language.level && (
            <p
              className="mt-1 text-[10px]"
              style={{ color: colors.secondary }}
            >
              {language.level}
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
)}

{/* HOBBIES */}
{hobbies.length > 0 && (
  <section className="mt-10">
    <SectionTitle title="HOBBIES" colors={colors} />

    <div className="flex flex-wrap gap-x-7 gap-y-3">
      {hobbies.map((hobby, index) => (
        <span
          key={index}
          className="text-xs font-medium"
          style={{ color: colors.text }}
        >
          {typeof hobby === "string"
            ? hobby
            : hobby.name || hobby.hobby}
        </span>
      ))}
    </div>
  </section>
)}
        </main>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, colors }) => (
  <div className="flex items-center gap-4 mb-5">
    <h2
      className="text-[10px] font-bold tracking-[0.25em] whitespace-nowrap"
      style={{ color: colors.primary }}
    >
      {title}
    </h2>

    <div
      className="flex-1 border-t"
      style={{ borderColor: colors.border }}
    />
  </div>
);

export default Template3;

