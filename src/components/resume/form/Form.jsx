import React, { useMemo, useState } from "react";

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


const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};


const stripEmojis = (text = "") => {
  return String(text)
    .replace(
      /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu,
      ""
    )
    .replace(
      /[\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
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


  // Profile photo

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (
      !file ||
      !file.type.startsWith("image/")
    ) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updatePersonal("photo", reader.result);
    };

    reader.readAsDataURL(file);

    event.target.value = "";
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
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-[#F4F6F8]">
        <div className="text-sm text-slate-500">
          Loading resume...
        </div>
      </div>
    );
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


  // Provide completion percentage back to wizard if needed
  React.useEffect(() => {
    if (typeof activeSection === "function") {
      // If we decide to pass a callback to report completion
    }
  }, [completion]);

  const activeSectionContent = useMemo(() => {
    return sections.find(s => s.id === activeStepId);
  }, [sections, activeStepId]);

  return (
    <>
      <div className="w-full">
        {activeSectionContent ? (
          <div>
            {activeSectionContent.content}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Section not found.</div>
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