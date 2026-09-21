
const AddButton = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="mt-4 inline-flex h-9 items-center gap-2 border border-[#DCE1E2] bg-white px-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#087CB8] hover:border-[#BFD3DC] hover:bg-[#F7FBFD] transition-colors rounded">
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    {children}
  </button>
);

export default AddButton;
