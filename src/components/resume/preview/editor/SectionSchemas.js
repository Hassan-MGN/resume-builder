export const ArraySections = ["experience","projects","education","certificates","languages","skills","coreSkills","keyAchievements","hobbies","additionalInformation"];

export const SectionSchemas = {
  experience: {type: "array", label: "Experience", defaultItem: {position: "",company: "",startDate: "",endDate: "",description: "",responsibilities: [],},
    fields: [{ key: "position", label: "Job Title", type: "text" },{ key: "company", label: "Company", type: "text" },{ key: "startDate", label: "Start Date", type: "text" },{ key: "endDate", label: "End Date", type: "text" },{ key: "description", label: "Description", type: "textarea" },
      { key: "responsibilities", label: "Responsibilities", type: "stringArray", addLabel: "+ Add bullet" },]
  },
  projects: {type: "array", label: "Project", defaultItem: { name: "", link: "", description: "", technologies: ""},
    fields: [{ key: "name", label: "Project Name", type: "text" },{ key: "link", label: "Project URL", type: "text" }, { key: "description", label: "Description", type: "textarea" },{ key: "technologies", label: "Technologies", type: "text" },]
  },
  education: {type: "array", label: "Education", defaultItem: { degree: "", institution: "", startDate: "", endDate: "",description: ""},
    fields: [{ key: "degree", label: "Degree", type: "text" },{ key: "institution", label: "Institution", type: "text" },{ key: "startDate", label: "Start Date", type: "text" },{ key: "endDate", label: "End Date", type: "text" },{ key: "description", label: "Description", type: "textarea" },]
  },
  certificates: {type: "array", label: "Certificate", defaultItem: {name: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "",},
    fields: [{ key: "name", label: "Certificate Name", type: "text" },{ key: "issuer", label: "Issuer", type: "text" },{ key: "issueDate", label: "Issue Date", type: "text" },{ key: "expiryDate", label: "Expiry Date", type: "text" },{ key: "credentialId", label: "Credential ID", type: "text" },{ key: "credentialUrl", label: "Credential URL", type: "text" },]
  },
  languages: {type: "array", label: "Language", defaultItem: {language: "", proficiency: "",},
    fields: [{ key: "language", label: "Language", type: "text" },{ key: "proficiency", label: "Proficiency", type: "text" },]
  },
  additionalInformation: {type: "array",label: "Information Block", defaultItem: {heading: "", link: "",content: "", bullets: [],},
    fields: [{ key: "heading", label: "Heading", type: "text" },{ key: "link", label: "Link", type: "text" },{ key: "content", label: "Content", type: "textarea" },{ key: "bullets", label: "Bullets", type: "stringArray", addLabel: "+ Add bullet" },]
  },
  skills: {type: "stringArray", label: "Skill", defaultItem: "",},
  coreSkills: {type: "stringArray", label: "Core Skill", defaultItem: "",},
  keyAchievements: {type: "stringArray", label: "Achievement", defaultItem: "",},
  hobbies: {type: "stringArray", label: "Hobby", defaultItem: "",},
};
