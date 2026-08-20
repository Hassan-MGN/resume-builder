import { GoogleGenAI } from "@google/genai";

/*
  =========================================================
  AI ENHANCER
  =========================================================

  Used by the resume form to:

  1. Enhance resume content
  2. Proofread spelling and grammar
  3. Improve clarity and professionalism
  4. Preserve the user's actual information
  5. Avoid generic AI-sounding writing
  6. Remove emojis

  Expected usage:

  enhanceResumeText({
    text: "...",
    section: "summary"
  });

  proofreadResumeText({
    text: "...",
    section: "experience"
  });
*/

/* =========================================================
   CONFIGURATION
   ========================================================= */

const MODEL =
  import.meta.env.VITE_GEMINI_MODEL ||
  "gemini-3.5-flash";

/* =========================================================
   TEXT CLEANING
   ========================================================= */

/*
  Removes emoji and decorative Unicode characters.

  This intentionally avoids Unicode property escapes such as
  \p{Emoji}, because browser/build configurations can sometimes
  behave differently with them.

  It also avoids the invalid character-class range that caused
  the previous regex error.
*/

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
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/* =========================================================
   VALIDATION
   ========================================================= */

const getApiKey = () => {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  return apiKey;
};

const validateText = (text) => {
  const cleaned = cleanText(text);

  if (!cleaned) {
    throw new Error(
      "There is no text to send to the AI."
    );
  }

  if (cleaned.length < 3) {
    throw new Error(
      "The text is too short to improve."
    );
  }

  return cleaned;
};

/* =========================================================
   SECTION CONTEXT
   ========================================================= */

const getSectionInstructions = (
  section
) => {
  switch (section) {
    case "summary":
      return `
This is a professional resume summary.

Improve it so that it:
- quickly communicates the candidate's professional identity
- highlights relevant strengths
- is concise and easy to scan
- sounds natural and human
- avoids unnecessary personal statements
- avoids repeating the candidate's name
- normally stays within 2 to 4 sentences
`;

    case "experience":
      return `
This is a work experience description.

Improve it so that it:
- focuses on responsibilities, contributions, and achievements
- starts statements with strong but natural action verbs when appropriate
- emphasizes outcomes when the original text provides them
- keeps measurable results when they are present
- makes responsibilities easy to understand
- does not invent metrics or achievements
- does not turn ordinary responsibilities into fake accomplishments
`;

    case "education":
      return `
This is an education description.

Improve it so that it:
- clearly communicates relevant academic information
- keeps genuine achievements, coursework, honors, or activities
- removes unnecessary wording
- remains concise
- does not invent academic achievements
`;

    case "project":
      return `
This is a project description.

Improve it so that it:
- clearly explains what the project does
- explains the candidate's contribution when that information exists
- highlights relevant technical or practical impact
- remains concise
- does not invent technologies, users, metrics, or features
`;

    default:
      return `
Improve the provided resume content while preserving its original meaning and factual information.
`;
  }
};

/* =========================================================
   ENHANCE PROMPT
   ========================================================= */

const buildEnhancePrompt = ({
  text,
  section,
}) => {
  return `
You are an experienced professional resume editor.

Your job is to improve the resume text provided by the user.

The goal is NOT to make the writing sound like it was produced by AI.

The result should sound like a strong resume written or carefully edited by a real person.

IMPORTANT RULES:

1. Preserve the candidate's original meaning.
2. NEVER invent facts.
3. NEVER invent companies.
4. NEVER invent job titles.
5. NEVER invent technologies.
6. NEVER invent achievements.
7. NEVER invent percentages, numbers, revenue, users, awards, or other metrics.
8. NEVER add information that is not supported by the original text.
9. Fix spelling mistakes.
10. Fix grammatical mistakes.
11. Improve sentence structure where necessary.
12. Remove unnecessary repetition.
13. Make the writing concise.
14. Prefer clear and direct language.
15. Avoid exaggerated claims.
16. Avoid corporate buzzwords when they do not add meaning.
17. Avoid phrases that commonly make resumes sound AI-generated.
18. Do not over-polish the writing.
19. Preserve the candidate's natural voice where possible.
20. Do not use emojis.
21. Do not add headings unless the original text contains a heading.
22. Do not add bullet points unless the original text already uses bullet points.
23. Do not explain your changes.
24. Return ONLY the improved resume text.

${getSectionInstructions(section)}

Here is the original text:

--------------------
${text}
--------------------

Return only the improved version.
`;
};

/* =========================================================
   PROOFREAD PROMPT
   ========================================================= */

