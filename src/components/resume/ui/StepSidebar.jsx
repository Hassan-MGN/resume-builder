
const StepSidebar = ({ steps, currentStep, completedSteps, onStepClick }) => {
  const templateIndex = steps.findIndex((step) => step.id === "template");
  const contentSteps = steps.filter((step) => step.id !== "template");
  const completedCount = contentSteps.reduce((count, step) => {
    const index = steps.findIndex((item) => item.id === step.id);
    return count + (completedSteps[index] ? 1 : 0);
  }, 0);
  const progressPercent = contentSteps.length ? Math.round((completedCount / contentSteps.length) * 100) : 0;

  const renderStep = (step) => {
    const index = steps.findIndex((item) => item.id === step.id);
    const isCompleted = !!completedSteps[index];
    const isCurrent = index === currentStep;
    const isTemplate = step.id === "template";

    return (
      <button
        key={step.id}
        type="button"
        onClick={() => onStepClick(index)}
        className={`group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors border-l-2 ${
          isCurrent
            ? "border-[#087CB8] bg-white text-[#151719]"
            : "border-transparent text-[#737871] hover:bg-white/70 hover:text-[#151719]"
        }`}
      >
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center text-[8px] font-mono ${
          isCurrent ? "bg-[#151719] text-white" : isCompleted ? "border border-[#D4D9D3] bg-[#F7F9F5] text-[#27865B]" : "border border-[#D9DCD8] bg-transparent text-[#9BA099]"
        }`}>
          {isCompleted && !isCurrent ? "✓" : isTemplate ? "✦" : String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-medium tracking-[-0.01em]">{step.title}</span>
        {isCurrent && <span className="h-1.5 w-1.5 shrink-0 bg-[#087CB8]" />}
      </button>
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F2EE]">
      <div className="border-b border-[#DDDCD7] px-5 pb-5 pt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8F958E]">Resume progress</div>
            <div className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[#151719]">{progressPercent}%</div>
          </div>
          <div className="text-right text-[10px] leading-4 text-[#8F958E]">{completedCount} of {contentSteps.length}<br />sections complete</div>
        </div>
        <div className="mt-4 h-1 bg-[#DADCD8]">
          <div className="h-full bg-[#151719] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-5 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#969B94]">Design</div>
        <div className="px-2">{templateIndex >= 0 && renderStep(steps[templateIndex])}</div>

        <div className="px-5 pb-2 pt-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#969B94]">Content</div>
        <div className="px-2 space-y-0.5">{contentSteps.map(renderStep)}</div>
      </div>

      <div className="border-t border-[#DDDCD7] px-5 py-4">
        <div className="flex items-start gap-2 text-[10px] leading-4 text-[#848A83]">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#27865B]" />
          <span>Your changes save automatically while you work.</span>
        </div>
      </div>
    </div>
  );
};

export default StepSidebar;
