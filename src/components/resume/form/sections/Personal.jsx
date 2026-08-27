import React from "react";


import Input from "../ui/Input";

const Personal = ({
  personal,
  updatePersonal,
  handlePhotoUpload,
  openSection,
  toggleSection,
}) => {
  return (

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/70">
          <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
            {personal.photo ? (
              <img src={personal.photo} alt="Profile" className="w-full h-full object-cover"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Photo</div>)}
          </div>
          <div className="text-center sm:text-left"><p className="text-sm font-semibold text-slate-800">Profile photo</p>
            <p className="text-[10px] text-slate-400 mt-1">Add a professional photo for templates that support it.</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <label className="cursor-pointer px-3 py-1.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-[#38B6FF] hover:text-[#087CB8] transition">Upload photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden"/>
              </label>
              {personal.photo && (
                <button type="button" onClick={() => updatePersonal("photo", "")} className="px-3 py-1.5 rounded-md text-[10px] font-semibold text-red-500 hover:bg-red-50">Remove</button>)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="e.g. Hassan Mujtaba" value={personal.fullname} onChange={(value) => updatePersonal("fullname", value)}/>
          <Input label="Professional Title" placeholder="e.g. Software Developer" value={personal.title} onChange={(value) => updatePersonal("title", value)}/>
          <Input label="Email" type="email" placeholder="you@example.com" value={personal.email} onChange={(value) => updatePersonal("email", value)}/>
          <Input label="Phone" placeholder="+92 300 1234567" value={personal.phone} onChange={(value) => updatePersonal("phone", value)}/>
          <Input label="Location" placeholder="Karachi, Pakistan" value={personal.location} onChange={(value) => updatePersonal("location", value)}/>
          <Input label="LinkedIn" placeholder="linkedin.com/in/username" value={personal.linkedin} onChange={(value) => updatePersonal("linkedin", value)}/>
          <div className="md:col-span-2">
            <Input label="Portfolio / Website" placeholder="yourwebsite.com" value={personal.website} onChange={(value) => updatePersonal("website", value)}/>
          </div>
        </div>
      </div>
  );
};

export default Personal;