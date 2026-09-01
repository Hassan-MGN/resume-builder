import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
      required: [
        "fullname",
        "email",
        "phone",
        "location",
        "linkedin",
        "website",
        "photo",
        "title",
      ],
    },

    summary: {
      type: "string",
    },

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
          responsibilities: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "company",
          "position",
          "startDate",
          "endDate",
          "description",
          "responsibilities",
        ],
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
        required: [
          "institution",
          "degree",
          "startDate",
          "endDate",
          "description",
        ],
      },
    },

    skills: {
      type: "array",
      items: {
        type: "string",
      },
    },

    coreSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },

    keyAchievements: {
      type: "array",
      items: {
        type: "string",
      },
    },

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

    hobbies: {
      type: "array",
      items: {
        type: "string",
      },
    },

    additionalInformation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string" },
          },
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
        required: [
          "name",
          "description",
          "technologies",
          "link",
        ],
      },
    },
  },

  required: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "coreSkills",
    "keyAchievements",
    "projects",
    "additionalInformation",
  ],
};

// ================================
// EXTRACT PDF TEXT
// ================================

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let fullText = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    fullText += pageText + "\n\n";
  }

  return fullText;
};

// ================================
// EXTRACT DOCX TEXT
// ================================

const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer,
  });

  return result.value;
};

// ================================
// EXTRACT FILE TEXT
// ================================

const extractFileText = async (file) => {
  const extension = file.name
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "pdf") {
    return await extractPdfText(file);
  }

  if (extension === "docx") {
    return await extractDocxText(file);
  }

  if (extension === "doc") {
    throw new Error(
      "Old .doc files are not supported directly in the browser. Please save the CV as .docx or PDF."
    );
  }

  throw new Error("Unsupported file format.");
};

// ================================
// SEMANTIC NORMALIZATION
// Reclassifies information that Gemini may have placed in the wrong field.
// This runs AFTER Gemini extraction as a post-processing step.
// ================================

/**
 * Detects if a string looks like a language entry.
 * Examples: "English – Native", "Hindi (Fluent)", "French"
 */
const KNOWN_LANGUAGES = new Set([
  "english", "hindi", "urdu", "french", "german", "spanish", "italian", "portuguese",
  "arabic", "chinese", "mandarin", "japanese", "korean", "russian", "turkish",
  "dutch", "swedish", "norwegian", "danish", "finnish", "polish", "romanian",
  "hungarian", "greek", "hebrew", "persian", "farsi", "punjabi", "bengali",
  "tamil", "telugu", "kannada", "malayalam", "marathi", "gujarati", "swahili",
]);

const PROFICIENCY_WORDS = new Set([
  "native", "fluent", "proficient", "intermediate", "basic", "beginner",
  "advanced", "conversational", "professional", "mother tongue", "bilingual",
  "c1", "c2", "b1", "b2", "a1", "a2",
]);

const looksLikeLanguage = (text) => {
  const lower = text.toLowerCase().trim();
  // If the entire text is a known language name
  if (KNOWN_LANGUAGES.has(lower)) return true;
  // If text contains a known language + proficiency separator
  const parts = lower.split(/[-–—()/,]/);
  const hasLanguage = parts.some(p => KNOWN_LANGUAGES.has(p.trim()));
  const hasProficiency = parts.some(p => PROFICIENCY_WORDS.has(p.trim()));
  return hasLanguage && (hasProficiency || parts.length === 1);
};

/**
 * Parses a language string into { language, proficiency } object.
 * Handles: "English – Native", "Hindi (Fluent)", "English", "French - B2"
 */
const parseLanguageEntry = (text) => {
  const separatorMatch = text.match(/^([^–—\-(]+)\s*[-–—(]\s*([^)]+)\)?$/);
  if (separatorMatch) {
    return {
      language: separatorMatch[1].trim(),
      proficiency: separatorMatch[2].trim().replace(/\)$/, ""),
    };
  }
  return { language: text.trim(), proficiency: "" };
};

/**
 * Detects if text looks like a certificate/certification.
 */
