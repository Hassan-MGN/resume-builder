
const LoadingScreen = ({ label = "Preparing your workspace" }) => (
  <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-[#F7F7F5] text-[#151719]">
    <div className="flex w-full max-w-xs flex-col items-center px-6 text-center">
      <div className="relative mb-7 h-14 w-14" aria-hidden="true">
        <div className="absolute inset-0 rounded border border-[#D9DDDF]" />
        <div className="absolute inset-2 rounded border border-[#087CB8]/30" />
        <div className="absolute inset-[18px] rounded-full bg-[#087CB8] animate-pulse" />
        <div className="absolute inset-0 rounded border-t-2 border-[#087CB8] animate-spin [animation-duration:1.2s]" />
      </div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#087CB8]">Resummetry</div>
      <div className="mt-2 text-sm font-semibold tracking-[-0.01em]">{label}</div>
      <div className="mt-4 h-1 w-32 overflow-hidden rounded bg-[#E5E7E8]">
        <div className="h-full w-1/2 rounded bg-[#087CB8] animate-[loading-bar_1.25s_ease-in-out_infinite]" />
      </div>
      <span className="sr-only" role="status">{label}</span>
    </div>
  </div>
);

export default LoadingScreen;
