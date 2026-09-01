import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// ================================
// RESUME SCHEMA
// ================================

const resumeSchema = {
  type: "object",
  properties: {
    personal: {
      type: "object",
      properties: {
        fullname: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        website: { type: "string" },
        photo: { type: "string" },
        title: { type: "string" },
      },
      required: ["fullname", "email", "phone", "location", "linkedin", "website", "photo", "title"],
    },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          position: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "string" },
          responsibilities: { type: "array", items: { type: "string" } },
        },
        required: ["company", "position", "startDate", "endDate", "description", "responsibilities"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "string" },
        },
        required: ["institution", "degree", "startDate", "endDate", "description"],
      },
    },
    skills: { type: "array", items: { type: "string" } },
    coreSkills: { type: "array", items: { type: "string" } },
    keyAchievements: { type: "array", items: { type: "string" } },
    certificates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          issuer: { type: "string" },
          issueDate: { type: "string" },
          expiryDate: { type: "string" },
          credentialId: { type: "string" },
          credentialUrl: { type: "string" },
        },
        required: ["name", "issuer", "issueDate", "expiryDate", "credentialId", "credentialUrl"],
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language: { type: "string" },
          proficiency: { type: "string" },
        },
        required: ["language", "proficiency"],
      },
    },
    hobbies: { type: "array", items: { type: "string" } },
    additionalInformation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["heading", "content", "bullets"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          technologies: { type: "string" },
          link: { type: "string" },
        },
        required: ["name", "description", "technologies", "link"],
      },
    },
  },
  // certificates, languages, hobbies are now required so Gemini cannot omit them
  required: [
    "personal", "summary", "experience", "education",
    "skills", "coreSkills", "keyAchievements",
    "certificates", "languages", "hobbies",
    "projects", "additionalInformation",
  ],
};

// ================================
// PDF/DOCX TEXT EXTRACTION
// ================================

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n\n";
  }
  return fullText;
};

const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const extractFileText = async (file) => {
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "pdf") return await extractPdfText(file);
  if (extension === "docx") return await extractDocxText(file);
  if (extension === "doc") {
    throw new Error("Old .doc files are not supported. Please save as .docx or PDF.");
  }
  throw new Error("Unsupported file format.");
};

// ================================
// NORMALIZATION CONSTANTS
// ================================

const KNOWN_LANGUAGES = new Set([
  "english", "hindi", "urdu", "french", "german", "spanish", "italian", "portuguese",
  "arabic", "chinese", "mandarin", "cantonese", "japanese", "korean", "russian", "turkish",
  "dutch", "swedish", "norwegian", "danish", "finnish", "polish", "romanian",
  "hungarian", "greek", "hebrew", "persian", "farsi", "punjabi", "bengali",
  "tamil", "telugu", "kannada", "malayalam", "marathi", "gujarati", "swahili",
  "vietnamese", "thai", "malay", "indonesian", "tagalog", "ukrainian", "czech",
  "slovak", "bulgarian", "serbian", "croatian", "slovenian", "latvian", "lithuanian",
]);

const PROFICIENCY_WORDS = new Set([
  "native", "fluent", "proficient", "intermediate", "basic", "beginner",
  "advanced", "conversational", "professional", "mother tongue", "bilingual",
  "c1", "c2", "b1", "b2", "a1", "a2",
  "elementary", "upper intermediate", "working proficiency", "business level",
  "full professional",
]);

const CERT_EXPLICIT_KEYWORDS = ["certified", "certification", "certificate"];
const CERT_KNOWN_ACRONYMS = new Set([
  "pmp", "cissp", "cpa", "cfa", "cism", "cisa", "ccna", "ccnp", "ccie",
  "rhce", "rhcsa", "mcsa", "mcse", "aws", "gcp", "prince2", "itil",
  "comptia", "togaf", "capm", "csm", "safe",
]);

