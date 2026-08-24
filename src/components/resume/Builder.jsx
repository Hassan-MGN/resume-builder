import React, { useEffect, useMemo, useState } from "react";
import Form from "./Form";
import Preview from "./Preview";
import { parseCV } from "../../utils/cvParser";

import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";


const initialResume = {
  personal: {
    fullname: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    photo: "",
    title: "",
  },
  summary: "",
  experience: [
    {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  skills: [],
  projects: [
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ],
};

const BUILDER_STORAGE_KEY = "resume-builder-state";

const Builder = () => {


  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(
        BUILDER_STORAGE_KEY
      );

      if (!saved) return null;
      const data = JSON.parse(saved);
      return data.mode ?? null;
    } catch (error) {
      console.error(
        "Unable to restore builder mode:",
        error
      );

      return null;
    }
  })

  const [template, setTemplate] = useState(() => {
    try {
      const saved = localStorage.getItem(
        BUILDER_STORAGE_KEY
      )

      if (!saved) return null;
      const data = JSON.parse(saved);
      return data.template ?? null;
    } catch (error) {
      console.error(
        "Unable to restore builder template:",
        error
      );

      return null;
    }
  })


  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem(
        BUILDER_STORAGE_KEY
      );
      if (!saved) return initialResume
      const data = JSON.parse(saved)
      return data.resume ?? initialResume
    } catch (error) {
      console.error(
        "Unable to restore resume:",
        error
      )
      return initialResume
    }
  })

  const [activeSection, setActiveSection] = useState(() => {
    try {
      const saved = localStorage.getItem(
        BUILDER_STORAGE_KEY
      );
      if (!saved) return "personal"
      const data = JSON.parse(saved)
      return data.activeSection ?? "personal"
    } catch (error) {
      console.error(
        "Unable to restore active section:",
        error
      )
      return "personal"
    }
  })


  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [theme, setTheme] = useState({primary: "#4f46e5", secondary: "#64748b", text: "#111827", })
    
  useEffect(() => {
    try {
      const builderState = {mode,template, resume, activeSection,}
      localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(builderState))
    } catch (error) {
      console.error("Unable to save builder state:",error)
    }
  }, [mode,template, resume, activeSection])
  
  const resumeScore = useMemo(() => {
    let score = 0

    const personal = resume.personal || {}

    if (personal.fullname) score += 10
    if (personal.email) score += 10
    if (personal.phone) score += 5
    if (personal.location) score += 5
    if (personal.title) score += 5
    if (resume.summary?.trim()) score += 15

    if (
      resume.experience?.some((item) => item.position || item.company || item.description)    
    ) {
      score += 20;
    }
    if (
      resume.education?.some((item) => item.degree || item.institution)
    ) {
      score += 15;
    }
    if (resume.skills?.length > 0) {
      score += 10;
    }
    if (
      resume.projects?.some((item) => item.name || item.description )
    ) {
      score += 5;
    }
    return Math.min(score, 100)
  }, [resume]);

  const handleFile = (file) => {
    setUploadError("")
    if (!file) return
    const allowedTypes = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document",]
    const allowedExtensions = [".pdf",".doc",".docx",];
    const extension ="." + file.name.split(".").pop().toLowerCase()
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)
     ) {
      setUploadError( "Please upload a PDF, DOC, or DOCX file.")
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB.")
      return;
    }
    setUploadedFile(file)
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
      handleFile(file)
      e.target.value = ""
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadError("")
  };

  const handleUseUploadedCV = async () => {
    if (!uploadedFile) return
    try {
      setAnalyzing(true)
      setUploadError("")
      console.log( "Starting CV analysis...")
      const extractedResume = await parseCV(uploadedFile)
      console.log("Extracted resume:",extractedResume)
      setResume({
        personal: {
          fullname:extractedResume.personal?.fullname || "",
          email:extractedResume.personal?.email || "",
          phone: extractedResume.personal?.phone || "",
          location:extractedResume.personal?.location || "",
          linkedin: extractedResume.personal?.linkedin || "",
          website: extractedResume.personal?.website || "",
          photo:extractedResume.personal?.photo || "",
          title:extractedResume.personal?.title || "",
        },
        summary: extractedResume.summary || "",
        experience:Array.isArray( extractedResume.experience )? extractedResume.experience: [],
        education: Array.isArray( extractedResume.education) ? extractedResume.education: [],
        skills:Array.isArray()? extractedResume.skills: [],
        projects: Array.isArray( extractedResume.projects)? extractedResume.projects : [],   
      });
      setMode("scratch")
      setTemplate(null)
    } catch (error) {
      console.error("CV analysis error:",error)
      setUploadError(
        error.message || "Something went wrong while analyzing your CV.")
    } finally {
      setAnalyzing(false);
    }
  };

  const resetBuilder = () => {
    setMode(null);
    setTemplate(null);
    setUploadedFile(null);
    setUploadError("");
    setResume(initialResume);
    setActiveSection("personal");
    localStorage.removeItem(BUILDER_STORAGE_KEY);
  };


  const selectTemplate = (value) => {setTemplate(value)}
  const updateResumeField = ( section,field,value) => {
    setResume((prev) => ({...prev,[section]: { ...prev[section], [field]: value,},
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-bold text-lg tracking-tight">Resume Builder</h1>
              <p className="text-xs text-gray-500">Professional resume workspace</p>
            </div>
          </div>
          {template && (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Resume Strength</p>
                <p className="text-sm font-bold text-gray-900">{resumeScore}/100</p>
                </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke={theme.primary} strokeWidth="3" strokeDasharray={`${resumeScore}, 100`} strokeLinecap="round"  className="transition-all duration-500" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{resumeScore}%</span>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {!mode && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Build a resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-600">{" "}stands out.</span></h2>
              <p className="max-w-2xl mx-auto mt-4 text-gray-500">Start from scratch or upload your existing CV and transform it into a polished professional resume.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <button type="button" onClick={() => setMode("upload")} className="group text-left bg-white border border-gray-200 rounded-xl p-8 hover:border-cyan-300 transition-all duration-300">
                <h3 className="text-xl font-bold mt-6">Upload Existing CV</h3>
                <p className="text-gray-500 mt-2 leading-6">Extract your existing resume information and place it directly into our templates.</p>
                <div className="mt-6 text-cyan-600 font-semibold text-sm">Upload CV</div>
              </button>
              <button type="button" onClick={() => setMode("scratch")} className="group text-left bg-white border border-gray-200 rounded-xl p-8 hover:border-cyan-300 transition-all duration-300">
                <h3 className="text-xl font-bold mt-6">Create From Scratch</h3>
                  <p className="text-gray-500 mt-2 leading-6">Build your resume manually using our professional templates and editing workspace.</p>
                  <div className="mt-6 text-cyan-600 font-semibold text-sm">Start building</div>
              </button>
            </div>
          </div>
        )}
        {mode === "upload" && (
          <div className="max-w-3xl mx-auto">
            <button type="button" onClick={resetBuilder} className="text-sm text-black-600 font-medium mb-6 hover:underline">Back</button>
            <div className="bg-white border border-gray-200 rounded-l p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Upload your CV</h2>
              <p className="text-gray-500 mt-2">We'll extract the information and prepare it for your chosen template.</p>
              <div onDragOver={handleDragOver} onDragEnter={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`mt-8 rounded-xl border-2 border-dashed p-12 text-center transition-all ${isDragging ? "border-cyan-500 bg-cyan-50 scale-[1.01]": "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"}`}>
                <h3 className="text-lg font-semibold mt-4">{isDragging? "Drop your CV here": "Drag & drop your CV here"}</h3>
                <p className="text-gray-400 text-sm mt-2">or browse from your computer </p>
                <label className="inline-block mt-5">
                  <span className="cursor-pointer inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium transition"> Browse files</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden"/>
                </label>
                  <p className="text-xs text-gray-400 mt-5">PDF, DOC or DOCX · Maximum 10MB</p>
              </div>
              {uploadError && (
                <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
              )}
              {uploadedFile && (
                <div className="mt-5 flex items-center justify-between border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024 /1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                    <button type="button" onClick={removeFile} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                  </div>
              )}
              {uploadedFile && (<button type="button" onClick={ handleUseUploadedCV } disabled={analyzing}  className="mt-5 w-full bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-charcoal-700 hover:to-charcoal-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-cyan-100 transition">  {analyzing ? "Analyzing your CV..." : "Analyze & Build Resume"}</button>)}
              </div>
          </div>
        )}
        {mode === "scratch" &&
          !template && (
            <div>
              <button type="button" onClick={() => uploadedFile ? setMode("upload") : setMode(null)} className="text-sm text-black-600 font-medium mb-6 hover:underline">Back</button>
               <div className="mb-8">
                <h2 className="text-3xl font-bold">Choose your template</h2>
                <p className="text-gray-500 mt-2"> Select a design. You can change it later. </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <TemplateCard name="Professional" description="Elegant two-column layout for traditional professional resumes." template="Professional" onSelect={ selectTemplate} />
                <TemplateCard name="Modern" description="Contemporary design with clean typography and accent colors." template="Modern" onSelect={selectTemplate} />
                <TemplateCard name="Minimal" description="Simple, clean and ATS-friendly resume layout." template="Minimal" onSelect={selectTemplate} />
              </div>
            </div>
          )}
        {mode === "scratch" &&
          template && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button type="button" onClick={() => setTemplate(null)} className="text-sm text-black-600 font-medium hover:underline">Change template</button>
                 <div className="flex items-center gap-2">
                  {["Professional","Modern","Minimal",].map((item) => (<button key={item} type="button" onClick={() => setTemplate(item)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${template === item ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{item}</button>))}
                  </div>
              </div>
              <div className="grid xl:grid-cols-[480px_minmax(0,1fr)] gap-6 items-start">
                <div className="space-y-5">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Resume information</p>
                      <h2 className="text-xl font-bold mt-1">Build your resume</h2>
                    </div>
                    <div className="p-5">
                      <Form resume={resume} setResume={setResume} />
                    </div>
                  </div>
                </div>
                <div className="xl:sticky xl:top-[96px]">
                  <Preview resume={resume} template={template} theme={theme} setResume={setResume} />
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

const TemplateCard = ({name,description,template,onSelect,}) => {return (<button type="button" onClick={() => onSelect(template)} className="group text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all duration-300">
      <div className="h-[390px] bg-gray-100 overflow-hidden"><div className="origin-top-left scale-[0.44] w-[794px] pointer-events-none"><TemplateThumbnail template={template}/></div></div>
        <div className="p-5">
          <div className="flex items-center justify-between"><h3 className="font-bold text-lg">{name}</h3><span className="text-cyan-600 opacity-0 group-hover:opacity-100 transition">→</span></div>
          <p className="text-sm text-gray-500 mt-2 leading-5">{description}</p>
          </div>
    </button>
  );
};

const TemplateThumbnail = ({template,}) => {
  const demoResume = {
    personal: {
      fullname: "John Doe",
      title: "Software Developer",
      email: "john@example.com",
      phone: "+92 300 1234567",
      location: "Karachi, Pakistan",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
      photo: "",
    },
    summary:
      "Creative software developer with experience building modern web applications and AI-powered solutions.",
    experience: [
      {
        company: "Tech Company",
        position: "Software Developer",
        startDate: "2024",
        endDate: "Present",
        description:
          "Developed modern web applications using React and Python.",
      },
    ],
    education: [
      {
        institution: "University",
        degree: "Computer Science",
        startDate: "2021",
        endDate: "2025",
        description: "",
      },
    ],
    skills: [
      "React",
      "Python",
      "JavaScript",
      "SQL",
    ],
    projects: [
      {
        name: "AI Resume Builder",
        description:
          "An AI-powered resume building application.",
        technologies:
          "React, Python",
        link: "",
      },
    ],
  };
  if (template === "Professional") {
    return (
      <Template1 resume={demoResume} />
    );
  }
  if (template === "Modern") {
    return (
      <Template2 resume={demoResume} />

    );
  }
  if (template === "Minimal") {
    return (
      <Template3 resume={demoResume} />

    );
  }
  return null;
};
export default Builder;