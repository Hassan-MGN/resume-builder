import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {enhanceResumeText,proofreadResumeText,} from "../../utils/aiEnhancer";
  
  


const COLORS = {
  charcoal: "#111315",
  charcoalSoft: "#181B1F",
  slate: "#222831",
  cyan: "#38B6FF",
  cyanDark: "#1599DE",
  cyanSoft: "#EAF7FF",
  white: "#FFFFFF",
  background: "#F4F6F8",
  border: "#D9E0E7",
  borderDark: "#30363D",
  text: "#17202A",
  muted: "#66717D",
  mutedLight: "#89939E",
  danger: "#C93B3B",
}

const stripEmojis = (text = "") => {
  return String(text).replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu,"").replace(/[\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,"")
}
const cleanText = (text = "") => {
  return stripEmojis(text).replace(/\s{2,}/g, " ").trim()
}

const getArray = (value) => {
  return Array.isArray(value) ? value : []
}

const Input = ({label, placeholder,value, onChange, type="text", disabled=false, }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
      )}
      <input type={type} value={value ?? ""} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(cleanText(e.target.value))} className="w-full min-h-[46px] px-3.5 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed" />
    </div>
  );
};


const TextArea = ({label,placeholder,value,onChange,rows=5,maxLength,onAI,aiLoading=false,}) =>  {
  const length = (value || "").length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        {label && (
          <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
        )}  
        {onAI && (
          <button type="button" onClick={onAI} disabled={aiLoading || !value?.trim()} className="inline-flex items-center  gap-2 px-2.5 py-1.5 rounded-md border border-[#38B6FF]/30 bg-[#EAF7FF] text-[#087CB8] text-[10px] font-semibold hover:bg-[#DDF3FF] hover:border-[#38B6FF]/50 transition disabled:opacity-50 disabled:cursor-not-allowed" ><span className={`w-1.5 h-1.5 rounded-full bg-[#38B6FF] ${aiLoading ? "animate-pulse" : ""}`} />{aiLoading ? "Working..." : "AI Assist"}</button>
        )}
      </div>
      <div className="relative">
        <textarea value={value ?? ""} placeholder={placeholder} rows={rows} maxLength={maxLength} onChange={(e) => onChange(stripEmojis(e.target.value))} className="w-fll px-2.5 py-3.5 rounded-md border border-slate-200 bg-slate-50text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none resize-y transition duration-150 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300" />
        <div className="absolute bottom-2 right-3 text-[9px] text-slate-400">{length} {maxLength ? `/${maxLength}` : ""}</div>
      </div>
    </div>
  );
};

const Select = ({label, value, onChange, children,}) => 
  {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
       )}
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[46px] px-3.5 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 hover:border-slate-300">{children}</select>
    </div>
  );
};

const Section = ({id,number,title,description,children,badge,openSection,toggleSection,}) => {

  const isOpen = openSection === id;

  return (
    <motion.section id={`form-section-${id}`} layout className={` scroll-mt-6 overflow-hidden rounded-lg border transition-colors duration-200 ${isOpen ? "border-slate-300 bg-white shadow-sm":"border-slate-200 bg-white hover:border-slate-300"}`}>
      <button type="button"  onClick={() => toggleSection(id)} className="w-full px-4 sm:px-5 py-4 flex items-center gap-3.5 text-left">
        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-bold transition-colors ${isOpen ? "bg-[#111315] text-white":"bg-slate-100 text-slate-500"}`}>{number}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-medium text-slate-500">{badge}</span>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 border border-slate-200 transition-transform duration-200" ${isOpen ? "rotate-180":""}`}>↓</span></button>
      <AnimatePresence initial={false}>
        {isOpen && (<motion.div initial={{height: 0,opacity: 0,}} animate={{height: "auto", opacity: 1,}} exit={{height: 0, opacity: 0,}} transition={{ duration: 0.2,}}><div className="px-4 sm:px-5 pb-5 pt-1">{children} </div></motion.div>)}
      </AnimatePresence>
    </motion.section>
  );
};


