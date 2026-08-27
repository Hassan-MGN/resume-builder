import React, { useState, useEffect, useMemo } from "react";
import StepSidebar from "../ui/StepSidebar";
import StepNavigation from "../ui/StepNavigation";
import StepHeader from "../ui/StepHeader";
import Form from "../form/Form";
import TemplateSelection from "./TemplateSelection";
import Preview from "../preview/Preview";

const WIZARD_STEPS = [
  { id: "personal", title: "Personal Information", description: "Your identity and contact details" },
  { id: "summary", title: "Professional Summary", description: "A concise introduction recruiters can scan quickly" },
  { id: "experience", title: "Work Experience", description: "Showcase your professional impact" },
  { id: "education", title: "Education", description: "Academic background and qualifications" },
  { id: "skills", title: "Skills", description: "Add technologies, tools and professional skills" },
  { id: "coreSkills", title: "Core Skills", description: "Highlight leadership and soft skills" },
  { id: "keyAchievements", title: "Key Achievements", description: "Your most impressive outcomes" },
  { id: "certificates", title: "Certificates", description: "Showcase professional certifications and credentials" },
  { id: "languages", title: "Languages", description: "List languages you can communicate in" },
  { id: "hobbies", title: "Hobbies & Interests", description: "Add interests that help show your personality" },
  { id: "projects", title: "Projects", description: "Highlight your strongest work" },
  { id: "additionalInformation", title: "Additional Information", description: "Any other valuable information" },
  { id: "template", title: "Template Selection", description: "Choose the design of your resume" },
  { id: "finalize", title: "Finalize & Edit", description: "Review and make final adjustments before downloading" }
];

const WIZARD_STORAGE_KEY = "resume-wizard-step";

const ResumeWizard = ({ resume, setResume, template, setTemplate, theme, setTheme, onBack }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(WIZARD_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  // Determine completed steps based on meaningful data
  const completedSteps = useMemo(() => {
    return WIZARD_STEPS.map(step => {
      switch(step.id) {
        case "personal":
          return Boolean(resume.personal?.fullname && resume.personal?.email);
        case "summary":
          return Boolean(resume.summary?.trim());
        case "experience":
          return resume.experience?.some(e => e.company || e.position);
        case "education":
          return resume.education?.some(e => e.institution || e.degree);
        case "skills":
          return resume.skills?.length > 0;
        case "coreSkills":
          return resume.coreSkills?.length > 0;
        case "keyAchievements":
          return resume.keyAchievements?.length > 0;
        case "certificates":
          return resume.certificates?.some(c => c.name || c.issuer);
        case "languages":
          return resume.languages?.some(l => l.language || l.proficiency);
        case "hobbies":
          return resume.hobbies?.length > 0;
        case "projects":
          return resume.projects?.some(p => p.name || p.description);
        case "additionalInformation":
          return resume.additionalInformation?.some(a => a.heading || a.content || a.bullets?.length > 0);
        case "template":
          return Boolean(template);
        case "finalize":
          return false;
        default:
          return false;
      }
    });
  }, [resume, template]);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeStep = WIZARD_STEPS[currentStep];

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-100px)]">
      <button type="button" onClick={onBack} className="text-sm text-black-600 font-medium mb-6 hover:underline">Back to Dashboard</button>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[280px] shrink-0 sticky top-[96px]"><StepSidebar  steps={WIZARD_STEPS}  currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick}/></div>
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex-1 p-8"><StepHeader title={activeStep.title} description={activeStep.description} />
            <div className="mt-8">
              {currentStep < WIZARD_STEPS.length - 2 && (<Form resume={resume} setResume={setResume} activeStepId={activeStep.id} />)}
              {currentStep === WIZARD_STEPS.length - 2 && (<TemplateSelection currentTemplate={template} onSelect={setTemplate} />)}
              {currentStep === WIZARD_STEPS.length - 1 && (<div className="border border-gray-200 rounded-lg overflow-hidden"><Preview resume={resume} setResume={setResume} template={template} theme={theme} /></div>)}
            </div>
          </div>
          <div className="px-8 pb-8 mt-auto">
            <StepNavigation  currentStep={currentStep}  totalSteps={WIZARD_STEPS.length} onPrevious={handlePrevious} onNext={handleNext} isNextDisabled={currentStep === WIZARD_STEPS.length - 2 && !template}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizard;
