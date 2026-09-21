
const ZoomControls = ({zoom,onZoomIn,onZoomOut,onReset,}) => {
  return (
    <div className="flex items-center gap-1 rounded border border-slate-700 bg-slate-900/90 p-1 shadow-xl">

      <button type="button" onClick={onZoomOut} className="flex h-9 w-9 items-center justify-center rounded text-lg text-slate-300 transition hover:bg-white/10 hover:text-white">−</button>
      <button type="button" onClick={onReset} className="h-9 min-w-[60px] rounded px-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">{zoom}%</button>
      <button type="button" onClick={onZoomIn} className="flex h-9 w-9 items-center justify-center rounded text-lg text-slate-300 transition hover:bg-white/10 hover:text-white">+</button>

    </div>
  );
};

export default ZoomControls