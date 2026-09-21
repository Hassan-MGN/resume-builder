
const StepHeader = ({ title, description }) => {
  return (
    <div className="mb-8 pb-6 border-b border-[#EEEFF1]">
      <h2 className="text-xl font-bold text-[#151719] tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1.5 text-sm text-[#626870] leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default StepHeader;