const buildProofreadPrompt = ({
  text,
  section,
}) => {
  return `
You are a professional resume proofreader.

Review the resume text below for:

- spelling mistakes
- grammar mistakes
- punctuation mistakes
- incorrect word usage
- clearly awkward wording
- obvious readability problems

Do NOT rewrite the text unnecessarily.

The goal is proofreading, not creative rewriting.

IMPORTANT RULES:

1. Preserve the original meaning.
2. Do not invent information.
3. Do not add achievements.
4. Do not add metrics.
5. Do not add technologies.
6. Do not change factual information.
7. Do not make unnecessary stylistic changes.
8. Do not make the writing sound artificial.
9. Do not use emojis.
10. If there are no meaningful errors, return the original text unchanged.
11. Return valid JSON only.

The resume section is:

${section}

The original text is:

--------------------
${text}
--------------------

Return JSON using exactly this structure:

{
  "correctedText": "The corrected version of the text",
  "issues": [
    {
      "original": "incorrect text",
      "correction": "correct text",
      "explanation": "Short explanation of the correction"
    }
  ]
}

Rules for issues:

- Include only meaningful corrections.
- Keep each explanation short.
- Do not create an issue merely because you would personally phrase something differently.
- If there are no errors, return an empty issues array.
`;
};

/* =========================================================
   JSON PARSING
   ========================================================= */

const parseJsonResponse = (
  responseText
) => {
  if (!responseText) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let text = String(responseText).trim();

  /*
    Gemini can occasionally wrap JSON in
    markdown code fences even when JSON is requested.
  */

  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(
      "Unable to parse Gemini JSON:",
      text
    );

    throw new Error(
      "Gemini returned an invalid response. Please try again."
    );
  }
};

/* =========================================================
   GEMINI CLIENT
   ========================================================= */

const createAIClient = () => {
  const apiKey = getApiKey();

  return new GoogleGenAI({
    apiKey,
  });
};

/* =========================================================
   ENHANCE RESUME TEXT
   ========================================================= */

export const enhanceResumeText = async ({
  text,
  section = "general",
}) => {
  const cleanedText =
    validateText(text);

  const ai = createAIClient();

  const prompt =
    buildEnhancePrompt({
      text: cleanedText,
      section,
    });

  try {
    const response =
      await ai.models.generateContent({
        model: MODEL,

        contents: prompt,

        config: {
          temperature: 0.45,
        },
      });

    if (!response?.text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    const result = cleanText(
      response.text
    );

    if (!result) {
      throw new Error(
        "Gemini did not return improved text."
      );
    }

    return {
      result,
      text: result,
      issues: [],
    };
  } catch (error) {
    console.error(
      "Resume enhancement failed:",
      error
    );

    throw new Error(
      error?.message ||
        "Unable to enhance the resume text."
    );
  }
};

/* =========================================================
   PROOFREAD RESUME TEXT
   ========================================================= */

export const proofreadResumeText = async ({
  text,
  section = "general",
}) => {
  const cleanedText =
    validateText(text);

  const ai = createAIClient();

  const prompt =
    buildProofreadPrompt({
      text: cleanedText,
      section,
    });

  try {
    const response =
      await ai.models.generateContent({
        model: MODEL,

        contents: prompt,

        config: {
          responseMimeType:
            "application/json",
        },
      });

    if (!response?.text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    const data =
      parseJsonResponse(
        response.text
      );

    const correctedText =
      cleanText(
        data.correctedText ||
          cleanedText
      );

    const issues = Array.isArray(
      data.issues
    )
      ? data.issues
          .map((issue) => ({
            original: cleanText(
              issue?.original || ""
            ),
            correction: cleanText(
              issue?.correction || ""
            ),
            explanation: cleanText(
              issue?.explanation || ""
            ),
          }))
          .filter(
            (issue) =>
              issue.original ||
              issue.correction
          )
      : [];

    return {
      result: correctedText,
      correctedText,
      issues,
    };
  } catch (error) {
    console.error(
      "Resume proofreading failed:",
      error
    );

    throw new Error(
      error?.message ||
        "Unable to proofread the resume text."
    );
  }
};

/* =========================================================
   GENERAL AI ENTRY POINT
   ========================================================= */

export const enhanceOrProofread = async ({
  text,
  section = "general",
  mode = "enhance",
}) => {
  if (mode === "proofread") {
    return proofreadResumeText({
      text,
      section,
    });
  }

  return enhanceResumeText({
    text,
    section,
  });
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default {
  enhanceResumeText,
  proofreadResumeText,
  enhanceOrProofread,
};