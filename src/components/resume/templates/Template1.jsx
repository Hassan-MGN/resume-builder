import React from "react";

const Template1 = ({ resume, theme }) => {
  const personal = resume?.personal || {};
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const education = Array.isArray(resume?.education) ? resume.education : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const certificates = Array.isArray(resume?.certificates)
    ? resume.certificates
    : [];
  const languages = Array.isArray(resume?.languages)
    ? resume.languages
    : [];
  const hobbies = Array.isArray(resume?.hobbies) ? resume.hobbies : [];
  const projects = Array.isArray(resume?.projects) ? resume.projects : [];

  const colors = {
    primary: theme?.primary || "#172033",
    secondary: theme?.secondary || "#64748b",
    text: theme?.text || "#1f2937",
    muted: theme?.muted || "#64748b",
    border: theme?.border || "#e2e8f0",
    sidebarText: "#f8fafc",
  };

  return (
    <div className="flex justify-center p-6 bg-[#eef1f5]">
      <div
        id="resume-preview"
        className="relative w-[794px] min-h-[1123px] overflow-hidden bg-white shadow-2xl"
        style={{ color: colors.text }}
      >
        <div className="grid min-h-[1123px] grid-cols-[270px_1fr]">

          {/* =====================================================
              SIDEBAR
          ===================================================== */}
          <aside
            className="relative p-8"
            style={{
              backgroundColor: colors.primary,
              color: colors.sidebarText,
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />

            {/* PROFILE */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center mb-5"
                style={{
                  backgroundColor: "rgba(255,255,255,.12)",
                  border: "3px solid rgba(255,255,255,.7)",
                }}
              >
                {personal.photo ? (
                  <img
                    src={personal.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl opacity-80">👤</span>
                )}
              </div>

              <h1 className="text-xl font-bold tracking-tight">
                {personal.fullname || "YOUR NAME"}
              </h1>

              <p className="mt-2 text-xs uppercase tracking-[0.22em] opacity-70">
                {personal.title || "Professional"}
              </p>
            </div>

            {/* CONTACT */}
            <SidebarSection title="CONTACT">
              <SidebarItem label="PHONE" value={personal.phone} />
              <SidebarItem label="EMAIL" value={personal.email} />
              <SidebarItem label="LOCATION" value={personal.location} />
              <SidebarItem label="LINKEDIN" value={personal.linkedin} />
              <SidebarItem label="WEBSITE" value={personal.website} />
            </SidebarSection>

            {/* EDUCATION */}
            {education.length > 0 && (
              <SidebarSection title="EDUCATION">
                {education.map((item, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-semibold leading-5">
                      {item.degree || "Degree"}
                    </h3>

                    <p className="mt-1 text-xs opacity-70">
                      {item.institution || "Institution"}
                    </p>

                    {(item.startDate || item.endDate) && (
                      <p className="mt-1 text-[11px] opacity-50">
                        {item.startDate}
                        {item.startDate && item.endDate ? " — " : ""}
                        {item.endDate}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-2 text-[11px] leading-5 opacity-70">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </SidebarSection>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <SidebarSection title="SKILLS">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                      style={{
                        backgroundColor: "rgba(255,255,255,.1)",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SidebarSection>
            )}

            {/* CERTIFICATES */}
            {certificates.length > 0 && (
              <SidebarSection title="CERTIFICATES">
                {certificates.map((certificate, index) => (
                  <div key={index} className="mb-5 last:mb-0">
                    <h3 className="text-sm font-semibold leading-5">
                      {certificate.name || "Certificate"}
                    </h3>

                    {certificate.issuer && (
                      <p className="mt-1 text-xs opacity-70">
                        {certificate.issuer}
                      </p>
                    )}

                    {(certificate.issueDate || certificate.expiryDate) && (
                      <p className="mt-1 text-[10px] opacity-50">
                        {certificate.issueDate}
                        {certificate.issueDate && certificate.expiryDate
                          ? " — "
                          : ""}
                        {certificate.expiryDate}
                      </p>
                    )}

                    {certificate.credentialId && (
                      <p className="mt-1 text-[10px] opacity-50 break-words">
                        ID: {certificate.credentialId}
                      </p>
                    )}

                    {certificate.credentialUrl && (
                      <p className="mt-1 text-[10px] opacity-60 break-all">
                        {certificate.credentialUrl}
                      </p>
                    )}
                  </div>
                ))}
              </SidebarSection>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <SidebarSection title="LANGUAGES">
                <div className="space-y-3">
                  {languages.map((item, index) => (
                    <div key={index}>
                      <p className="text-xs font-semibold">
                        {item.language || "Language"}
                      </p>

                      {item.proficiency && (
                        <p className="mt-0.5 text-[10px] opacity-60">
                          {item.proficiency}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SidebarSection>
            )}

            {/* HOBBIES */}
            {hobbies.length > 0 && (
              <SidebarSection title="HOBBIES & INTERESTS">
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-md text-[10px]"
                      style={{
                        backgroundColor: "rgba(255,255,255,.1)",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </SidebarSection>
            )}
          </aside>

          {/* =====================================================
              MAIN
          ===================================================== */}
          <main className="p-10">

            <header
              className="pb-7 border-b"
              style={{ borderColor: colors.border }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
                style={{ color: colors.secondary }}
              >
                Curriculum Vitae
              </p>

              <h1
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: colors.primary }}
              >
                {personal.fullname || "YOUR NAME"}
              </h1>

              <p
                className="mt-2 text-sm font-medium"
                style={{ color: colors.muted }}
              >
                {personal.title || "Professional Title"}
              </p>
            </header>

            {/* PROFILE */}
            {resume.summary && (
              <ResumeSection title="PROFILE" colors={colors}>
                <p className="text-sm leading-7">{resume.summary}</p>
              </ResumeSection>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && (
              <ResumeSection title="EXPERIENCE" colors={colors}>
                <div className="space-y-7">
                  {experience.map((item, index) => (
                    <article key={index}>
                      <div className="flex justify-between gap-5">
                        <div>
                          <h3
                            className="text-base font-bold"
                            style={{ color: colors.primary }}
                          >
                            {item.position || "Job Position"}
                          </h3>

                          <p
                            className="mt-1 text-sm font-medium"
                            style={{ color: colors.secondary }}
                          >
                            {item.company || "Company Name"}
                          </p>
                        </div>

                        {(item.startDate || item.endDate) && (
                          <span
                            className="text-[11px] font-medium whitespace-nowrap"
                            style={{ color: colors.muted }}
                          >
                            {item.startDate}
                            {item.startDate && item.endDate ? " — " : ""}
                            {item.endDate}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-3 text-sm leading-6 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}

            {/* PROJECTS */}
            {projects.length > 0 && (
              <ResumeSection title="PROJECTS" colors={colors}>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <article key={index}>
                      <div className="flex justify-between gap-4">
                        <h3
                          className="text-sm font-bold"
                          style={{ color: colors.primary }}
                        >
                          {project.name || "Project Name"}
                        </h3>

                        {project.link && (
                          <span
                            className="text-[11px] break-all"
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
                          className="mt-2 text-[11px]"
                          style={{ color: colors.muted }}
                        >
                          <strong>Tech:</strong> {project.technologies}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const SidebarSection = ({ title, children }) => (
  <section className="mt-9">
    <h2 className="pb-2 mb-4 text-[11px] font-bold tracking-[0.24em] border-b border-white/20">
      {title}
    </h2>

    {children}
  </section>
);

const SidebarItem = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="mb-3">
      <p className="text-[9px] uppercase tracking-[0.15em] opacity-40">
        {label}
      </p>

      <p className="mt-0.5 text-xs leading-5 break-words opacity-85">
        {value}
      </p>
    </div>
  );
};

const ResumeSection = ({ title, children, colors }) => (
  <section className="mt-8">
    <div className="flex items-center gap-4 mb-5">
      <h2
        className="text-[11px] font-bold tracking-[0.22em]"
        style={{ color: colors.primary }}
      >
        {title}
      </h2>

      <div
        className="flex-1 h-px"
        style={{ backgroundColor: colors.border }}
      />
    </div>

    {children}
  </section>
);

export default Template1;