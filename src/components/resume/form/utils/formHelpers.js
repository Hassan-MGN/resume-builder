export const stripEmojis = (text = "") => String(text).replace(
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu,
  ""
);

export const cleanText = (text = "") => stripEmojis(text).replace(/\s{2,}/g, " ").trim();
export const getArray = (value) => Array.isArray(value) ? value : [];
