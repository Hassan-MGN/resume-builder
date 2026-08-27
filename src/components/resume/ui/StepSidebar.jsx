import React from "react";

const StepSidebar = ({ steps, currentStep, completedSteps, onStepClick }) => {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Resume Progress</h3>
        <p className="text-sm font-medium text-gray-900">Step {currentStep + 1} of {steps.length}</p>
      </div>
      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-5 w-[2px] bg-gray-100" />
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps[index];
            const isCurrent = index === currentStep;          
            return (
              <button key={step.id} type="button" onClick={() => onStepClick(index)} className="relative flex items-center w-full text-left group">
                <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white transition-colors duration-300 ${isCurrent ? "border-cyan-500" : isCompleted ? "border-cyan-500 bg-cyan-500" : "border-gray-300"}`}>
                  {isCompleted && !isCurrent && (<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}
                  {isCurrent && (<div className="w-2 h-2 rounded-full bg-cyan-500" />)}
                </div>
                <div className="ml-4 flex-1">
                  <p className={`text-sm font-medium transition-colors duration-200 ${isCurrent ? "text-cyan-700 font-bold" : isCompleted ? "text-gray-900" : "text-gray-400"} group-hover:text-cyan-600`}>{step.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepSidebar;
