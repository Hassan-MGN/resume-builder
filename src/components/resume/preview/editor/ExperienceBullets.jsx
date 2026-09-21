import EditableText from "../../ui/EditableText";

const ExperienceBullets = ({ item, index, update, className = "", bulletClassName = "" }) => {
  const bullets = Array.isArray(item?.responsibilities) ? item.responsibilities : [];
  if (!bullets.length) return null;

  const offset = Number.isInteger(item?._responsibilityStartIndex) ? item._responsibilityStartIndex : 0;
  return (
    <ul className={`mt-2 list-disc pl-5 text-[0.875em] leading-[1.5] ${className}`}>
      {bullets.map((bullet, bulletIndex) => {
        const sourceIndex = offset + bulletIndex;
        return (
          <li key={`${sourceIndex}-${bulletIndex}`} className={bulletClassName}>
            <EditableText
              elementId={`experience.${index}.responsibilities.${sourceIndex}`}
              value={bullet}
              onChange={(value) => update(["experience", index, "responsibilities", sourceIndex], value)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ExperienceBullets;
