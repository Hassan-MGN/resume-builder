import { useMemo, useState } from "react";

import {
  enhanceResumeText,
  proofreadResumeText,
} from "../../../utils/aiEnhancer";

// UI components
import Section from "./ui/Section";
import AIReviewPanel from "./ui/AIReviewPanel";
import ATSPanel from "./ui/ATSPanel";

// Form sections
import Personal from "./sections/Personal";
import Summary from "./sections/Summary";
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import Skills from "./sections/Skills";
import Certificates from "./sections/Certificates";
import Languages from "./sections/Languages";
import Hobbies from "./sections/Hobbies";
import Projects from "./sections/Projects";
import CoreSkills from "./sections/CoreSkills";
import KeyAchievements from "./sections/KeyAchievements";
import AdditionalInfo from "./sections/AdditionalInfo";
import LoadingScreen from "../../ui/LoadingScreen";


const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};


const stripEmojis = (text = "") => {
  return String(text).replace(
    /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu,
    ""
  );
};


const cleanText = (text = "") => {
  return stripEmojis(text)
    .replace(/\s{2,}/g, " ")
    .trim();
};


const Form = ({ resume, setResume, activeStepId }) => {
  const [openSection, setOpenSection] = useState(activeStepId);

  const [skillInput, setSkillInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");

  const [aiLoading, setAiLoading] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [photoError, setPhotoError] = useState("");


  // Resume data

  const personal = resume?.personal || {};

  const experience = getArray(resume?.experience);
  const education = getArray(resume?.education);
  const skills = getArray(resume?.skills);
  const certificates = getArray(resume?.certificates);
  const languages = getArray(resume?.languages);
  const hobbies = getArray(resume?.hobbies);
  const projects = getArray(resume?.projects);
  const coreSkills = getArray(resume?.coreSkills);
  const keyAchievements = getArray(resume?.keyAchievements);
  const additionalInformation = getArray(resume?.additionalInformation);


  // Completion percentage

  const completion = useMemo(() => {
    const personalFields = [
      personal.fullname,
      personal.title,
      personal.email,
      personal.phone,
      personal.location,
    ];

    let completed = personalFields.filter((field) => {
      return typeof field === "string"
        ? field.trim()
        : Boolean(field);
    }).length;

    let total = personalFields.length;

    const sectionChecks = [
      Boolean(resume?.summary?.trim()),

      experience.some(
        (item) =>
          item.company ||
          item.position ||
          item.description
      ),

      education.some(
        (item) =>
          item.institution ||
          item.degree
      ),

      skills.length > 0,

      certificates.some(
        (item) =>
          item.name ||
          item.issuer
      ),

      languages.some(
        (item) =>
          item.language ||
          item.proficiency
      ),

      hobbies.length > 0,

      projects.some(
        (item) =>
          item.name ||
          item.description
      ),

      coreSkills.length > 0,
      keyAchievements.length > 0,
      additionalInformation.some(
        (item) => item.heading || item.content || item.bullets?.length > 0
      ),
    ];

    total += sectionChecks.length;
    completed += sectionChecks.filter(Boolean).length;

    return Math.round(
      (completed / total) * 100
    );
  }, [
    personal,
    resume?.summary,
    experience,
    education,
    skills,
    certificates,
    languages,
    hobbies,
    projects,
    coreSkills,
    keyAchievements,
    additionalInformation,
  ]);

  const resumeText = useMemo(() => {
    return JSON.stringify({
      summary: resume?.summary || "",
      experience: experience.map(e => `${e.position} at ${e.company}. ${e.description}`),
      education: education.map(e => `${e.degree} at ${e.institution}. ${e.description}`),
      skills: skills,
      projects: projects.map(p => `${p.name}: ${p.description}. ${p.technologies}`)
    });
  }, [resume?.summary, experience, education, skills, projects]);


  // Section controls

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };


  const openSectionAndScroll = (section) => {
    setOpenSection(section);

    setTimeout(() => {
      const element = document.getElementById(
        `form-section-${section}`
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };


  // Basic updates

  const updatePersonal = (field, value) => {
    setResume((previous) => ({
      ...previous,

      personal: {
        ...(previous.personal || {}),
        [field]: stripEmojis(value),
      },
    }));
  };


  const updateSummary = (value) => {
    setResume((previous) => ({
      ...previous,
      summary: stripEmojis(value),
    }));
  };


  const updateArrayItem = (
    arrayName,
    index,
    field,
    value
  ) => {
    setResume((previous) => {
      const items = getArray(previous[arrayName]);

      return {
        ...previous,

        [arrayName]: items.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          return {
            ...(item || {}),
            [field]: stripEmojis(value),
          };
        }),
      };
    });
  };


  const removeArrayItem = (arrayName, index) => {
    setResume((previous) => ({
      ...previous,

      [arrayName]: getArray(previous[arrayName]).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };


  // Add item helpers

  const addItem = (arrayName, item, section) => {
    setResume((previous) => ({
      ...previous,

      [arrayName]: [
        ...getArray(previous[arrayName]),
        item,
      ],
    }));

    setOpenSection(section);
  };


  const addExperience = () => {
    addItem(
      "experience",
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
      "experience"
    );
  };


  const addEducation = () => {
    addItem(
      "education",
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
      "education"
    );
  };


  const addCertificate = () => {
    addItem(
      "certificates",
      {
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
      },
      "certificates"
    );
  };


  const addLanguage = () => {
    addItem(
      "languages",
      {
        language: "",
        proficiency: "",
      },
      "languages"
    );
  };


  const addProject = () => {
    addItem(
      "projects",
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
      "projects"
    );
  };

  const addAdditionalInfo = () => {
    addItem(
      "additionalInformation",
      {
        heading: "",
        content: "",
        bullets: [],
      },
      "additionalInformation"
    );
  };


  // Skills

  const addSkill = () => {
    const skill = cleanText(skillInput);

    if (!skill) {
      return;
    }

    const exists = skills.some(
      (existingSkill) =>
        String(existingSkill).toLowerCase() ===
        skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setResume((previous) => ({
      ...previous,

      skills: [
        ...getArray(previous.skills),
        skill,
      ],
    }));

    setSkillInput("");
  };


  const handleSkillKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addSkill();
    }

    if (
      event.key === "Backspace" &&
      !skillInput &&
      skills.length > 0
    ) {
      removeArrayItem(
        "skills",
        skills.length - 1
      );
    }
  };


  // Hobbies

  const addHobby = () => {
    const hobby = cleanText(hobbyInput);

    if (!hobby) {
      return;
    }

    const exists = hobbies.some(
      (existingHobby) =>
        String(existingHobby).toLowerCase() ===
        hobby.toLowerCase()
    );

    if (exists) {
      setHobbyInput("");
      return;
    }

    setResume((previous) => ({
      ...previous,

      hobbies: [
        ...getArray(previous.hobbies),
        hobby,
      ],
    }));

    setHobbyInput("");
  };


  const handleHobbyKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addHobby();
    }

    if (
      event.key === "Backspace" &&
      !hobbyInput &&
      hobbies.length > 0
    ) {
      removeArrayItem(
        "hobbies",
        hobbies.length - 1
      );
    }
  };


  // Core Skills

  const [coreSkillInput, setCoreSkillInput] = useState("");

  const addCoreSkill = () => {
    const skill = cleanText(coreSkillInput);
    if (!skill) return;

    const exists = coreSkills.some(
      (existing) => String(existing).toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setCoreSkillInput("");
      return;
    }

    setResume((previous) => ({
      ...previous,
      coreSkills: [...getArray(previous.coreSkills), skill],
    }));
    setCoreSkillInput("");
  };

  const handleCoreSkillKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCoreSkill();
    }
    if (event.key === "Backspace" && !coreSkillInput && coreSkills.length > 0) {
      removeArrayItem("coreSkills", coreSkills.length - 1);
    }
  };

  // Key Achievements

  const [keyAchievementInput, setKeyAchievementInput] = useState("");

  const addKeyAchievement = () => {
    const achievement = cleanText(keyAchievementInput);
    if (!achievement) return;

    setResume((previous) => ({
      ...previous,
      keyAchievements: [...getArray(previous.keyAchievements), achievement],
    }));
    setKeyAchievementInput("");
  };

  const handleKeyAchievementKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addKeyAchievement();
    }
    if (event.key === "Backspace" && !keyAchievementInput && keyAchievements.length > 0) {
      removeArrayItem("keyAchievements", keyAchievements.length - 1);
    }
  };


  // Profile photo: resize/compress before storing it in the resume JSON.
  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPhotoError("");

    if (!file || !file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("Photo is too large. Please choose an image under 8 MB.");
      return;
    }

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(file);
      });

      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not decode the image."));
        img.src = dataUrl;
      });

      const maxDimension = 900;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
      canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("Your browser could not prepare the image.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      let quality = 0.82;
      let compressed = canvas.toDataURL("image/jpeg", quality);
      while (compressed.length > 550_000 && quality > 0.55) {
        quality -= 0.07;
        compressed = canvas.toDataURL("image/jpeg", quality);
      }
      if (compressed.length > 700_000) {
        setPhotoError("This image could not be compressed enough. Please choose a smaller photo.");
        return;
      }
      updatePersonal("photo", compressed);
    } catch (error) {
      console.error("Photo processing error:", error);
      setPhotoError(error?.message || "Could not process the photo.");
    }
  };


  // AI

  const runAI = async ({
    text,
    section,
    mode = "enhance",
    target,
  }) => {
    if (!text?.trim()) {
      return;
    }

    const loadingKey =
      `${section}-${target ?? "main"}`;

    setAiLoading(loadingKey);

    try {
      const response =
        mode === "proofread"
          ? await proofreadResumeText({
              text,
              section,
            })
          : await enhanceResumeText({
              text,
              section,
            });

      const result = cleanText(
        response.result ||
        response.text ||
        response.correctedText ||
        ""
      );

      if (!result) {
        throw new Error(
          "The AI service returned no suggested text."
        );
      }

      setAiReview({
        mode,
        section,
        target,
        result,

        issues: Array.isArray(response.issues)
          ? response.issues
          : [],
      });
    } catch (error) {
      console.error(
        "AI Assist error:",
        error
      );

      window.alert(
        error?.message ||
        "AI Assist could not complete the request."
      );
    } finally {
      setAiLoading(null);
    }
  };


  const proofread = ({
    text,
    section,
    target,
  }) => {
    runAI({
      text,
      section,
      target,
      mode: "proofread",
    });
  };


  const applyAIResult = () => {
    if (!aiReview) {
      return;
    }

    const {
      section,
      target,
      result,
    } = aiReview;

    if (section === "summary") {
      updateSummary(result);
    }

    if (
      section === "experience" &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "experience",
        target,
        "description",
        result
      );
    }

    if (
      section === "education" &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "education",
        target,
        "description",
        result
      );
    }

    if (
      (section === "project" ||
        section === "projects") &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "projects",
        target,
        "description",
        result
      );
    }

    setAiReview(null);
  };


  if (!resume) {
    return <LoadingScreen label="Preparing your resume" />;
  }


  // All form sections live here.
  // The individual section components only render fields.

  const sections = [
    {
      id: "personal",
      number: "01",
      title: "Personal Information",
      description: "Your identity and contact details",
      badge: "Essential",

      content: (
        <Personal
          personal={personal}
          updatePersonal={updatePersonal}
          handlePhotoUpload={handlePhotoUpload}
          photoError={photoError}
        />
      ),
    },

    {
      id: "summary",
      number: "02",
      title: "Professional Summary",
      description:
        "A concise introduction recruiters can scan quickly",

      content: (
        <Summary
          summary={resume.summary}
          updateSummary={updateSummary}
          runAI={runAI}
          proofread={proofread}
          aiLoading={aiLoading}
        />
      ),
    },

    {
      id: "experience",
      number: "03",
      title: "Work Experience",
      description:
        "Showcase your professional impact",
      badge: `${experience.length} ${
        experience.length === 1
          ? "position"
          : "positions"
      }`,

      content: (
        <Experience
          experience={experience}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addExperience={addExperience}
          runAI={runAI}
          proofread={proofread}
          aiLoading={aiLoading}
        />
      ),
    },

    {
      id: "education",
      number: "04",
      title: "Education",
      description:
        "Academic background and qualifications",
      badge: `${education.length} ${
        education.length === 1
          ? "entry"
          : "entries"
      }`,

      content: (
        <Education
          education={education}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addEducation={addEducation}
          runAI={runAI}
          aiLoading={aiLoading}
        />
      ),
    },

    {
      id: "skills",
      number: "05",
      title: "Skills",
      description:
        "Add technologies, tools and professional skills",
      badge: `${skills.length} ${
        skills.length === 1
          ? "skill"
          : "skills"
      }`,

      content: (
        <Skills
          skills={skills}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          addSkill={addSkill}
          handleSkillKeyDown={handleSkillKeyDown}
          removeArrayItem={removeArrayItem}
        />
      ),
    },

    {
      id: "certificates",
      number: "06",
      title: "Certificates",
      description:
        "Showcase professional certifications and credentials",
      badge: `${certificates.length} ${
        certificates.length === 1
          ? "certificate"
          : "certificates"
      }`,

      content: (
        <Certificates
          certificates={certificates}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addCertificate={addCertificate}
        />
      ),
    },

    {
      id: "languages",
      number: "07",
      title: "Languages",
      description:
        "List languages you can communicate in",
      badge: `${languages.length} ${
        languages.length === 1
          ? "language"
          : "languages"
      }`,

      content: (
        <Languages
          languages={languages}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addLanguage={addLanguage}
        />
      ),
    },

    {
      id: "hobbies",
      number: "08",
      title: "Hobbies & Interests",
      description:
        "Add interests that help show your personality",
      badge: `${hobbies.length} ${
        hobbies.length === 1
          ? "interest"
          : "interests"
      }`,

      content: (
        <Hobbies
          hobbies={hobbies}
          hobbyInput={hobbyInput}
          setHobbyInput={setHobbyInput}
          addHobby={addHobby}
          handleHobbyKeyDown={handleHobbyKeyDown}
          removeArrayItem={removeArrayItem}
        />
      ),
    },

    {
      id: "projects",
      number: "09",
      title: "Projects",
      description:
        "Highlight your strongest work",
      badge: `${projects.length} ${
        projects.length === 1
          ? "project"
          : "projects"
      }`,

      content: (
        <Projects
          projects={projects}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addProject={addProject}
          runAI={runAI}
          aiLoading={aiLoading}
        />
      ),
    },

    {
      id: "coreSkills",
      number: "10",
      title: "Core Skills",
      description: "Highlight leadership and soft skills",
      badge: `${coreSkills.length} ${
        coreSkills.length === 1 ? "skill" : "skills"
      }`,
      content: (
        <CoreSkills
          coreSkills={coreSkills}
          coreSkillInput={coreSkillInput}
          setCoreSkillInput={setCoreSkillInput}
          handleCoreSkillKeyDown={handleCoreSkillKeyDown}
          removeArrayItem={removeArrayItem}
        />
      ),
    },

    {
      id: "keyAchievements",
      number: "11",
      title: "Key Achievements",
      description: "Your most impressive outcomes",
      badge: `${keyAchievements.length} ${
        keyAchievements.length === 1 ? "achievement" : "achievements"
      }`,
      content: (
        <KeyAchievements
          keyAchievements={keyAchievements}
          keyAchievementInput={keyAchievementInput}
          setKeyAchievementInput={setKeyAchievementInput}
          handleKeyAchievementKeyDown={handleKeyAchievementKeyDown}
          removeArrayItem={removeArrayItem}
        />
      ),
    },

    {
      id: "additionalInformation",
      number: "12",
      title: "Additional Information",
      description: "Any other valuable information",
      badge: `${additionalInformation.length} ${
        additionalInformation.length === 1 ? "section" : "sections"
      }`,
      content: (
        <AdditionalInfo
          additionalInformation={additionalInformation}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
          addAdditionalInfo={addAdditionalInfo}
        />
      ),
    },
  ];

  const activeSectionContent = sections.find((section) => section.id === activeStepId);


  const sectionMeta = {
    personal: { eyebrow: "Start here", tip: "Use the name and title you want recruiters to remember. Keep contact details current and professional.", fields: "5 essential fields", accent: "blue" },
    summary: { eyebrow: "Your positioning", tip: "Aim for 2–4 lines that combine your experience, specialty and the value you bring.", fields: "80–120 words", accent: "blue" },
    experience: { eyebrow: "Proof of impact", tip: "Lead with outcomes, not duties. Strong bullets usually include an action, a contribution and a measurable result.", fields: `${experience.length} ${experience.length === 1 ? "position" : "positions"}`, accent: "green" },
    education: { eyebrow: "Your background", tip: "Add the qualification most relevant to the role first. Older or less relevant education can stay concise.", fields: `${education.length} ${education.length === 1 ? "entry" : "entries"}`, accent: "slate" },
    skills: { eyebrow: "Searchable strengths", tip: "Prioritize skills that are genuinely relevant to the role. Put the strongest and most requested ones first.", fields: `${skills.length} added`, accent: "blue" },
    coreSkills: { eyebrow: "Core strengths", tip: "Use this for a short set of high-signal capabilities that define your professional profile.", fields: `${coreSkills.length} added`, accent: "slate" },
    keyAchievements: { eyebrow: "Standout wins", tip: "Choose achievements that prove scope, ownership or business impact rather than repeating job duties.", fields: `${keyAchievements.length} added`, accent: "amber" },
    certificates: { eyebrow: "Credentials", tip: "Include certifications that strengthen your fit for the target role or demonstrate current expertise.", fields: `${certificates.length} ${certificates.length === 1 ? "certificate" : "certificates"}`, accent: "slate" },
    languages: { eyebrow: "Communication", tip: "Use a clear proficiency label such as Native, Fluent, Professional or Conversational.", fields: `${languages.length} ${languages.length === 1 ? "language" : "languages"}`, accent: "green" },
    hobbies: { eyebrow: "Human detail", tip: "Keep this focused. A few specific interests can add personality without taking space from your professional story.", fields: `${hobbies.length} added`, accent: "amber" },
    projects: { eyebrow: "Selected work", tip: "Show what you built, your contribution and the technologies or methods that matter for the role.", fields: `${projects.length} ${projects.length === 1 ? "project" : "projects"}`, accent: "blue" },
    additionalInformation: { eyebrow: "Anything else", tip: "Use custom sections only when they strengthen your candidacy, such as awards, volunteering or publications.", fields: `${additionalInformation.length} ${additionalInformation.length === 1 ? "section" : "sections"}`, accent: "slate" },
  };

  const meta = sectionMeta[activeStepId] || { eyebrow: "Resume section", tip: "Keep the information concise, relevant and easy to scan.", fields: "", accent: "blue" };
  const accentClasses = {
    blue: "bg-[#EAF5FA] text-[#087CB8] border-[#D6E9F0]",
    green: "bg-[#EAF5F0] text-[#27865B] border-[#D5EADF]",
    amber: "bg-[#F8F1E4] text-[#8A5B35] border-[#E9DDC5]",
    slate: "bg-[#F2F2EF] text-[#626870] border-[#E0E0DB]",
  };

  return (
    <>
      <div className="w-full">
        {activeSectionContent ? (
          <div>
            <div className={`mb-5 border ${accentClasses[meta.accent]} px-4 py-3.5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.17em]">{meta.eyebrow}</div>
                  <p className="mt-1.5 text-[11px] leading-5 text-[#5F655F]">{meta.tip}</p>
                </div>
                {meta.fields && <span className="shrink-0 text-[9px] font-mono uppercase tracking-[0.12em] opacity-80">{meta.fields}</span>}
              </div>
            </div>
            <div className="space-y-5">{activeSectionContent.content}</div>
          </div>
        ) : (
          <div className="border border-[#E2E4E6] bg-[#F7F7F5] px-4 py-8 text-sm text-[#626870]">Section not found.</div>
        )}
      </div>

      <AIReviewPanel
        review={aiReview}
        onApply={applyAIResult}
        onClose={() => setAiReview(null)}
      />
    </>
  );
};

export default Form;
