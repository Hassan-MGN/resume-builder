import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResumeThumbnail from './ui/ResumeThumbnail';
import Brand from './ui/Brand';
import { UserAuth } from '../context/AuthContext';

const themes = [
  { id: 'modern', name: 'Modern', tag: 'Versatile', color: '#087CB8', description: 'Clean hierarchy with a confident blue accent.' },
  { id: 'editorial', name: 'Editorial', tag: 'Distinctive', color: '#151719', description: 'Refined typography for a more personal first impression.' },
  { id: 'creative', name: 'Creative', tag: 'Expressive', color: '#F26B5E', description: 'A bolder layout for creative and brand-led careers.' },
  { id: 'executive', name: 'Executive', tag: 'Leadership', color: '#1A2B4C', description: 'Restrained, high-density and built for senior roles.' },
  { id: 'tech', name: 'Tech', tag: 'Structured', color: '#635BFF', description: 'Grid-led structure for technical and engineering roles.' },
  { id: 'minimal', name: 'Minimal', tag: 'ATS-friendly', color: '#151719', description: 'Quiet, highly readable and focused on the content.' },
];

const Check = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="m4.5 10.2 3.2 3.2 7.8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

const StartModal = ({ onClose }) => {
  const navigate = useNavigate();

  const start = (mode) => {
    navigate(`/signup?start=${mode}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label="Start building your resume">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#101214]/55 backdrop-blur-sm rounded" />
      <div className="relative w-full max-w-2xl rounded bg-[#F7F7F5] border border-[#D9DDDF] shadow-[0_30px_100px_rgba(0,0,0,.22)]">
        <div className="flex items-start justify-between gap-6 p-7 md:p-9 border-b border-[#D9DDDF]">
          <div>
            <p className="text-[11px] uppercase tracking-[.18em] font-semibold text-[#087CB8] mb-2">Start your resume</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-.035em]">How do you want to begin?</h2>
            <p className="mt-3 text-sm md:text-base text-[#626870] max-w-lg">Bring what you already have or start with a blank page. You can change your template later.</p>
          </div>
          <button onClick={onClose} className="shrink-0 w-9 h-9 border border-[#D9DDDF] bg-white text-[#626870] hover:text-[#151719] hover:border-[#BFC5C9] transition-colors rounded" aria-label="Close dialog">×</button>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-[#D9DDDF]">
          <button onClick={() => start('upload')} className="group rounded text-left bg-white p-7 md:p-9 hover:bg-[#F8FBFC] transition-colors">
            <div className="w-12 h-12 bg-[#EAF5FA] text-[#087CB8] flex items-center justify-center mb-7 border-l-2 border-[#087CB8]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 13.5v4A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Upload your CV</h3>
            <p className="text-sm leading-6 text-[#626870] mb-7">Start with your existing document and continue from there.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#087CB8]">Import my CV</span>
          </button>
          <button onClick={() => start('scratch')} className="group rounded text-left bg-[#151719] text-white p-7 md:p-9 hover:bg-[#1D2125] transition-colors">
            <div className="w-12 h-12 bg-white/10 text-white flex items-center justify-center mb-7 border-l-2 border-[#E7A83B]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Start from scratch</h3>
            <p className="text-sm leading-6 text-white/65 mb-7">Choose a template and build a fresh resume section by section.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E7A83B]">Build from zero</span>
          </button>
        </div>
        <div className="px-7 md:px-9 py-4 text-[11px] uppercase tracking-[.14em] text-[#8A9198]">No design experience required · Your content stays yours</div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const { session, loading: authLoading } = UserAuth();

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#151719] font-sans selection:bg-[#087CB8]/20 overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F7F5]/94 backdrop-blur-md border-b border-[#D9DDDF]">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <Brand markClassName="h-8 w-8" textClassName="font-bold tracking-[-.02em]" />
          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-[#626870]">
            <a href="#templates" className="hover:text-[#151719] transition-colors">Templates</a>
            <a href="#workflow" className="hover:text-[#151719] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[#151719] transition-colors">Features</a>
            <a href="#questions" className="hover:text-[#151719] transition-colors">Questions</a>
          </div>
          <div className="flex items-center gap-3">
            {!authLoading && (session ? (
              <>
                <Link to="/dashboard" className="hidden sm:inline-flex h-10 items-center border border-[#D3D8DA] bg-white px-4 text-sm font-semibold text-[#151719] hover:border-[#087CB8] hover:text-[#087CB8] rounded">Dashboard</Link>
                <Link to="/profile" className="hidden md:inline-flex h-10 items-center px-1 text-xs font-semibold text-[#626870] hover:text-[#151719] rounded">My account</Link>
              </>
            ) : (
              <Link to="/signin" className="hidden sm:block text-sm font-medium text-[#626870] hover:text-[#151719] rounded">Sign in</Link>
            ))}
            <button onClick={() => setStartOpen(true)} className="h-10 px-5 rounded bg-[#151719] text-white text-sm font-semibold hover:bg-[#25292D] transition-colors">Create resume</button>
          </div>
        </div>
      </nav>

      <main className="pt-[72px]">
        {/* HERO */}
        <section className="border-b border-[#D9DDDF] overflow-hidden">
          <div className="max-w-[1480px] mx-auto px-5 md:px-8 min-h-[calc(100vh-72px)] grid lg:grid-cols-[.9fr_1.1fr] items-center gap-8 lg:gap-0 py-12 lg:py-16">
            <div className={`relative z-20 max-w-2xl py-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="flex items-center gap-3 mb-7 text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8]">
                Resume builder · made for real applications
              </div>
              <h1 className="text-[clamp(3.6rem,7vw,7.2rem)] font-black leading-[.91] tracking-[-.065em] max-w-[760px]">A better resume starts with <span className="text-[#087CB8]">better choices.</span></h1>
              <p className="mt-8 text-lg md:text-xl leading-8 text-[#626870] max-w-xl">Build from scratch or bring your existing CV. Shape the content, choose a design that fits the role, and leave with a resume you actually want to send.</p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button onClick={() => setStartOpen(true)} className="h-14 px-7 rounded bg-[#087CB8] text-white font-bold text-sm hover:bg-[#065E8C] transition-all inline-flex items-center justify-center gap-3">Create my resume</button>
                <button onClick={() => setStartOpen(true)} className="h-14 px-7 rounded bg-white border border-[#C9CED1] text-[#151719] font-bold text-sm hover:border-[#8E969D] transition-colors inline-flex items-center justify-center gap-3">I already have a CV</button>
              </div>
              <div className="mt-10 grid grid-cols-3 max-w-lg border-t border-[#D9DDDF] pt-5">
                <div><strong className="block text-lg">6</strong><span className="text-[11px] uppercase tracking-wider text-[#8A9198]">Design directions</span></div>
                <div className="border-l border-[#D9DDDF] pl-5"><strong className="block text-lg">A4</strong><span className="text-[11px] uppercase tracking-wider text-[#8A9198]">Print-ready layout</span></div>
                <div className="border-l border-[#D9DDDF] pl-5"><strong className="block text-lg">Live</strong><span className="text-[11px] uppercase tracking-wider text-[#8A9198]">Preview while editing</span></div>
              </div>
            </div>

            <div className="relative min-h-[560px] md:min-h-[680px] lg:min-h-[780px] flex items-center justify-center lg:justify-end">
              <div className="absolute right-[6%] top-[8%] w-[58%] h-[70%] bg-[#EAF5FA] blur-3xl opacity-80" />
              <div className={`relative w-[min(86vw,610px)] h-[590px] md:h-[690px] lg:h-[760px] transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[.96]'}`}>
                <div className="absolute top-[9%] left-[0%] w-[63%] rotate-[-8deg] opacity-70 z-10"><ResumeThumbnail variant="editorial" className="shadow-[0_20px_60px_rgba(0,0,0,.12)]" /></div>
                <div className="absolute top-[3%] right-[1%] w-[67%] rotate-[7deg] opacity-80 z-10"><ResumeThumbnail variant="executive" className="shadow-[0_24px_70px_rgba(0,0,0,.15)]" /></div>
                <div className="absolute top-[10%] left-[8%] w-[78%] rotate-[-1.5deg] z-20"><ResumeThumbnail variant="modern" className="shadow-[0_35px_90px_rgba(0,0,0,.20)]" /></div>
                <div className="absolute left-[-2%] bottom-[17%] z-30 rounded bg-white border border-[#D9DDDF] p-4 shadow-xl max-w-[185px]">
                  <div className="text-[10px] uppercase tracking-[.16em] text-[#8A9198] mb-2">Ready to send</div>
                  <div className="flex items-center gap-2 text-sm font-bold"><span className="w-5 h-5 bg-[#27865B] text-white flex items-center justify-center"><Check /></span> Strong first impression</div>
                </div>
                <div className="absolute right-[-1%] bottom-[9%] z-30 bg-[#151719] text-white p-4 shadow-xl max-w-[205px]">
                  <div className="text-[10px] uppercase tracking-[.16em] text-white/50 mb-2">Your document</div>
                  <div className="text-sm font-semibold">Content first. Design second.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASE BAND */}
        <section className="bg-[#151719] text-white border-b border-[#151719]">
          <div className="max-w-[1480px] mx-auto px-5 md:px-8 grid md:grid-cols-3">
            {[
              ['01', 'Starting fresh', 'Build a resume one section at a time without fighting a blank document.'],
              ['02', 'Already have a CV', 'Bring your existing content and spend your time improving it, not retyping it.'],
              ['03', 'Applying with intent', 'Match the presentation to the role while keeping the content readable and professional.'],
            ].map(([num, title, text], i) => (
              <div key={num} className={`py-8 md:py-10 ${i > 0 ? 'md:border-l md:border-white/15 md:pl-9' : ''} ${i < 2 ? 'md:pr-9' : ''}`}>
                <span className="text-[10px] tracking-[.2em] text-[#E7A83B] font-bold">{num}</span>
                <h2 className="mt-3 text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/60 max-w-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="py-24 lg:py-32 border-b border-[#D9DDDF]">
          <div className="max-w-[1480px] mx-auto px-5 md:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
              <div className="max-w-2xl">
                <div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8] mb-4">The template collection</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-[-.05em] leading-[.98]">Different careers need different documents.</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-[#626870]">Start with a visual direction, then make it yours. Every layout is designed around hierarchy, readability and the reality of a one- or two-page resume.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
              {themes.map((theme, index) => (
                <article key={theme.id} className="group">
                  <div className="relative rounded bg-[#EDEEEB] border-y border-[#D9DDDF] py-8 px-6 md:px-10 min-h-[520px] flex items-center justify-center overflow-hidden">
                    <span className="absolute top-4 left-0 text-[10px] font-bold tracking-[.18em] text-[#8A9198]">0{index + 1}</span>
                    <div className="w-[72%] group-hover:-translate-y-2 transition-transform duration-300"><ResumeThumbnail variant={theme.id} className="shadow-[0_24px_50px_rgba(0,0,0,.15)]" /></div>
                    <span className="absolute top-4 right-0 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: theme.color }}>{theme.tag}</span>
                  </div>
                  <div className="pt-5 flex items-start justify-between gap-5">
                    <div><h3 className="text-xl font-bold">{theme.name}</h3><p className="mt-1 text-sm leading-6 text-[#626870] max-w-xs">{theme.description}</p></div>
                    <button onClick={() => setStartOpen(true)} className="shrink-0 mt-1 text-sm font-bold hover:text-[#087CB8] transition-colors">Use</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="bg-[#F0F1EE] py-24 lg:py-32 border-b border-[#D9DDDF]">
          <div className="max-w-[1480px] mx-auto px-5 md:px-8">
            <div className="grid lg:grid-cols-[.75fr_1.25fr] gap-14 lg:gap-24 items-start">
              <div className="lg:sticky lg:top-28">
                <div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8] mb-4">From rough to ready</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-[-.05em] leading-[.98]">Your CV is the raw material. The resume is the finished piece.</h2>
                <p className="mt-6 text-base leading-7 text-[#626870] max-w-md">Resummetry gives you a workspace where writing, structure and presentation can happen together.</p>
              </div>
              <div className="space-y-16">
                <div className="grid md:grid-cols-[80px_1fr] gap-7 items-start">
                  <div className="text-5xl font-black text-[#C9CED1] tracking-[-.06em]">01</div>
                  <div><h3 className="text-2xl font-bold">Bring in your experience</h3><p className="mt-2 text-[#626870] leading-7 max-w-xl">Start from a blank document or bring an existing CV so the important information is already in one place.</p><div className="mt-7 rounded bg-white border border-[#D9DDDF] p-5 md:p-7"><div className="flex gap-3 items-center border-b border-[#E5E7E8] pb-4"><span className="w-8 h-8 bg-[#EAF5FA] text-[#087CB8] flex items-center justify-center font-bold">PDF</span><span className="text-sm font-bold">Current CV.pdf</span><span className="ml-auto text-[10px] uppercase tracking-wider text-[#8A9198]">Imported</span></div><div className="mt-5 space-y-2"><div className="h-2 bg-[#D9DDDF] w-[82%]"/><div className="h-2 bg-[#E6E8E9] w-full"/><div className="h-2 bg-[#E6E8E9] w-[91%]"/><div className="h-2 bg-[#E6E8E9] w-[68%]"/></div></div></div>
                </div>
                <div className="grid md:grid-cols-[80px_1fr] gap-7 items-start">
                  <div className="text-5xl font-black text-[#C9CED1] tracking-[-.06em]">02</div>
                  <div><h3 className="text-2xl font-bold">Refine what matters</h3><p className="mt-2 text-[#626870] leading-7 max-w-xl">Use focused writing assistance when you need it. Keep the original, compare the suggestion, and decide what actually sounds like you.</p><div className="mt-7 rounded bg-white border border-[#D9DDDF] p-5 md:p-7"><div className="text-[10px] uppercase tracking-[.18em] text-[#635BFF] font-bold mb-5">Suggested improvement</div><div className="grid md:grid-cols-2 gap-5"><div><div className="text-[10px] text-[#9BA3AE] mb-2 uppercase tracking-wider">Original</div><p className="text-sm leading-6 text-[#7A8188]">Managed projects and worked with a team of developers.</p></div><div className="md:border-l md:border-[#E2E4E6] md:pl-5"><div className="text-[10px] text-[#635BFF] mb-2 uppercase tracking-wider">Suggested</div><p className="text-sm leading-6 font-medium">Led cross-functional projects through delivery while coordinating a six-person engineering team.</p></div></div><div className="mt-6 pt-5 border-t border-[#E2E4E6] flex gap-2"><span className="px-3 py-2 bg-[#151719] text-white text-xs font-bold">Accept</span><span className="px-3 py-2 border border-[#D9DDDF] text-xs font-semibold">Try again</span><span className="px-3 py-2 text-xs font-semibold text-[#626870]">Dismiss</span></div></div></div>
                </div>
                <div className="grid md:grid-cols-[80px_1fr] gap-7 items-start">
                  <div className="text-5xl font-black text-[#C9CED1] tracking-[-.06em]">03</div>
                  <div><h3 className="text-2xl font-bold">Choose the final presentation</h3><p className="mt-2 text-[#626870] leading-7 max-w-xl">See your changes on the page while you work, then export a document that looks intentional on screen and on paper.</p><div className="mt-7 rounded bg-[#151719] p-6 md:p-8 overflow-hidden"><div className="flex items-center justify-between text-white/50 text-[10px] uppercase tracking-[.18em] mb-6"><span>Live preview</span><span>A4 · 100%</span></div><div className="grid grid-cols-[1fr_160px] gap-5"><div className="rounded bg-white p-5 min-h-[240px]"><div className="h-3 w-[45%] bg-[#151719] mb-3"/><div className="h-2 w-[25%] bg-[#087CB8] mb-7"/><div className="h-2 w-full bg-[#D9DDDF] mb-2"/><div className="h-2 w-[94%] bg-[#E6E8E9] mb-2"/><div className="h-2 w-[88%] bg-[#E6E8E9] mb-7"/><div className="h-2 w-[35%] bg-[#151719] mb-3"/><div className="h-2 w-full bg-[#E6E8E9] mb-2"/><div className="h-2 w-[91%] bg-[#E6E8E9]"/></div><div className="border-l border-white/15 pl-5 text-white"><div className="text-xs font-bold">Modern</div><div className="mt-2 text-[11px] leading-5 text-white/50">Clean hierarchy<br/>Blue accent<br/>ATS-conscious layout</div></div></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 lg:py-32 border-b border-[#D9DDDF] bg-white">
          <div className="max-w-[1480px] mx-auto px-5 md:px-8">
            <div className="max-w-2xl mb-14"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8] mb-4">Built around the document</div><h2 className="text-4xl md:text-6xl font-black tracking-[-.05em] leading-[.98]">Everything useful. Nothing that gets in the way.</h2></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#D9DDDF]">
              {[
                ['Live preview', 'See the page change as you edit instead of guessing how the final document will look.'],
                ['Focused AI help', 'Improve a summary, proofread a section or sharpen a bullet when you ask for it.'],
                ['Template variety', 'Switch visual directions without rebuilding your content from the beginning.'],
                ['PDF-ready output', 'Keep the final document clean, readable and ready for applications or printing.'],
              ].map(([title, text], i) => (
                <div key={title} className="border-r border-b border-[#D9DDDF] p-7 md:p-8 min-h-[250px] hover:bg-[#F7F7F5] transition-colors">
                  <div className="text-[10px] uppercase tracking-[.18em] font-bold text-[#8A9198]">0{i + 1}</div>
                  <h3 className="mt-12 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#626870]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PHOTO / BRAND SECTION */}
        <section className="relative min-h-[720px] overflow-hidden bg-[#1A2B4C]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=85&w=2000')" }} />
          <div className="absolute inset-0 bg-[#101820]/72" />
          <div className="relative z-10 max-w-[1480px] mx-auto px-5 md:px-8 py-24 lg:py-32 min-h-[720px] grid lg:grid-cols-[1fr_420px] items-center gap-16">
            <div className="max-w-3xl text-white"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#E7A83B] mb-5">The first page matters</div><h2 className="text-5xl md:text-7xl font-black tracking-[-.055em] leading-[.94]">You did the work. Make the document show it.</h2><p className="mt-7 text-lg leading-8 text-white/65 max-w-xl">A resume is often the first version of your work someone sees. Resummetry helps you make that first page feel considered, not improvised.</p></div>
            <div className="relative"><div className="absolute inset-0 bg-[#E7A83B] translate-x-5 translate-y-5 rotate-3"/><div className="absolute inset-0 bg-[#087CB8] -translate-x-4 translate-y-2 -rotate-2"/><div className="relative -rotate-2 hover:rotate-0 transition-transform duration-500"><ResumeThumbnail variant="editorial" className="shadow-[0_40px_100px_rgba(0,0,0,.45)]" /></div></div>
          </div>
        </section>

        {/* QUESTIONS */}
        <section id="questions" className="py-24 lg:py-32 border-b border-[#D9DDDF]">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8 grid lg:grid-cols-[.7fr_1.3fr] gap-14">
            <div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8] mb-4">Before you start</div><h2 className="text-4xl md:text-5xl font-black tracking-[-.05em] leading-[.98]">A few useful answers.</h2></div>
            <div className="divide-y divide-[#D9DDDF] border-t border-[#D9DDDF]">
              {[
                ['Do I need design experience?', 'No. Pick a direction and focus on your content. The layout handles the visual hierarchy for you.'],
                ['Can I use my existing CV?', 'Yes. The starting flow lets you bring an existing CV instead of recreating it from scratch.'],
                ['Can I change templates later?', 'Yes. Your content and the presentation are treated separately, so you can explore different directions.'],
                ['Is the AI always involved?', 'No. AI is positioned as an optional writing assistant. You stay in control of what goes into the final resume.'],
              ].map(([q, a]) => (
                <details key={q} className="group py-6"><summary className="cursor-pointer list-none flex items-center justify-between gap-6 text-lg font-bold"><span>{q}</span><span className="text-2xl font-light text-[#8A9198] group-open:rotate-45 transition-transform">+</span></summary><p className="mt-4 text-sm leading-7 text-[#626870] max-w-2xl">{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#EAF5FA] py-24 lg:py-32 overflow-hidden relative">
          <div className="absolute -right-24 top-10 w-80 h-80 border-[40px] border-[#087CB8]/10 rounded-full" />
          <div className="absolute -left-20 bottom-0 w-64 h-64 border-[32px] border-[#E7A83B]/15 rounded-full" />
          <div className="relative max-w-[1100px] mx-auto px-5 md:px-8 text-center"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087CB8] mb-5">Your next application starts here</div><h2 className="text-5xl md:text-7xl font-black tracking-[-.06em] leading-[.92] max-w-4xl mx-auto">Make the first page count.</h2><p className="mt-7 text-lg text-[#626870] max-w-xl mx-auto leading-7">Build from scratch or bring the CV you already have. Either way, make it feel like yours.</p><button onClick={() => setStartOpen(true)} className="mt-9 h-14 px-8 rounded bg-[#151719] text-white font-bold hover:bg-[#25292D] transition-colors inline-flex items-center gap-3">Start building</button></div>
        </section>
      </main>

      <footer className="bg-[#151719] text-white">
        <div className="max-w-[1480px] mx-auto px-5 md:px-8 py-16">
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-white/10">
            <div><Brand dark markClassName="h-8 w-8" textClassName="font-bold" /><p className="mt-5 text-sm leading-6 text-white/50 max-w-sm">A resume workspace for turning experience into a professional document worth sending.</p></div>
            <div><h3 className="text-xs uppercase tracking-[.18em] font-bold text-white/45 mb-5">Product</h3><div className="space-y-3 text-sm text-white/65"><a href="#templates" className="block hover:text-white">Templates</a><a href="#features" className="block hover:text-white">Features</a><a href="#workflow" className="block hover:text-white">How it works</a></div></div>
            <div><h3 className="text-xs uppercase tracking-[.18em] font-bold text-white/45 mb-5">Account</h3><div className="space-y-3 text-sm text-white/65"><Link to="/signup" className="block hover:text-white rounded">Create account</Link><Link to="/signin" className="block hover:text-white rounded">Sign in</Link></div></div>
            <div><h3 className="text-xs uppercase tracking-[.18em] font-bold text-white/45 mb-5">Legal</h3><div className="space-y-3 text-sm text-white/65"><Link to="/privacy" className="block hover:text-white rounded">Privacy</Link><Link to="/terms" className="block hover:text-white rounded">Terms</Link></div></div>
            <div><h3 className="text-xs uppercase tracking-[.18em] font-bold text-white/45 mb-5">Company</h3><div className="space-y-3 text-sm text-white/65"><Link to="/privacy" className="block hover:text-white rounded">Privacy</Link><Link to="/terms" className="block hover:text-white rounded">Terms</Link><Link to="/contact" className="block hover:text-white rounded">Contact</Link></div></div>
            <div><h3 className="text-xs uppercase tracking-[.18em] font-bold text-white/45 mb-5">Resume directions</h3><div className="space-y-3 text-sm text-white/65"><span className="block">Modern</span><span className="block">Editorial</span><span className="block">Executive</span><span className="block">Creative</span></div></div>
          </div>
          <div className="pt-7 flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] uppercase tracking-[.12em] text-white/35"><span>© {new Date().getFullYear()} Resummetry</span><span>Built for the next application.</span></div>
        </div>
      </footer>

      {startOpen && <StartModal onClose={() => setStartOpen(false)} />}
    </div>
  );
};

export default Landing;
