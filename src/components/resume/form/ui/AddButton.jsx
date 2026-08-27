import React from "react";

const AddButton = ({children,onClick}) => {
  return (<button type="button" onClick={onClick} className="mt-4 w-full h-11 rounded-md border border-dashed border-slate-300 text-slate-600 text-xs font-semibold hover:border-[#38B6FF] hover:text-[#087CB8] hover:bg-[#EAF7FF] transition">{children}</button>);
};

export default AddButton;