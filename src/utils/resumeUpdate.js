export const updateResumeAtPath = (resume, path, value) => {
  if (!resume || !path || path.length === 0) return resume;

  const updated = structuredClone(resume);
  let target = updated;

  for (let index = 0; index < path.length - 1; index++) {
    const key = path[index];

    if (target[key] === undefined) {
      target[key] = typeof path[index + 1] === "number" ? [] : {};
    }

    target = target[key];
  }

  target[path[path.length - 1]] = value;

  return updated;
};