const CERT_KEYWORDS = [
  "certified", "certification", "certificate", "aws", "azure", "gcp", "google cloud",
  "microsoft", "pmp", "cissp", "cpa", "cfa", "six sigma", "prince2", "itil",
  "comptia", "cisco", "ccna", "ccnp", "rhce", "java", "oracle", "scrum", "agile",
];

const looksLikeCertificate = (text) => {
  const lower = text.toLowerCase();
  return CERT_KEYWORDS.some(kw => lower.includes(kw));
};

/**
 * Detects if a heading/content block looks like it belongs in a specific field.
 * Returns the target field name or null if no strong match.
 */
const SKILL_HEADINGS = new Set([
  "technical expertise", "technical skills", "technical stack", "technologies",
  "tools", "skills", "core skills", "competencies", "areas of expertise",
  "technical competencies", "key skills", "professional skills", "it skills",
  "programming languages", "frameworks", "software", "tools and technologies",
]);

const ACHIEVEMENT_HEADINGS = new Set([
  "highlights", "career highlights", "key highlights", "accomplishments",
  "major achievements", "awards", "awards and honors", "recognition",
  "notable achievements", "key wins", "wins", "notable accomplishments",
]);

const EXPERIENCE_HEADINGS = new Set([
  "professional background", "career history", "employment history",
  "work history", "professional experience", "career experience",
  "work experience", "employment", "professional history",
]);

const PROJECT_HEADINGS = new Set([
  "selected work", "portfolio", "major projects", "selected projects",
  "key projects", "personal projects", "open source", "notable projects",
]);

const EDUCATION_HEADINGS = new Set([
  "academic background", "academic history", "educational background",
  "qualifications", "academic qualifications", "academic credentials",
  "education and training",
]);

const LANGUAGE_HEADINGS = new Set([
  "languages", "language skills", "spoken languages", "linguistic skills",
]);

const CERTIFICATE_HEADINGS = new Set([
  "certifications", "certificates", "professional certifications",
  "licenses", "credentials", "accreditations",
]);

const HOBBY_HEADINGS = new Set([
  "hobbies", "interests", "hobbies and interests", "personal interests",
  "extracurricular", "activities",
]);