const SOFT_SKILLS = new Set([
  "leadership", "communication", "team management", "problem solving",
  "project management", "strategic planning", "teamwork", "adaptability",
  "critical thinking", "time management", "conflict resolution",
  "emotional intelligence", "creativity", "decision making", "mentoring",
  "coaching", "negotiation", "presentation", "public speaking",
  "interpersonal skills", "collaboration", "analytical thinking",
  "organizational skills", "people management", "stakeholder management",
]);

const LANGUAGE_HEADINGS = new Set([
  "languages", "language skills", "spoken languages", "linguistic skills",
  "language proficiency", "languages spoken",
]);
const CERTIFICATE_HEADINGS = new Set([
  "certifications", "certificates", "professional certifications",
  "licenses", "credentials", "accreditations", "qualifications",
  "professional qualifications", "professional development",
]);
const SKILL_HEADINGS = new Set([
  "technical expertise", "technical skills", "technical stack", "technologies",
  "tools", "skills", "areas of expertise", "technical competencies",
  "key skills", "professional skills", "it skills", "programming languages",
  "frameworks", "software", "tools and technologies", "core competencies",
  "expertise", "technical knowledge", "technical proficiency",
]);
const ACHIEVEMENT_HEADINGS = new Set([
  "highlights", "career highlights", "key highlights", "accomplishments",
  "major achievements", "awards", "awards and honors", "recognition",
  "notable achievements", "key wins", "wins", "notable accomplishments",
  "achievements", "key achievements",
]);
const HOBBY_HEADINGS = new Set([
  "hobbies", "interests", "hobbies and interests", "personal interests",
  "extracurricular", "activities", "personal activities",
]);

// ================================
// NORMALIZATION HELPERS
// ================================

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const normLangKey = (lang) => lang?.toLowerCase()?.trim() || "";

/**
 * Detects if a SHORT string (single item/bullet) is a language entry.
 * Uses Unicode escape for em-dash (\u2013, \u2014) to avoid encoding issues.
 */
const looksLikeLanguage = (text) => {
  if (!text || text.length > 80) return false;
  const lower = text.toLowerCase().trim();
  if (KNOWN_LANGUAGES.has(lower)) return true;

  // Split on separators: -, en-dash, em-dash, (, ), |, /, :, ,
  const separatorParts = lower.split(/\s*[-\u2013\u2014()|\/\:,]\s*/);
  const hasLanguage = separatorParts.some(p => KNOWN_LANGUAGES.has(p.trim()));
  const hasProficiency = separatorParts.some(p => PROFICIENCY_WORDS.has(p.trim()));
  if (hasLanguage && hasProficiency) return true;

  // "Fluent in English", "Native English speaker"
  const inMatch = /\b(fluent|native|proficient|intermediate|advanced|conversational|basic)\s+in\s+(\w+)/i.exec(lower);
  if (inMatch && KNOWN_LANGUAGES.has(inMatch[2])) return true;
  const nativeMatch = /\b(\w+)\s+(native|speaker)\b/i.exec(lower);
  if (nativeMatch && KNOWN_LANGUAGES.has(nativeMatch[1])) return true;

  return false;
};

/**
 * Parses a SHORT language string into { language, proficiency }.
 */
const parseLanguageEntry = (text) => {
  // Separator: "English - Native", "French (B2)", "Hindi | Fluent"
  const sepMatch = text.match(/^([^\u2013\u2014\-(|\/:,]+)\s*[-\u2013\u2014(|\/:,]\s*([^)]+)\)?$/);
  if (sepMatch) {
    return {
      language: capitalize(sepMatch[1].trim()),
      proficiency: capitalize(sepMatch[2].trim().replace(/\)$/, "").trim()),
    };
  }
  // "Fluent in English"
  const inMatch = /\b(fluent|native|proficient|intermediate|advanced|conversational|basic)\s+in\s+(\w+)/i.exec(text);
  if (inMatch && KNOWN_LANGUAGES.has(inMatch[2].toLowerCase())) {
    return { language: capitalize(inMatch[2]), proficiency: capitalize(inMatch[1]) };
  }
  // Scan for known language
  const lower = text.toLowerCase();
  for (const lang of KNOWN_LANGUAGES) {
    if (lower.includes(lang)) {
      const idx = lower.indexOf(lang);
      const detectedLang = capitalize(text.substring(idx, idx + lang.length));
      for (const prof of PROFICIENCY_WORDS) {
        if (lower.includes(prof)) {
          const pidx = lower.indexOf(prof);
          return { language: detectedLang, proficiency: capitalize(text.substring(pidx, pidx + prof.length)) };
        }
      }
      return { language: detectedLang, proficiency: "" };
    }
  }
  return { language: capitalize(text.trim()), proficiency: "" };
};

