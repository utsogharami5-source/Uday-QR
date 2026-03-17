import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import { db, type QRType } from '../db';

const TABS: { id: QRType; icon: string; label: string }[] = [
  { id: 'URL', icon: 'link', label: 'URL' },
  { id: 'Text', icon: 'notes', label: 'Text' },
  { id: 'Wi-Fi', icon: 'wifi', label: 'Wi-Fi' },
  { id: 'Contact', icon: 'person', label: 'Contact' },
];

export default function Generator() {
  const [activeTab, setActiveTab] = useState<QRType>('URL');
  const [inputValue, setInputValue] = useState('');
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [hasExported, setHasExported] = useState(false);

  // Reset input when tab changes for simplicity
  useEffect(() => {
    setInputValue('');
    setHasExported(false);
  }, [activeTab]);

  const handleExport = async () => {
    if (!inputValue) return;

    // 1. Save to Database if not already saved during this session
    if (!hasExported) {
      await db.history.add({
        type: activeTab,
        source: 'Generated',
        content: inputValue,
        timestamp: new Date()
      });
      setHasExported(true);
    }

    // 2. Export / Share Logic
    if (qrRef.current) {
      const canvas = qrRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      
      // Native Share API if available (Mobile browser Android/iOS)
      if (navigator.share) {
        try {
          // Convert dataUrl to Blob for sharing
          const blob = await fetch(dataUrl).then(res => res.blob());
          const file = new File([blob], 'uday-qr.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'QR Code',
            text: 'Here is my QR Code generated with Uday QR.',
            files: [file]
          });
          return;
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } 
      
      // Fallback: Download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `uday-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto pb-4 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300 pt-safe">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">qr_code_2</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">QR Generator</h1>
          <button onClick={() => alert('Help guide coming soon')} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        
        {/* Tabbed Interface */}
        <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="text-[11px] font-semibold mt-1 uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800 rounded-xl">
          <label className="flex-1 relative cursor-pointer group">
            <input defaultChecked className="sr-only peer" name="qr-type" type="radio"/>
            <div className="py-2 text-center rounded-lg text-sm font-medium transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:shadow-sm peer-checked:text-primary text-slate-600 dark:text-slate-400">
              Static
            </div>
          </label>
          <label className="flex-1 relative cursor-pointer group" onClick={() => alert('Dynamic QR codes coming soon!')}>
            <input className="sr-only peer" name="qr-type" type="radio"/>
            <div className="py-2 text-center rounded-lg text-sm font-medium transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:shadow-sm peer-checked:text-primary text-slate-600 dark:text-slate-400">
              Dynamic
            </div>
          </label>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Destination {activeTab}</label>
            <textarea 
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setHasExported(false); // Reset export state if they change the code
              }}
              className="w-full min-h-[160px] p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-lg placeholder:text-slate-400"
              placeholder={`Enter ${activeTab} data...`}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-900 dark:bg-slate-100"></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">QR Color</p>
                <p className="text-xs font-medium">#000000</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => alert('Logo upload coming soon!')}>
              <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Add Logo</p>
                <p className="text-xs font-medium">Optional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-4 transition-colors duration-300">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-xl inline-block transition-all duration-300">
            {inputValue ? (
              <div className="w-32 h-32 flex items-center justify-center">
                 <QRCodeCanvas 
                    id="qr-generated-canvas"
                    value={activeTab === 'URL' && !inputValue.startsWith('http') ? `https://${inputValue}` : inputValue} 
                    size={128} 
                    level="H"
                    includeMargin={false}
                    className="rounded pointer-events-none"
                    // Important to pass ref for the export step
                    ref={qrRef}
                 />
              </div>
            ) : (
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">qr_code_2</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 max-w-[250px] leading-relaxed">
            {inputValue ? 'Ready to test or export your new QR code' : `Enter a ${activeTab} to generate your high-resolution QR code preview`}
          </p>
        </div>

      </main>
      
      {/* Primary Action */}
      <div className="px-4 mt-auto">
        <button 
          onClick={handleExport}
          disabled={!inputValue}
          className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          <span>{hasExported ? 'Shared / Exported!' : 'Generate QR Code'}</span>
          <span className="material-symbols-outlined">bolt</span>
        </button>
      </div>
    </div>
  );
}
