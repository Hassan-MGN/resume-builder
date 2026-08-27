import React, { useState } from "react";
import { getUserApiKey, setUserApiKey } from "../../../../utils/aiEnhancer";

const ApiKeyModal = ({ isOpen, onClose }) => {
  const [key, setKey] = useState(getUserApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setUserApiKey(key);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setUserApiKey("");
    setKey("");
  };

  const hasEnvKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Gemini API Key</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your key is stored in browser localStorage and never sent anywhere except directly to Google's API.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition ml-3 mt-0.5">✕</button>
        </div>
        {hasEnvKey && (
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-2.5 text-xs text-blue-700">A key from <code>.env</code> is already active. Entering one here will override it.</div>)}
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1.5">API Key</label>
        <input type="password" autoComplete="off" placeholder="AIza..." value={key} onChange={(e) => setKey(e.target.value)} className="w-full px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/15 transition" />
        <p className="mt-2 text-[10px] text-slate-400"> Get a free key at{" "}<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#087CB8] hover:underline">aistudio.google.com</a></p>
        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={handleSave} className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2.5 rounded-lg transition"> {saved ? "✓ Saved!" : "Save Key"}</button>
          {key && (<button type="button" onClick={handleClear} className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition">Clear</button>)}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
