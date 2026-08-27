import React from "react";

const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  isNextDisabled 
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <div>
        {!isFirstStep && (
          <button type="button" onClick={onPrevious} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">← Previous</button>
        )}
      </div>
      <div>
        <button type="button" onClick={onNext} disabled={isNextDisabled} className={`px-8 py-2.5 rounded-lg font-semibold transition-all${isNextDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-100"}`}>{isLastStep ? "Finish Resume" : "Continue →"}</button>
      </div>
    </div>
  );
};

export default StepNavigation;
