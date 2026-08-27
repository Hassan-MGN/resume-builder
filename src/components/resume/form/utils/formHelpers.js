export const stripEmojis = (text = "") => {
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

export const cleanText = (text = "") => {
  return stripEmojis(text).replace(/\s{2,}/g, " ").trim();
};
export const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};