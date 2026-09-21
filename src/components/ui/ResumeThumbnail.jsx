
const ResumeThumbnail = ({ variant = 'modern', className = '' }) => {
  
  // Modern: Blue accent (#087CB8), contemporary typography/hierarchy. Asymmetric layout.
  const renderModern = () => (
    <div className="w-full h-full p-[8%] flex flex-col gap-[6%] bg-white">
      <div className="flex gap-[6%] h-[15%]">
        <div className="w-[18%] h-full bg-[#087CB8] rounded-full shrink-0 flex items-center justify-center">
          <div className="w-[50%] h-[50%] rounded-full bg-white/20" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-[10%]">
          <div className="w-[65%] h-[35%] bg-[#151719]" />
          <div className="w-[35%] h-[20%] bg-[#087CB8]/80" />
        </div>
      </div>
      <div className="flex gap-[8%] flex-1">
        <div className="w-[28%] flex flex-col gap-[6%]">
          <div className="w-full h-[3%] bg-[#151719] mb-[4%]" />
          <div className="w-[85%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-[65%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-[90%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-full h-[3%] bg-[#151719] mt-[12%] mb-[4%]" />
          <div className="w-[75%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-[85%] h-[2%] bg-[#DFE2E4]" />
        </div>
        <div className="w-[1px] bg-[#E2E4E6]" />
        <div className="flex-1 flex flex-col gap-[5%] pt-[2%]">
          <div className="w-[25%] h-[3%] bg-[#151719] mb-[2%]" />
          <div className="w-[45%] h-[2.5%] bg-[#087CB8]/60" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-[92%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-[96%] h-[2%] bg-[#DFE2E4]" />
          
          <div className="w-[40%] h-[2.5%] bg-[#087CB8]/60 mt-[8%]" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-[82%] h-[2%] bg-[#DFE2E4]" />
        </div>
      </div>
    </div>
  );

  // Editorial: Cream (#FDFBF7)/black. Elegant serif accent, large typography, magazine-inspired.
  const renderEditorial = () => (
    <div className="w-full h-full p-[10%] flex flex-col gap-[4%] bg-[#FDFBF7]">
      <div className="w-full border-b-[2px] border-[#151719] pb-[8%] mb-[2%] flex flex-col items-center">
        <div className="w-[85%] h-[7%] bg-[#151719] mb-[5%]" />
        <div className="w-[30%] h-[2%] bg-[#626870]" />
      </div>
      
      <div className="w-full flex-1 flex flex-col gap-[6%]">
        <div className="w-full h-[3.5%] bg-[#151719]" />
        <div className="w-full flex justify-between">
          <div className="w-[25%] h-[2.5%] bg-[#626870]" />
          <div className="w-[70%] flex flex-col gap-[20%]">
             <div className="w-full h-[2%] bg-[#D5D7D8]" />
             <div className="w-[92%] h-[2%] bg-[#D5D7D8]" />
             <div className="w-[96%] h-[2%] bg-[#D5D7D8]" />
             <div className="w-[80%] h-[2%] bg-[#D5D7D8]" />
          </div>
        </div>
        
        <div className="w-full h-[3.5%] bg-[#151719] mt-[6%]" />
        <div className="w-full flex justify-between">
          <div className="w-[25%] h-[2.5%] bg-[#626870]" />
          <div className="w-[70%] flex flex-col gap-[20%]">
             <div className="w-full h-[2%] bg-[#D5D7D8]" />
             <div className="w-[88%] h-[2%] bg-[#D5D7D8]" />
          </div>
        </div>
      </div>
    </div>
  );

  // Creative: Coral accent (#F26B5E), expressive typography, geometric details.
  const renderCreative = () => (
    <div className="w-full h-full flex bg-white">
      <div className="w-[38%] h-full bg-[#151719] p-[6%] flex flex-col">
        <div className="w-[85%] aspect-square bg-[#F26B5E] rounded-br-[16px] mb-[15%]" />
        <div className="w-[90%] h-[4%] bg-white mb-[8%]" />
        <div className="w-[60%] h-[2%] bg-white/60 mb-[15%]" />
        
        <div className="w-full h-[1px] bg-white/20 mb-[8%]" />
        <div className="w-[75%] h-[2.5%] bg-[#F26B5E] mb-[6%]" />
        <div className="w-[85%] h-[2%] bg-white/50 mb-[4%]" />
        <div className="w-[95%] h-[2%] bg-white/50 mb-[4%]" />
        <div className="w-[70%] h-[2%] bg-white/50" />
      </div>
      <div className="flex-1 h-full p-[8%] flex flex-col gap-[4%] relative">
        <div className="absolute top-[8%] right-[8%] w-[20%] h-[2%] bg-[#F26B5E]/20" />
        <div className="w-[80%] h-[7%] bg-[#151719] mb-[8%]" />
        
        <div className="w-[35%] h-[3.5%] bg-[#151719] mb-[2%]" />
        <div className="w-full h-[2.5%] bg-[#DFE2E4]" />
        <div className="w-[92%] h-[2.5%] bg-[#DFE2E4]" />
        <div className="w-[98%] h-[2.5%] bg-[#DFE2E4]" />
        
        <div className="w-[40%] h-[3.5%] bg-[#151719] mt-[8%] mb-[2%]" />
        <div className="w-[65%] h-[3%] bg-[#F26B5E]" />
        <div className="w-full h-[2.5%] bg-[#DFE2E4]" />
        <div className="w-[85%] h-[2.5%] bg-[#DFE2E4]" />
      </div>
    </div>
  );

  // Executive: Deep navy (#1A2B4C) / muted gold (#C5A880) accents, high density.
  const renderExecutive = () => (
    <div className="w-full h-full p-[8%] flex flex-col gap-[4%] bg-white border-t-[6px] border-[#1A2B4C]">
      <div className="flex justify-between items-end mb-[4%] pb-[4%] border-b-[2px] border-[#C5A880]">
        <div className="w-[65%] flex flex-col gap-[15%]">
          <div className="w-[90%] h-[35%] bg-[#1A2B4C]" />
          <div className="w-[50%] h-[15%] bg-[#C5A880]" />
        </div>
        <div className="w-[30%] flex flex-col items-end gap-[15%]">
          <div className="w-[100%] h-[10%] bg-[#9BA3AE]" />
          <div className="w-[80%] h-[10%] bg-[#9BA3AE]" />
        </div>
      </div>
      
      <div className="flex gap-[6%] flex-1">
        <div className="flex-1 flex flex-col gap-[3%]">
          <div className="w-[30%] h-[3%] bg-[#1A2B4C] mb-[2%]" />
          <div className="w-[60%] h-[2.5%] bg-[#151719]" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-[90%] h-[2%] bg-[#DFE2E4]" />
          
          <div className="w-[60%] h-[2.5%] bg-[#151719] mt-[4%]" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-[85%] h-[2%] bg-[#DFE2E4]" />
        </div>
        <div className="w-[35%] flex flex-col gap-[3%] pl-[6%] border-l border-[#DFE2E4]">
          <div className="w-[50%] h-[3%] bg-[#1A2B4C] mb-[2%]" />
          <div className="w-full h-[2%] bg-[#DFE2E4]" />
          <div className="w-[80%] h-[2%] bg-[#DFE2E4]" />
          <div className="w-[90%] h-[2%] bg-[#DFE2E4]" />
        </div>
      </div>
    </div>
  );

  // Tech: Indigo accent (#635BFF), structured grid, technical.
  const renderTech = () => (
    <div className="w-full h-full p-[6%] flex flex-col gap-[3%] bg-white border border-[#E2E4E6]">
      <div className="flex justify-between items-center bg-[#F7F7F5] p-[4%] mb-[2%]">
        <div className="w-[50%] flex flex-col gap-[15%]">
           <div className="w-[80%] h-[40%] bg-[#151719]" />
           <div className="w-[60%] h-[20%] bg-[#635BFF]" />
        </div>
        <div className="w-[20%] aspect-square border-2 border-[#635BFF] flex items-center justify-center">
           <div className="w-[40%] h-[40%] bg-[#635BFF]" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-[4%] mt-[2%]">
         <div className="flex flex-col gap-[4%]">
            <div className="w-[40%] h-[3%] bg-[#151719] mb-[2%]" />
            <div className="w-[70%] h-[2.5%] bg-[#635BFF]" />
            <div className="w-full h-[2%] bg-[#DFE2E4]" />
            <div className="w-[90%] h-[2%] bg-[#DFE2E4]" />
            <div className="w-full h-[2%] bg-[#DFE2E4]" />
            
            <div className="w-[80%] h-[2.5%] bg-[#635BFF] mt-[4%]" />
            <div className="w-[95%] h-[2%] bg-[#DFE2E4]" />
            <div className="w-[85%] h-[2%] bg-[#DFE2E4]" />
         </div>
         <div className="flex flex-col gap-[4%]">
            <div className="w-[40%] h-[3%] bg-[#151719] mb-[2%]" />
            <div className="w-[65%] h-[2.5%] bg-[#626870]" />
            <div className="flex flex-wrap gap-[4%]">
               <div className="w-[40%] h-[3%] bg-[#EAF5FA]" />
               <div className="w-[30%] h-[3%] bg-[#EAF5FA]" />
               <div className="w-[45%] h-[3%] bg-[#EAF5FA]" />
               <div className="w-[35%] h-[3%] bg-[#EAF5FA]" />
            </div>
         </div>
      </div>
    </div>
  );

  // Minimal: Black/white. Restrained, max clarity.
  const renderMinimal = () => (
    <div className="w-full h-full p-[10%] flex flex-col gap-[5%] bg-white">
      <div className="flex justify-between items-end mb-[4%]">
        <div className="w-[55%] h-[6%] bg-[#151719]" />
        <div className="w-[30%] flex flex-col items-end gap-[15%]">
          <div className="w-[80%] h-[2%] bg-[#626870]" />
          <div className="w-[100%] h-[2%] bg-[#626870]" />
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#E2E4E6] mb-[2%]" />
      
      <div className="flex flex-col gap-[3%] pl-[15%] relative">
        <div className="absolute left-0 top-0 w-[10%] h-[2.5%] bg-[#151719]" />
        <div className="w-[40%] h-[2.5%] bg-[#151719] mb-[2%]" />
        <div className="w-full h-[2%] bg-[#DFE2E4]" />
        <div className="w-[95%] h-[2%] bg-[#DFE2E4]" />
        <div className="w-full h-[2%] bg-[#DFE2E4]" />
      </div>
      
      <div className="flex flex-col gap-[3%] mt-[4%] pl-[15%] relative">
        <div className="absolute left-0 top-0 w-[10%] h-[2.5%] bg-[#151719]" />
        <div className="w-[45%] h-[2.5%] bg-[#151719] mb-[2%]" />
        <div className="w-full h-[2%] bg-[#DFE2E4]" />
        <div className="w-[90%] h-[2%] bg-[#DFE2E4]" />
        <div className="w-[85%] h-[2%] bg-[#DFE2E4]" />
      </div>
    </div>
  );

  const getVariant = () => {
    switch (variant.toLowerCase()) {
      case 'modern': return renderModern();
      case 'editorial': return renderEditorial();
      case 'classic': return renderEditorial();
      case 'professional': return renderExecutive();
      case 'corporate': return renderExecutive();
      case 'strategic': return renderModern();
      case 'elegant': return renderEditorial();
      case 'refined': return renderEditorial();
      case 'contemporary': return renderCreative();
      case 'cleantech': return renderTech();
      case 'executive': return renderExecutive();
      case 'creative': return renderCreative();
      case 'tech': return renderTech();
      case 'minimal': return renderMinimal();
      default: return renderModern();
    }
  };

  return (
    <div className={`relative bg-white shadow-sm ring-1 ring-black/5 overflow-hidden aspect-[1/1.414] ${className}`}>
      {getVariant()}
    </div>
  );
};

export default ResumeThumbnail;
