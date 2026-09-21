
const BuilderHeader = ({
  score = 0,
  template,
  onChangeTemplate,
  zoom,
  onZoomOut,
  onZoomIn,
  onResetZoom,
}) => {
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-white">
              Resume Builder
            </h1>

            <p className="text-xs text-slate-400">
              Design your professional resume
            </p>
          </div>

          <div className="hidden h-6 w-px bg-white/10 md:block" />

          <div className="hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-slate-400">
              Autosaved
            </span>
          </div>
        </div>


        {/* CENTER */}
        <div className="hidden items-center gap-3 lg:flex">

          <div className="rounded border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex items-center gap-3">

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Resume strength
                </p>

                <p className="text-sm font-semibold text-white">
                  {score}%
                </p>
              </div>

              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>

            </div>
          </div>

        </div>


        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* Template */}
          <button
            type="button"
            onClick={onChangeTemplate}
            className="hidden rounded border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 sm:block"
          >
            {template || "Template"}
          </button>


          {/* Zoom */}
          <div className="flex items-center rounded border border-white/10 bg-white/5">

            <button
              type="button"
              onClick={onZoomOut}
              className="px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white rounded"
            >
              −
            </button>

            <button
              type="button"
              onClick={onResetZoom}
              className="min-w-[55px] border-x border-white/10 px-2 py-2 text-xs text-slate-300 rounded"
            >
              {zoom}%
            </button>

            <button
              type="button"
              onClick={onZoomIn}
              className="px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white rounded"
            >
              +
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BuilderHeader;