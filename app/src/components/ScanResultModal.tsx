export default function ScanResultModal({ result, onClose }: { result: string, onClose: () => void }) {
  const isUrl = result.startsWith('http');
  const type = isUrl ? 'Website Link Detected' : 'QR Data Detected';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    // Optional: add a toast or visual feedback here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scanned QR Code',
          text: result,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    }
  };

  const handleOpen = () => {
    if (isUrl) {
      window.open(result, '_blank');
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-pointer" 
        onClick={onClose}
      ></div>
      
      {/* Bottom Sheet */}
      <div className="relative flex flex-col items-stretch bg-white dark:bg-slate-900 rounded-t-[2rem] overflow-hidden pb-10 shadow-[0_-10px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_50px_rgba(0,0,0,0.5)] border-t border-slate-200 dark:border-white/10 transform transition-all duration-300 translate-y-0">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        {/* Handle */}
        <div className="flex h-5 w-full items-center justify-center pt-2 cursor-pointer" onClick={onClose}>
          <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 px-6 pt-8 pb-4 flex flex-col items-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl">{isUrl ? 'link' : 'notes'}</span>
          </div>
          
          <h3 className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight text-center">
            Scan Successful
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 mb-4 uppercase tracking-wider">
            {type}
          </p>
          
          <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center mb-8 max-h-32 overflow-y-auto">
            <p className="text-primary font-medium break-all text-lg transition-colors duration-300">
              {result}
            </p>
          </div>
          
          {/* Actions */}
          <div className="w-full space-y-3">
            {isUrl && (
              <button onClick={handleOpen} className="w-full flex items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
                <span className="truncate">Open Link</span>
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleCopy} className="flex flex-1 items-center justify-center rounded-xl h-12 px-4 border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 text-base font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined mr-2 text-xl">content_copy</span>
                <span>Copy</span>
              </button>
              
              <button onClick={handleShare} className="flex flex-1 items-center justify-center rounded-xl h-12 px-4 border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 text-base font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined mr-2 text-xl">share</span>
                <span>Share</span>
              </button>
            </div>
            
            <button onClick={onClose} className="w-full flex items-center justify-center h-12 text-slate-400 dark:text-slate-500 text-base font-medium">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
