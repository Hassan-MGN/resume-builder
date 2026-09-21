import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TemplateSelection from "./resume/builder/TemplateSelection";
import Brand from "./ui/Brand";

const CATEGORY_LABELS = {
  all: "All templates",
  professional: "Professional templates",
  modern: "Modern templates",
  elegant: "Elegant templates",
};

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requestedCategory = params.get("category") || "all";
  const category = ["all", "professional", "modern", "elegant"].includes(requestedCategory) ? requestedCategory : "all";

  const title = useMemo(() => CATEGORY_LABELS[category], [category]);

  const handleSelect = (templateId) => {
    navigate(`/builder/new?template=${encodeURIComponent(templateId)}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#151719]">
      <header className="sticky top-0 z-30 border-b border-[#DFDED9] bg-[#F4F3EF]/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1320px] items-center justify-between px-5 sm:px-8 xl:px-10">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex h-8 w-8 items-center justify-center rounded border border-[#D4D2CC] bg-white text-[#626870] hover:text-[#151719] rounded" title="Back to dashboard"></Link>
            <div className="h-5 w-px bg-[#DAD8D2]" />
            <Brand markClassName="h-7 w-7" textClassName="text-sm font-semibold" />
          </div>
          <Link to="/builder" className="text-xs font-semibold text-[#087CB8] hover:underline rounded">Back to start</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 py-9 sm:px-8 xl:px-10 xl:py-12">
        <section className="mb-10 overflow-hidden border-b border-[#DFDED9] pb-9">
          <div className="mb-6 grid h-2 w-full grid-cols-3"><span className="bg-[#087CB8]" /><span className="bg-[#635BFF]" /><span className="bg-[#F26B5E]" /></div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">Template library</div>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-[34px] font-semibold tracking-[-0.045em] sm:text-[46px]">{title}</h1>
              <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#70756F]">Choose the document structure first. Your content stays editable, and you can switch templates later without starting over.</p>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#959A93]">11 designs · live previews</div>
          </div>
        </section>

        <TemplateSelection currentTemplate={null} onSelect={handleSelect} initialCategory={category} />
      </main>
    </div>
  );
};

export default TemplateLibrary;
