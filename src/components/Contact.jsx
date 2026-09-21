import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#151719]">
      <header className="border-b border-[#DFE2E4] bg-white/80">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="font-black tracking-[-.03em] text-xl">Resummetry</Link>
          <Link to="/" className="text-sm font-semibold text-[#626870] hover:text-[#151719]">Back home</Link>
        </div>
      </header>
      <section className="mx-auto max-w-[900px] px-5 py-20 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087CB8]">Contact</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">We'd like to hear from you.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#626870]">Before launch, replace this page with your real support channel or support inbox. Keeping a visible contact path is important for user trust.</p>
        <div className="mt-12 border-t border-[#DFE2E4] pt-8 text-sm leading-7 text-[#626870]">
          <p><strong className="text-[#151719]">Launch checklist:</strong> add your support email, expected response time, and any billing/account support instructions here.</p>
        </div>
      </section>
    </main>
  );
}
