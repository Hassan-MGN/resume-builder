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
        },
        required: [
          "company",
          "position",
          "startDate",
          "endDate",
          "description",
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
    "projects",
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
You are an expert CV/resume information extractor.

Extract the information from the resume text below.

Return ONLY information that is actually present in the CV.
Do not invent companies, degrees, dates, skills, projects, or personal information.

If a field is not available, return an empty string.

For experience:
- company = company/employer
- position = job title
- startDate = starting date
- endDate = ending date or Present
- description = responsibilities and achievements

For education:
- institution = university/school
- degree = degree/qualification
- startDate = starting date
- endDate = ending date
- description = additional education information

For skills:
Return each individual skill as a separate string.

For projects:
Extract project name, description, technologies, and link if available.

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

  const resumeData = await analyzeResumeText(text);

  console.log("Resume information extracted:", resumeData);

  return resumeData;
};