/**
 * Main normalization function. Takes raw Gemini output and reclassifies
 * any information that ended up in the wrong field.
 */
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

  // Track what has been "claimed" to avoid duplicates
  const claimedTexts = new Set();

  // Register already-extracted items so we don't duplicate them
  data.languages.forEach(l => claimedTexts.add(l.language?.toLowerCase()));
  data.certificates.forEach(c => claimedTexts.add(c.name?.toLowerCase()));
  data.skills.forEach(s => claimedTexts.add(String(s).toLowerCase()));
  data.coreSkills.forEach(s => claimedTexts.add(String(s).toLowerCase()));
  data.keyAchievements.forEach(a => claimedTexts.add(String(a).toLowerCase()));

  // Process each additionalInformation block to reclassify its contents
  const remainingBlocks = [];

  for (const block of data.additionalInformation) {
    const headingLower = (block.heading || "").toLowerCase().trim();
    const content = (block.content || "").trim();
    const bullets = Array.isArray(block.bullets) ? block.bullets.filter(b => b.trim()) : [];

    // ── Language headings ───────────────────────────────────────────────
    if (LANGUAGE_HEADINGS.has(headingLower)) {
      // Extract languages from content or bullets
      const lines = bullets.length
        ? bullets
        : content.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

      let extractedSomething = false;
      for (const line of lines) {
        if (looksLikeLanguage(line) && !claimedTexts.has(line.toLowerCase())) {
          const parsed = parseLanguageEntry(line);
          data.languages.push(parsed);
          claimedTexts.add(parsed.language.toLowerCase());
          extractedSomething = true;
        }
      }
      if (extractedSomething) continue; // Don't add to remainingBlocks
    }

    // ── Certificate headings ─────────────────────────────────────────────
    if (CERTIFICATE_HEADINGS.has(headingLower)) {
      const lines = bullets.length
        ? bullets
        : content.split(/[;\n]/).map(s => s.trim()).filter(Boolean);

      let extractedSomething = false;
      for (const line of lines) {
        if (!claimedTexts.has(line.toLowerCase())) {
          data.certificates.push({ name: line, issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" });
          claimedTexts.add(line.toLowerCase());
          extractedSomething = true;
        }
      }
      if (extractedSomething) continue;
    }

    // ── Skill headings ────────────────────────────────────────────────────
    if (SKILL_HEADINGS.has(headingLower)) {
      const lines = bullets.length
        ? bullets
        : content.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

      let extractedSomething = false;
      for (const line of lines) {
        if (line && !claimedTexts.has(line.toLowerCase())) {
          data.skills.push(line);
          claimedTexts.add(line.toLowerCase());
          extractedSomething = true;
        }
      }
      if (extractedSomething) continue;
    }

    // ── Achievement headings ─────────────────────────────────────────────
    if (ACHIEVEMENT_HEADINGS.has(headingLower)) {
      const lines = bullets.length
        ? bullets
        : content.split(/[;\n]/).map(s => s.trim()).filter(Boolean);

      let extractedSomething = false;
      for (const line of lines) {
        if (line && !claimedTexts.has(line.toLowerCase())) {
          data.keyAchievements.push(line);
          claimedTexts.add(line.toLowerCase());
          extractedSomething = true;
        }
      }
      if (extractedSomething) continue;
    }

    // ── Hobby headings ───────────────────────────────────────────────────
    if (HOBBY_HEADINGS.has(headingLower)) {
      const lines = bullets.length
        ? bullets
        : content.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

      let extractedSomething = false;
      for (const line of lines) {
        if (line && !claimedTexts.has(line.toLowerCase())) {
          data.hobbies.push(line);
          claimedTexts.add(line.toLowerCase());
          extractedSomething = true;
        }
      }
      if (extractedSomething) continue;
    }

    // ── Generic bullet-only scan (no heading match) ──────────────────────
    // Check individual bullets to see if they belong to a structured field
    if (!LANGUAGE_HEADINGS.has(headingLower) && !CERTIFICATE_HEADINGS.has(headingLower)) {
      const unclaimedBullets = [];
      const claimedLanguageBullets = [];
      const claimedCertBullets = [];

      for (const bullet of bullets) {
        if (claimedTexts.has(bullet.toLowerCase())) {
          continue; // Already exists elsewhere
        }
        if (looksLikeLanguage(bullet)) {
          const parsed = parseLanguageEntry(bullet);
          data.languages.push(parsed);
          claimedTexts.add(parsed.language.toLowerCase());
          claimedLanguageBullets.push(bullet);
        } else if (looksLikeCertificate(bullet)) {
          data.certificates.push({ name: bullet, issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" });
          claimedTexts.add(bullet.toLowerCase());
          claimedCertBullets.push(bullet);
        } else {
          unclaimedBullets.push(bullet);
        }
      }

      // If all bullets were reclassified and there's no text content, skip block
      if (unclaimedBullets.length === 0 && !content && (claimedLanguageBullets.length + claimedCertBullets.length) === bullets.length) {
        continue;
      }

      // Keep block with only the unclaimed bullets remaining
      if (unclaimedBullets.length !== bullets.length) {
        remainingBlocks.push({ ...block, bullets: unclaimedBullets });
        continue;
      }
    }

    // Block doesn't match any reclassification rule — keep as-is
    remainingBlocks.push(block);
  }

  data.additionalInformation = remainingBlocks;

  // Normalize experience — ensure responsibilities is always an array
  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map(exp => ({
      ...exp,
      responsibilities: Array.isArray(exp.responsibilities)
        ? exp.responsibilities
        : (typeof exp.responsibilities === "string"
          ? exp.responsibilities.split("\n").map(s => s.trim()).filter(Boolean)
          : []),
    }));
  }

  // Normalize additionalInformation — backward compat: if old data has 'text' field, alias to content
  data.additionalInformation = data.additionalInformation.map(item => ({
    heading: item.heading || "",
    content: item.content || item.text || "",
    bullets: Array.isArray(item.bullets) ? item.bullets : [],
  }));

  return data;
};

// ================================
// SEND TEXT TO GEMINI
// ================================

const analyzeResumeText = async (resumeText) => {

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const prompt = `
You are an expert CV/resume information extractor with semantic understanding.

Your task: Extract ALL meaningful information from the CV text below into the correct structured fields.

CRITICAL RULES:
1. Classify information by its MEANING and CONTENT, NOT by the heading it appears under.
2. The heading "Additional Information" does NOT mean the content belongs in additionalInformation.
   Inspect each item individually and place it in the correct field.
3. NEVER lose information. Every meaningful piece must end up somewhere.
4. NEVER flatten bullet point lists into a single paragraph.
5. NEVER invent data not present in the CV.
6. Use additionalInformation ONLY as a last resort for content that genuinely doesn't fit elsewhere.

SEMANTIC CLASSIFICATION GUIDE:

LANGUAGES → languages[]
- Any human language (English, Hindi, French, etc.)
- Proficiency levels (Native, Fluent, Intermediate, B2, etc.)
- These may appear under ANY heading: "Additional Information", "Other Details", "Languages", etc.
- Extract each language as: { language: "English", proficiency: "Native" }

CERTIFICATIONS → certificates[]
- Any professional certification, AWS/Azure/GCP cert, PMP, CISSP, etc.
- May appear under "Additional Information", "Certifications", "Credentials", etc.
- Extract as: { name: "AWS Certified Developer", issuer: "", issueDate: "", ... }

SKILLS → skills[] or coreSkills[]
- Technical skills: programming languages, frameworks, tools, technologies
- Use skills[] for technical/hard skills
- Use coreSkills[] for leadership/soft skills (e.g., "Leadership", "Communication", "Project Management")
- May appear under: "Technical Expertise", "Technologies", "Competencies", "Skills", etc.

KEY ACHIEVEMENTS → keyAchievements[]
- Quantified accomplishments, awards, recognitions
- May appear under: "Highlights", "Accomplishments", "Key Wins", "Awards", etc.
- Each achievement = one string array item

EXPERIENCE → experience[]
- Any work experience, regardless of heading name
- May appear under: "Professional Background", "Career History", "Work History", etc.
- MUST preserve bullet points as responsibilities[] array, NEVER as a paragraph

PROJECTS → projects[]
- Personal, academic, or professional projects
- May appear under: "Selected Work", "Portfolio", "Key Projects", etc.

EDUCATION → education[]
- Academic degrees, diplomas, courses
- May appear under: "Academic Background", "Qualifications", etc.

HOBBIES → hobbies[]
- Personal interests, hobbies
- May appear under: "Interests", "Hobbies", etc.

additionalInformation[] — USE ONLY FOR:
- Work authorization, visa status
- Volunteer experience
- Publications, conferences, talks
- References
- Any content that genuinely doesn't fit the above categories
- When content is a mix of items, include only the uncategorized remainder

FORMAT for additionalInformation:
- heading: A descriptive heading (can be empty string if none)
- content: Paragraph text (can be empty string)
- bullets: Array of bullet points (can be empty array)
- All three fields are OPTIONAL — only populate what exists

EXPERIENCE BULLETS — CRITICAL:
- responsibilities MUST be an array: ["Built X", "Managed Y", "Improved Z"]
- NEVER: "Built X. Managed Y. Improved Z." (single string)
- Preserve original bullet point text

Resume text:

--------------------

${resumeText}

--------------------
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  if (!response.text) {
    throw new Error("AI returned an empty response.");
  }

  return JSON.parse(response.text);
};

// ================================
// MAIN FUNCTION
// ================================

export const parseCV = async (file) => {

  if (!file) {
    throw new Error("No CV file was provided.");
  }

  console.log("Extracting CV text...");

  const text = await extractFileText(file);

  if (!text || text.trim().length < 20) {
    throw new Error(
      "Could not extract enough text from this CV."
    );
  }

  console.log("CV text extracted.");

  console.log("Sending CV to Gemini...");

  const rawData = await analyzeResumeText(text);

  console.log("Raw Gemini response:", rawData);

  // Run semantic normalization to reclassify any misplaced information
  const resumeData = normalizeResumeData(rawData);

  console.log("Resume information extracted and normalized:", resumeData);

  return resumeData;
};