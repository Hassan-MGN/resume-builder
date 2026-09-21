
const StepNavigation = ({ currentStep, totalSteps, onPrevious, onNext, isNextDisabled }) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-[#EEEFF1] mt-8">
      <div>
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className="h-9 px-4 rounded border border-[#E2E4E6] text-sm font-medium text-[#626870] hover:text-[#151719] hover:border-[#C8CDD3] transition-colors"
          >
            Previous
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#9BA3AE] font-mono">{currentStep + 1} / {totalSteps}</span>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`h-9 px-5 rounded text-sm font-medium transition-colors ${
            isNextDisabled
              ? "bg-[#EEEFF1] text-[#9BA3AE] cursor-not-allowed"
              : "bg-[#151719] hover:bg-[#222831] text-white"
          }`}
        >
          {isLastStep ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;