const ItemCard = ({index, title, subtitle, onRemove, children}) => {
  return (
    <motion.div layout initial={{opacity: 0,y: 5,}} animate={{opacity: 1,y: 0,}} exit={{opacity: 0,y: -5,}}className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#111315] text-white flex items-center justify-center text-[9px] font-bold">{String(index + 1).padStart(2, "0")}</div>
          <div className="min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{title || `Item ${index + 1}`}</p>
            {subtitle && (
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{subtitle}</p>)}
          </div>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className=" flex-shrink-0 text-[10px] font-medium text-red-500 px-2 py-1.5 rounded-md hover:bg-red-50 transition">Remove</button>
        )}
      </div>
      {children}
    </motion.div>
  );
};

const AddButton = ({children,onClick,}) => {
  return (
    <button type="button" onClick={onClick} className="mt-4 w-full h-11 rounded-md border border-dashed border-slate-300 text-slate-600 text-xs font-semibold hover:border-[#38B6FF] hover:text-[#087CB8] hover:bg-[#EAF7FF] transition">{children}</button>
  );
};


const AIReviewPanel = ({review,onApply,onClose,}) => {
  if (!review) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div initial={{opacity: 0,y: 12,}}animate={{opacity: 1,y: 0,}}className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38B6FF]" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#087CB8]">AI Review</span>
            </div>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{review.mode === "proofread" ? "Writing review" : "Suggested improvement"}</h3>
            <p className="mt-1 text-xs text-slate-500">Review the suggestion before applying it to your resume.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">×</button>
          </div>
        <div className="p-5 space-y-5">
          {review.mode === "proofread" &&
            review.issues?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-3">Issues found                </h4>
                <div className="space-y-2">{review.issues.map((issue, index) => (
                  <div key={index} className="border border-slate-200 rounded-md p-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 rounded-md bg-red-50 text-red-600 line-through">{issue.original}</span>
                          <span className="text-slate-400">→</span>
                          <span className="px-2 py-1 rounded-md bg-[#EAF7FF] text-[#087CB8]">{issue.correction}</span>
                        </div>
                        {issue.explanation && (
                          <p className="mt-2 text-[11px] text-slate-500">{issue.explanation}</p>)}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-3">Suggested text</h4>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><p className="text-sm leading-7 whitespace-pre-line text-slate-700">{review.result}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Keep current</button>
            <button type="button" onClick={onApply} className="px-4 py-2.5 rounded-md bg-[#111315] text-white text-xs font-semibold hover:bg-[#222831] transition">Apply suggestion</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Form = ({resume,setResume,}) => {
  const [openSection, setOpenSection] = useState("personal")
  const [skillInput, setSkillInput] = useState("")
  const [hobbyInput, setHobbyInput] = useState("")
  const [aiLoading, setAiLoading] = useState(null)
  const [aiReview, setAiReview] = useState(null)
  const personal = resume ?.personal || {}
  const experience = getArray(resume ?.experience)
  const education = getArray(resume ?.education)
  const skills = getArray(resume ?.skills)
  const certificates = getArray(resume ?.certificates)
  const languages = getArray(resume ?.languages)
  const hobbies = getArray(resume ?.hobbies)
  const projects = getArray(resume ?.projects)

  const completion = useMemo(() => {
    let completed = 0
    let total = 0
    const fields = [personal.fullname,personal.title,personal.email,personal.phone,personal.location,];
    fields.forEach((field) => {
      total += 1;
      if (
        typeof field === "string" ? field.trim() : field) {
        completed += 1;
      }
    });
    total += 1;
    if (resume?.summary?.trim()) {
      completed += 1;
    }
    if (experience.length > 0) {
      total += 1;
      if (
        experience.some((item) =>item.company || item.position || item.description)
      ) {
        completed += 1;
      }
    }
    if (education.length > 0) {
      total += 1;
      if (
        education.some((item) => item.institution || item.degree)
      ) {
        completed += 1;
      }
    }
    total += 1;
    if (skills.length > 0) {
      completed += 1;
    }
    if (certificates.length > 0) {
      total += 1;
      if (
        certificates.some((item) => item.name || item.issuer)
      ) {
        completed += 1;
      }
    }
    if (languages.length > 0) {
      total += 1;
      if (
        languages.some((item) => item.language || item.proficiency)
      ) {
        completed += 1;
      }
    }
    if (hobbies.length > 0) {
      total += 1;
      completed += 1;
    }

    if (projects.length > 0) {
      total += 1;
      if (
        projects.some((item) => item.name || item.description)
      ) {
        completed += 1;
      }
    }
    return total
      ? Math.round((completed / total) * 100): 0;}, [personal,resume?.summary,experience,education,skills,certificates,languages,hobbies,projects,]);


  const toggleSection = (section) => {
    setOpenSection((current) => current === section ? null : section);
  };

  const openSectionAndScroll = (
    section
  ) => {
    setOpenSection(section);
    window.setTimeout(() => {
      document.getElementById(`form-section-${section}`) ?.scrollIntoView({behavior: "smooth",block: "start",});}, 50);
  };

  const updatePersonal = (field,value) => {
    setResume((prev) => ({...prev,personal: {...(prev.personal || {}),[field]: stripEmojis(value),},}));
  };

  const updateSummary = (value) => {
    setResume((prev) => ({...prev,summary: stripEmojis(value),}));
  };
  const updateArrayItem = (arrayName,index,field,value) => {
    setResume((prev) => {
      const current = getArray(
        prev[arrayName]
      );
      const updated = [...current];
      updated[index] = {...(updated[index] || {}),[field]: stripEmojis(value),};
      return {
        ...prev,
        [arrayName]: updated,
      };
    });
  };

  const removeArrayItem = (arrayName,index) => {setResume((prev) => ({...prev,[arrayName]: getArray(prev[arrayName]).filter((_, i) => i !== index),}))
};

  const addExperience = () => {
    setResume((prev) => ({...prev,experience: [...getArray(prev.experience),{company: "",position: "",startDate: "",endDate: "",description: "",},],}))
    setOpenSection("experience");
  }

  const addEducation = () => {
    setResume((prev) => ({...prev, education: [...getArray(prev.education),{institution: "",degree: "",startDate: "",endDate: "",description: "",},],}));
    setOpenSection("education");
  };

  const addSkill = () => {
    const skill = cleanText(skillInput);
    if (!skill) return;
    const exists = skills.some(
      (existing) =>
        String(existing).toLowerCase() === skill.toLowerCase());
    if (exists) {
      setSkillInput("");
      return;
    }
    setResume((prev) => ({
      ...prev,
      skills: [
        ...getArray(prev.skills),
        skill,
      ],
    }));
    setSkillInput("");
  };
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {e.preventDefault();addSkill();}
    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      removeArrayItem("skills",skills.length - 1);
    }
  };
  const addCertificate = () => {
    setResume((prev) => ({...prev,certificates: [...getArray(prev.certificates),{name: "",issuer: "",issueDate: "",expiryDate: "",credentialId: "",credentialUrl: "",},],}));
    setOpenSection("certificates");
  };

  const addLanguage = () => {
    setResume((prev) => ({...prev,languages: [...getArray(prev.languages),{language: "",proficiency: "",},],}));
    setOpenSection("languages");
  };

  const addHobby = () => {
    const hobby = cleanText(hobbyInput);
    if (!hobby) return;
    const exists = hobbies.some((existing) => String(existing).toLowerCase() === hobby.toLowerCase());
    if (exists) {
      setHobbyInput("");
      return;
    }
    setResume((prev) => ({...prev,hobbies: [...getArray(prev.hobbies),hobby,],}));
    setHobbyInput("");
  };

  const handleHobbyKeyDown = (e) => {
    if (e.key === "Enter" ||e.key === ",") {
      e.preventDefault();
      addHobby();
    }
    if (e.key === "Backspace" && !hobbyInput && hobbies.length > 0) { removeArrayItem("hobbies",hobbies.length - 1);}
  };

  const addProject = () => {
    setResume((prev) => ({...prev,projects: [...getArray(prev.projects),{name: "",description: "",technologies: "",link: "",},],}));
    setOpenSection("projects");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !file.type.startsWith("image/")
    ) {
      return;
    }
    const reader =new FileReader(); reader.onload = () => {updatePersonal("photo",reader.result);

    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const runAI = async ({text,section,mode = "enhance",target,}) => {
  if (!text?.trim()) return;
  const loadingKey = `${section}-${target ?? "main"}`;
  setAiLoading(loadingKey);
  try {
    const response =
      mode === "proofread"
        ? await proofreadResumeText({
            text,
            section,
          })
        : await enhanceResumeText({
            text,
            section,
          });

    const result = cleanText(response.result || response.text || response.correctedText || "");
    if (!result) {
      throw new Error("The AI service returned no suggested text.");
    }

    setAiReview({mode,section,target,result,issues: Array.isArray(response.issues) ? response.issues : [],});
  } catch (error) {
    console.error("AI Assist error:",error);
    window.alert(error?.message || "AI Assist could not complete the request.");
  } finally {
    setAiLoading(null);
  }
};


  const applyAIResult = () => {
    if (!aiReview) return;

    const {section,target,result,} = aiReview;
    if (
      section === "summary"
    ) {
      updateSummary(result);
    }
    if (
      section === "experience" &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "experience",
        target,
        "description",
        result
      );
    }
    if (
      section === "education" &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "education",
        target,
        "description",
        result
      );
    }
    if (
      section === "project" &&
      typeof target === "number"
    ) {
      updateArrayItem(
        "projects",
        target,
        "description",
        result
      );
    }
    setAiReview(null);
  };

  const proofread = ({text,section,target,}) => {
    runAI({text,section,target,mode: "proofread",});
  };


  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-[#F4F6F8]">
        <div className="text-sm text-slate-500">Loading resume...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full bg-[#F4F6F8] pb-10">
        <div className="space-y-4">

          <div
            className="overflow-hidden rounded-lg border border-[#30363D] bg-[#111315] text-white">
            <div className="h-1 bg-[#38B6FF]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38B6FF]" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B949E]">Resume Builder</span>
                  </div>
                  <h2 className="text-xl font-semibold mt-2">Build your resume</h2>
                  <p className="text-xs text-[#9AA4AE] mt-1">Add your information and refine the details before exporting your resume.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-[#38B6FF]">{completion}%</div>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-[#8B949E]">complete</p>
                </div>
              </div>
              <div className="mt-5 h-1 bg-[#2A3036] overflow-hidden rounded-full">
                <motion.div className="h-full bg-[#38B6FF]" initial={{width: 0,}} animate={{ width: `${completion}%`,}} transition={{ duration: 0.35,}}/>
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              ["personal", "01", "Personal"],
              ["summary", "02", "Summary"],
              ["experience", "03", "Experience"],
              ["education", "04", "Education"],
              ["skills", "05", "Skills"],
              ["certificates", "06", "Certificates"],
              ["languages", "07", "Languages"],
              ["hobbies", "08", "Hobbies"],
              ["projects", "09", "Projects"],
            ].map(
              ([id,number,label,]) => (
                <button key={id} type="button" onClick={() => openSectionAndScroll(id)} className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-semibold border transition ${openSection === id ? "bg-[#111315] border-[#111315] text-white" : "bg-white border-slate-200 text-slate-500 hover:border-[#38B6FF] hover:text-[#087CB8]"}`}>
                  <span className="text-[8px] opacity-60">{number}</span>
                  {label}
                </button>
              )
            )}
          </div>

          <Section id="personal" number="01" title="Personal Information" description="Your identity and contact details" badge="Essential" openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/70">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
                  {personal.photo ? (<img src={personal.photo} alt="Profile" className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Photo</div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-semibold text-slate-800">Profile photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">Add a professional photo for templates that support it.</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <label className="cursor-pointer px-3 py-1.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-[#38B6FF] hover:text-[#087CB8] transition">Upload photo
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden"/></label>
                    {personal.photo && (
                      <button type="button" onClick={() => updatePersonal("photo","")}className="px-3 py-1.5 rounded-md text-[10px] font-semibold text-red-500 hover:bg-red-50">Remove</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="e.g. Hassan Mujtaba" value={personal.fullname} onChange={(value) => updatePersonal("fullname",value)}/>
                <Input label="Professional Title" placeholder="e.g. Software Developer" value={personal.title} onChange={(value) => updatePersonal("title",value)}/>
                <Input label="Email" type="email" placeholder="you@example.com" value={personal.email} onChange={(value) => updatePersonal("email",value)}/>
                <Input label="Phone" placeholder="+92 300 1234567"value={personal.phone} onChange={(value) => updatePersonal("phone",value)}/>
                <Input label="Location" placeholder="Karachi, Pakistan" value={personal.location} onChange={(value) => updatePersonal( "location",value)}/>
                <Input label="LinkedIn" placeholder="linkedin.com/in/username" value={personal.linkedin} onChange={(value) => updatePersonal("linkedin",value)}/>
                <div className="md:col-span-2">
                  <Input label="Portfolio / Website" placeholder="yourwebsite.com" value={personal.website} onChange={(value) => updatePersonal("website",value)}/>
                </div>
              </div>
            </div>
          </Section>

          <Section id="summary" number="02" title="Professional Summary" description="A concise introduction recruiters can scan quickly" openSection={openSection} toggleSection={toggleSection}>
            <TextArea label="Summary" placeholder="Write a concise professional summary..." value={resume.summary} rows={7} maxLength={1000} onChange={updateSummary} onAI={() => runAI({ text: resume.summary, section:"summary",mode: "enhance",})} aiLoading={aiLoading === "summary-main"}/>
            <div className="flex items-center justify-between mt-3 text-[9px] text-slate-400">
              <span>Recommended: 2–4 concise sentences.</span>
              <button type="button" onClick={() => proofread({ text: resume.summary, section: "summary",})} disabled={!resume.summary?.trim() || aiLoading ==="summary-main"} className="text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button>
            </div>
          </Section>

          <Section id="experience" number="03" title="Work Experience" description="Showcase your professional impact" badge={`${experience.length} ${ experience.length === 1 ? "position" : "positions"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {experience.map((item, index) => (
                    <ItemCard key={index} index={index} title={item.position || `Experience ${index + 1}`} subtitle={item.company || "Professional experience"} onRemove={() => removeArrayItem("experience",index)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Company" placeholder="Company name" value={item.company} onChange={(value) => updateArrayItem("experience",index,"company",value)}/>
                        <Input label="Position" placeholder="Job title" value={item.position} onChange={(value) => updateArrayItem("experience",index,"position",value)}/>
                        <Input label="Start Date" placeholder="Jan 2024" value={item.startDate} onChange={( value) => updateArrayItem("experience",index,"startDate",value)}/>
                        <Input label="End Date" placeholder="Present" value={ item.endDate} onChange={( value ) => updateArrayItem("experience",index,"endDate",value)}/>
                      </div>
                      <div className="mt-4">
                        <TextArea label="Responsibilities & Achievements" placeholder="Describe what you accomplished. Include measurable results where possible."value={item.description} rows={6} onChange={(value) => updateArrayItem("experience",index,"description",value)} onAI={() => runAI({text:item.description,section:"experience", target:index, mode: "enhance",})} aiLoading={ aiLoading ===`experience-${index}`}/>
                        <div className="mt-2 text-right">
                          <button type="button" onClick={() => proofread({text:item.description,section:"experience",target:index,})} disabled={ !item.description?.trim()} className="text-[9px] text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button>
                        </div>
                      </div>
                    </ItemCard>
                  )
                )}
              </AnimatePresence>
            </div>
            <AddButton onClick={addExperience}>+ Add another position</AddButton>
          </Section>

          <Section id="education" number="04" title="Education" description="Academic background and qualifications" badge={`${education.length} ${education.length === 1 ? "entry" : "entries"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {education.map(
                  (item, index) => (
                    <ItemCard key={index} index={index} title={ item.degree || `Education ${ index + 1}`}
                      subtitle={ item.institution || "Academic qualification"}
                      onRemove={() => removeArrayItem( "education",index)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Institution" placeholder="University / College" value={ item.institution} onChange={(value) => updateArrayItem("education",index,"institution",value)}/>
                        <Input label="Degree" placeholder="Computer Science" value={item.degree} onChange={(value) => updateArrayItem("education",index,"degree",value)}/>
                        <Input label="Start Date" placeholder="2021" value={item.startDate} onChange={(value) => updateArrayItem("education",index,"startDate",value)}/>
                        <Input label="End Date" placeholder="2025" value={ item.endDate} onChange={(value) => updateArrayItem("education",index,"endDate",value)}/>
                      </div>
                      <div className="mt-4">
                        <TextArea label="Additional Information" placeholder="Achievements, coursework, honors..." value={ item.description} rows={4} onChange={(value) => updateArrayItem("education",index,"description",value)} onAI={() => runAI({text: item.description, section:"education",target:index, mode: "enhance",})} aiLoading={aiLoading === `education-${index}`}/>
                      </div>
                    </ItemCard>
                  )
                )}
              </AnimatePresence>
            </div>

            <AddButton onClick={addEducation}>Add education</AddButton>
          </Section>

          <Section id="skills" number="05" title="Skills" description="Add technologies, tools and professional skills" badge={`${skills.length} ${ skills.length === 1 ? "skill" : "skills"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className=" min-h-[58px] p-3 rounded-md border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/15 transition">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>{skills.map((skill, index) => (<motion.span key={`${skill}-${index}`} initial={{ opacity: 0, scale: 0.95,}} animate={{ opacity: 1,scale: 1,}} exit={{opacity: 0,scale: 0.95,}} className=" inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#111315] text-white text-[10px] font-medium">{skill}
                        <button type="button" onClick={() => removeArrayItem("skills",index)} className="text-white/60 hover:text-white">×</button>
                      </motion.span>
                    )
                  )}
                </AnimatePresence>
                <input type="text" value={skillInput} onChange={(e) => setSkillInput( stripEmojis( e.target.value))} onKeyDown={handleSkillKeyDown} placeholder={skills.length ? "Add another skill..." : "Type a skill and press Enter"} className=" flex-1 min-w-[180px] bg-transparent outline-none text-sm px-2 py-1 placeholder:text-slate-400"/>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[9px] text-slate-400">Press Enter or comma to add a skill.</p>
              <span className="text-[9px] text-slate-400">{skills.length} added</span>
            </div>
          </Section>

          <Section id="certificates" number="06" title="Certificates" description="Showcase professional certifications and credentials" badge={`${certificates.length} ${ certificates.length === 1 ? "certificate" : "certificates"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">{certificates.map((certificate,index) => (
                    <ItemCard key={index} index={index} title={ certificate.name || `Certificate ${ index + 1}`} subtitle={ certificate.issuer || "Professional certification"} onRemove={() => removeArrayItem("certificates",index)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Certificate Name" placeholder="AWS Certified Developer" value={certificate.name} onChange={(value) => updateArrayItem("certificates",index,"name",value)}/>
                        <Input label="Issuing Organization" placeholder="Amazon Web Services" value={ certificate.issuer} onChange={(value) => updateArrayItem("certificates",index,"issuer",value)}/>
                        <Input label="Issue Date" placeholder="Jan 2025" value={ certificate.issueDate} onChange={(value) => updateArrayItem("certificates",index,"issueDate",value)}/>
                        <Input label="Expiry Date" placeholder="Jan 2028 / Does not expire" value={ certificate.expiryDate} onChange={( value) => updateArrayItem("certificates",index,"expiryDate",value)}/>
                        <Input label="Credential ID" placeholder="ABC123XYZ" value={ certificate.credentialId} onChange={( value) => updateArrayItem( "certificates",index,"credentialId",value)}/>
                        <Input label="Credential URL" placeholder="https://..." value={ certificate.credentialUrl} onChange={(value) => updateArrayItem("certificates",index,"credentialUrl",value)}/>
                      </div>
                    </ItemCard>
                  )
                )}
              </AnimatePresence>
            </div>
            <AddButton onClick={addCertificate}>+ Add certificate</AddButton>
          </Section>

          <Section id="languages" number="07" title="Languages" description="List languages you can communicate in" badge={`${languages.length} ${languages.length === 1 ? "language" : "languages" }`} openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {languages.map((language,index) => (<ItemCard key={index} index={index} title={ language.language || `Language ${index + 1}`} subtitle={ language.proficiency || "Language proficiency" } onRemove={() => removeArrayItem("languages",index)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Language" placeholder="English" value={ language.language} onChange={(value) => updateArrayItem("languages",index,"language",value)}/>
                        <Select label="Proficiency" value={ language.proficiency} onChange={(value) => updateArrayItem("languages",index,"proficiency",value)}>
                          <option value="">Select proficiency</option>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Basic">Basic</option>
                        </Select>
                      </div>
                    </ItemCard>
                  )
                )}
              </AnimatePresence>
            </div>
            <AddButton onClick={addLanguage}> + Add language</AddButton>
          </Section>

          <Section id="hobbies" number="08" title="Hobbies & Interests" description="Add interests that help show your personality" badge={`${hobbies.length} ${ hobbies.length === 1 ? "interest" : "interests"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className=" min-h-[58px] p-3 rounded-md border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/15 transition">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>{hobbies.map((hobby, index) => (<motion.span key={`${hobby}-${index}`} initial={{ opacity: 0, scale: 0.95,}} animate={{ opacity: 1, scale: 1,}} exit={{ opacity: 0, scale: 0.95,}} className=" inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#222831] text-white text-[10px] font-medium">{hobby}
                        <button type="button" onClick={() => removeArrayItem("hobbies",index)}className="text-white/60 hover:text-white">×</button>
                      </motion.span>
                    )
                  )}
                </AnimatePresence>
                <input type="text" value={ hobbyInput} onChange={(e) => setHobbyInput( stripEmojis( e.target.value))} onKeyDown={ handleHobbyKeyDown} placeholder={ hobbies.length ? "Add another interest..." : "Type an interest and press Enter"} className=" flex-1 min-w-[180px] bg-transparent outline-none text-sm px-2 py-1 placeholder:text-slate-400"/>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[9px] text-slate-400">Press Enter or comma to add an interest.</p>
              <span className="text-[9px] text-slate-400">{hobbies.length} added</span>
            </div>
          </Section>
          <Section id="projects" number="09" title="Projects" description="Highlight your strongest work" badge={`${projects.length} ${ projects.length === 1 ? "project" : "projects"}`} openSection={openSection} toggleSection={toggleSection}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {projects.map(
                  (project, index) => (
                    <ItemCard key={index} index={index} title={ project.name || `Project ${ index + 1}`} subtitle={project.technologies || "Project"} onRemove={() => removeArrayItem( "projects", index)}>
                      <div className="space-y-4">
                        <Input label="Project Name" placeholder="AI Resume Builder" value={ project.name} onChange={( value) => updateArrayItem("projects",index,"name",value)}/>
                        <TextArea label="Project Description" placeholder="Explain what the project does and what you contributed." value={project.description} rows={5} onChange={(value) => updateArrayItem("projects",index,"description",value)} onAI={() => runAI({ text: project.description, section:"project", target:index, mode: "enhance",})} aiLoading={aiLoading === `project-${index}`}/>
                        <div className="flex justify-end">
                          <button type="button" onClick={() => proofread({ text: project.description, section: "project", target:index,})} disabled={ !project.description?.trim()} className="text-[9px] text-[#087CB8] hover:underline disabled:opacity-40">Check spelling & grammar</button>
                        </div>

                        <Input label="Technologies" placeholder="React, Python, PostgreSQL..." value={project.technologies} onChange={(value) => updateArrayItem("projects",index,"technologies",value)}/>
                        <Input label="Project Link" placeholder="https://github.com/..." value={ project.link} onChange={( value) => updateArrayItem( "projects", index, "link",value)}/>
                      </div>
                    </ItemCard>
                  )
                )}
              </AnimatePresence>
            </div>
            <AddButton onClick={addProject}>+ Add project</AddButton>
          </Section>

          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38B6FF]" />
              <span className="text-[9px] font-medium text-slate-500">Changes are saved automatically</span>
            </div>
            <span className="text-[9px] text-slate-400">Live preview enabled</span>
          </div>
        </div>
      </div>

      <AIReviewPanel review={aiReview} onApply={applyAIResult} onClose={() => setAiReview(null)}/>
    </>
  );
};

export default Form;