/**
 * Extract language entries from a PARAGRAPH.
 * Returns { language, proficiency }[] without modifying the source text.
 */
const extractLanguagesFromParagraph = (text) => {
  if (!text || typeof text !== "string") return [];
  const found = [];

  // "Fluent in English and Hindi"
  const inPattern = /\b(fluent|native|proficient|intermediate|advanced|conversational|basic)\s+in\s+((?:\w+(?:\s+and\s+)?)+)/gi;
  let match;
  while ((match = inPattern.exec(text)) !== null) {
    const proficiency = capitalize(match[1]);
    const langs = match[2].split(/\s+and\s+/i).map(l => l.trim()).filter(Boolean);
    langs.forEach(lang => {
      if (KNOWN_LANGUAGES.has(lang.toLowerCase())) {
        found.push({ language: capitalize(lang), proficiency });
      }
    });
  }

  // "English - Native", "Hindi (Fluent)" inline in paragraph
  const sepPattern = /\b([A-Z][a-z]+)\s*[-\u2013\u2014(|\/:]\s*(native|fluent|proficient|intermediate|advanced|conversational|basic|c[12]|b[12]|a[12])\b/g;
  while ((match = sepPattern.exec(text)) !== null) {
    const lang = match[1].trim();
    const prof = match[2].trim();
    if (KNOWN_LANGUAGES.has(lang.toLowerCase())) {
      found.push({ language: capitalize(lang), proficiency: capitalize(prof) });
    }
  }

  return found;
};

/**
 * High-confidence certificate detection for short strings.
 * Only matches explicit certification language or known acronyms.
 * Does NOT match plain technology names like "java" or "python".
 */
const looksLikeCertificate = (text) => {
  if (!text || text.length > 150) return false;
  const lower = text.toLowerCase().trim();
  if (CERT_EXPLICIT_KEYWORDS.some(kw => lower.includes(kw))) return true;
  for (const acronym of CERT_KNOWN_ACRONYMS) {
    if (new RegExp(`\\b${acronym}\\b`).test(lower)) return true;
  }
  return false;
};

// ================================
// MAIN NORMALIZATION
// ================================

const normalizeResumeData = (raw) => {
  const data = { ...raw };

  // Ensure all arrays exist
  data.languages = Array.isArray(data.languages) ? [...data.languages] : [];
  data.certificates = Array.isArray(data.certificates) ? [...data.certificates] : [];
  data.skills = Array.isArray(data.skills) ? [...data.skills] : [];
  data.coreSkills = Array.isArray(data.coreSkills) ? [...data.coreSkills] : [];
  data.keyAchievements = Array.isArray(data.keyAchievements) ? [...data.keyAchievements] : [];
  data.hobbies = Array.isArray(data.hobbies) ? [...data.hobbies] : [];
  data.additionalInformation = Array.isArray(data.additionalInformation) ? [...data.additionalInformation] : [];
  data.experience = Array.isArray(data.experience) ? data.experience : [];
  data.education = Array.isArray(data.education) ? data.education : [];

  // Deduplication registries (seeded from Gemini's output)
  const langReg = new Set(data.languages.map(l => normLangKey(l.language)));
  const certReg = new Set(data.certificates.map(c => c.name?.toLowerCase()?.trim()));
  const skillReg = new Set([
    ...data.skills.map(s => String(s).toLowerCase().trim()),
    ...data.coreSkills.map(s => String(s).toLowerCase().trim()),
  ]);
  const achieveReg = new Set(data.keyAchievements.map(a => String(a).toLowerCase().trim()));
  const hobbyReg = new Set(data.hobbies.map(h => String(h).toLowerCase().trim()));

  // Safe adders - idempotent, deduplication-aware
  const addLang = (lang, prof = "") => {
    const key = normLangKey(lang);
    if (!key || langReg.has(key)) return false;
    langReg.add(key);
    data.languages.push({ language: capitalize(lang), proficiency: prof ? capitalize(prof) : "" });
    return true;
  };
  const addCert = (name) => {
    const key = name?.toLowerCase()?.trim();
    if (!key || certReg.has(key)) return false;
    certReg.add(key);
    data.certificates.push({ name: name.trim(), issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" });
    return true;
  };
  const addSkill = (skill) => {
    const key = skill?.toLowerCase()?.trim();
    if (!key || skillReg.has(key)) return false;
    skillReg.add(key);
    data.skills.push(skill.trim());
    return true;
  };
  const addCoreSkill = (skill) => {
    const key = skill?.toLowerCase()?.trim();
    if (!key || skillReg.has(key)) return false;
    skillReg.add(key);
    data.coreSkills.push(skill.trim());
    return true;
  };
  const addHobby = (h) => {
    const key = h?.toLowerCase()?.trim();
    if (!key || hobbyReg.has(key)) return false;
    hobbyReg.add(key);
    data.hobbies.push(h.trim());
    return true;
  };
  const addAchievement = (a) => {
    const key = a?.toLowerCase()?.trim();
    if (!key || achieveReg.has(key)) return false;
    achieveReg.add(key);
    data.keyAchievements.push(a.trim());
    return true;
  };

  // STEP 1: Normalize experience.responsibilities to arrays
  data.experience = data.experience.map(exp => ({
    ...exp,
    responsibilities: Array.isArray(exp.responsibilities)
      ? exp.responsibilities
      : (typeof exp.responsibilities === "string"
        ? exp.responsibilities.split("\n").map(s => s.trim()).filter(Boolean)
        : []),
  }));

  // STEP 2: Move soft skills from skills[] to coreSkills[]
  for (let i = data.skills.length - 1; i >= 0; i--) {
    const skill = data.skills[i];
    if (SOFT_SKILLS.has(skill.toLowerCase().trim())) {
      data.skills.splice(i, 1);
      skillReg.delete(skill.toLowerCase().trim());
      addCoreSkill(skill);
    }
  }

  // STEP 3: Cross-field paragraph scanning
  // Additive — extracts languages from paragraphs without touching the source text.
  const scanParagraph = (text) => {
    if (!text || typeof text !== "string") return;
    extractLanguagesFromParagraph(text).forEach(({ language, proficiency }) => addLang(language, proficiency));
  };

  scanParagraph(data.summary);
  data.experience.forEach(exp => {
    scanParagraph(exp.description);
    if (Array.isArray(exp.responsibilities)) {
      exp.responsibilities.forEach(r => {
        // Single responsibility bullet that is itself a language entry
        if (looksLikeLanguage(r)) {
          const parsed = parseLanguageEntry(r);
          addLang(parsed.language, parsed.proficiency);
        }
      });
    }
  });

  // STEP 4: Reclassify additionalInformation blocks
  const remainingBlocks = [];

  for (const block of data.additionalInformation) {
    const headingLower = (block.heading || "").toLowerCase().trim();
    const content = (block.content || "").trim();
    const bullets = Array.isArray(block.bullets) ? block.bullets.filter(b => b && b.trim()) : [];

    const tryRescueItems = (items, rescueFn) => {
      let rescued = false;
      for (const item of items) {
        if (rescueFn(item)) rescued = true;
      }
      return rescued;
    };

    const sourceItems = bullets.length
      ? bullets
      : content.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    const sourceItemsSemi = bullets.length
      ? bullets
      : content.split(/[;\n]/).map(s => s.trim()).filter(Boolean);

    // Heading-based rescue
    if (LANGUAGE_HEADINGS.has(headingLower)) {
      const rescued = tryRescueItems(sourceItems, (item) => {
        if (!looksLikeLanguage(item)) return false;
        const parsed = parseLanguageEntry(item);
        return addLang(parsed.language, parsed.proficiency);
      });
      if (rescued) continue;
    }

    if (CERTIFICATE_HEADINGS.has(headingLower)) {
      if (tryRescueItems(sourceItemsSemi, addCert)) continue;
    }

    if (SKILL_HEADINGS.has(headingLower)) {
      const rescued = tryRescueItems(sourceItems, (item) => {
        if (!item) return false;
        return SOFT_SKILLS.has(item.toLowerCase()) ? addCoreSkill(item) : addSkill(item);
      });
      if (rescued) continue;
    }

    if (ACHIEVEMENT_HEADINGS.has(headingLower)) {
      if (tryRescueItems(sourceItemsSemi, addAchievement)) continue;
    }

    if (HOBBY_HEADINGS.has(headingLower)) {
      if (tryRescueItems(sourceItems, addHobby)) continue;
    }

    // Bullet-level semantic scan for unrecognized / mixed headings
    // High-confidence items go to structured fields.
    // Ambiguous items stay in additionalInformation.
    const unclaimedBullets = [];
    for (const bullet of bullets) {
      if (looksLikeLanguage(bullet)) {
        const parsed = parseLanguageEntry(bullet);
        addLang(parsed.language, parsed.proficiency);
      } else if (looksLikeCertificate(bullet)) {
        addCert(bullet);
      } else if (SOFT_SKILLS.has(bullet.toLowerCase().trim())) {
        addCoreSkill(bullet);
      } else {
        unclaimedBullets.push(bullet); // Cannot classify confidently - preserve
      }
    }

    // Scan paragraph content for languages (additive)
    scanParagraph(content);

    // Keep block only if it has remaining information
    if (content || unclaimedBullets.length > 0) {
      remainingBlocks.push({
        heading: block.heading || "",
        content: content,
        bullets: unclaimedBullets,
      });
    }
  }

  data.additionalInformation = remainingBlocks;

  // STEP 5: Final deduplication across all string arrays
  const dedupeStr = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
      const key = String(item).toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  data.skills = dedupeStr(data.skills);
  data.coreSkills = dedupeStr(data.coreSkills);
  data.keyAchievements = dedupeStr(data.keyAchievements);
  data.hobbies = dedupeStr(data.hobbies);

  const seenLangs = new Set();
  data.languages = data.languages.filter(l => {
    const key = normLangKey(l.language);
    if (!key || seenLangs.has(key)) return false;
    seenLangs.add(key);
    return true;
  });

  const seenCerts = new Set();
  data.certificates = data.certificates.filter(c => {
    const key = c.name?.toLowerCase()?.trim();
    if (!key || seenCerts.has(key)) return false;
    seenCerts.add(key);
    return true;
  });

  return data;
};

// ================================
// GEMINI PROMPT
// ================================

const buildPrompt = (resumeText) => `
You are an expert CV/resume information extractor. Produce a structured JSON object containing ALL meaningful information from the CV text below.

EXTRACTION PHILOSOPHY
Think in two stages:
STAGE 1 - UNDERSTAND ALL CONTENT: Read every line. Identify every piece of meaningful information regardless of which section heading it appears under.
STAGE 2 - CLASSIFY BY MEANING: Place each piece into the correct schema field based on its CONTENT, not its heading. A heading is only a hint.

STRICT RULES
1. NEVER lose information. If something cannot be confidently classified, put it in additionalInformation.
2. NEVER flatten bullet points into a paragraph. Keep them as arrays.
3. NEVER invent, guess, or hallucinate data not in the CV.
4. PRESERVE original text. If a language appears in the summary, keep the full summary AND also add the language to languages[].
5. NEVER put a heading on an additionalInformation block if the original CV has no heading there.

CLASSIFICATION RULES

LANGUAGES - languages[]
A language entry is a human language name (English, Hindi, French...) optionally with a proficiency level (Native, Fluent, B2, C1...).
Extract EVERY language entry from ANY section.
Patterns: "English - Native", "Hindi (Fluent)", "Fluent in English", "French | B2"
Even if buried in Additional Information, Skills, or Summary - extract to languages[].
Format: { language: "English", proficiency: "Native" }
If no proficiency stated, use proficiency: ""

CERTIFICATIONS - certificates[]
A certification is a professionally earned credential.
Strong signals: words Certified, Certification, Certificate appear.
Known acronyms: AWS, PMP, CISSP, CCNA, CCNP, CPA, CFA, ITIL, Prince2, CompTIA, GCP
DO NOT treat plain technology skills like Python, React, Java as certifications.
Extract from any section. Only fill issuer/issueDate/credentialId/credentialUrl if explicitly stated; otherwise use "".

SKILLS - skills[]
Technical and hard skills: programming languages, frameworks, databases, tools, platforms.

CORE SKILLS - coreSkills[]
Leadership and soft skills: Leadership, Communication, Project Management, Teamwork, Strategic Planning, Problem Solving.
DO NOT put soft skills inside skills[]. Separate them by meaning.
DO NOT put languages inside skills[].

KEY ACHIEVEMENTS - keyAchievements[]
Quantified outcomes and notable accomplishments. Example: "Increased revenue by 35%", "Led a team of 12".

EXPERIENCE - experience[]
Work history entries. responsibilities MUST be an array of strings, NEVER a single paragraph.

EDUCATION - education[]
Degrees, diplomas, schools.

PROJECTS - projects[]
Distinct scoped projects with a project name. Do NOT turn job responsibilities into projects.

HOBBIES - hobbies[]
Personal interests.

additionalInformation[]
Use ONLY for genuinely uncategorized content: work authorization, references, volunteer work, publications.
heading: original heading if present, else ""
content: paragraph text if any, else ""
bullets: array of bullet strings if any, else []
NEVER invent a heading or content that is not in the original CV.

SELF-CHECK BEFORE OUTPUT
1. Did every language entry end up in languages[]?
2. Did every certification end up in certificates[]?
3. Are responsibilities arrays (not paragraphs)?
4. Is any information lost?
5. Are skills and coreSkills separated correctly?

CV TEXT:
${resumeText}
`;

// ================================
// GEMINI API CALL
// ================================

const analyzeResumeText = async (resumeText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: buildPrompt(resumeText),
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    if (!response.text) {
      throw new Error("AI returned an empty response.");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("[cvParser] Gemini error:", error);
    if (error?.status === 429 || error?.message?.includes("429")) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    }
    if (error instanceof SyntaxError) {
      throw new Error("AI returned malformed JSON. Please try again.");
    }
    if (error?.message?.includes("API key")) {
      throw new Error("Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY.");
    }
    throw new Error(error.message || "Failed to analyze resume with Gemini.");
  }
};

// ================================
// MAIN EXPORT
// ================================

export const parseCV = async (file) => {
  if (!file) throw new Error("No CV file was provided.");

  console.log("[cvParser] Extracting text from:", file.name);
  const text = await extractFileText(file);

  if (!text || text.trim().length < 30) {
    throw new Error(
      "Could not extract enough text from this CV. The file may be image-based or password protected."
    );
  }

  console.log("[cvParser] Sending to Gemini...");
  const rawData = await analyzeResumeText(text);
  console.log("[cvParser] Raw Gemini response:", rawData);

  const resumeData = normalizeResumeData(rawData);
  console.log("[cvParser] Normalized resume data:", resumeData);

  return resumeData;
};
