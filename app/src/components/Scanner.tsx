import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import ScanResultModal from './ScanResultModal';
import { useTheme } from './ThemeProvider';
import { db, type QRType } from '../db';

export default function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const { theme, setTheme } = useTheme();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Scanner when component mounts
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          async (decodedText, _decodedResult) => {
            // Stop scanning on success
            if (scannerRef.current?.isScanning) {
              await scannerRef.current.stop();
              setIsScanning(false);
            }
            
            setScanResult(decodedText);
            
            // Determine type
            let type: QRType = 'Text';
            if (decodedText.startsWith('http')) type = 'URL';
            else if (decodedText.startsWith('WIFI:')) type = 'Wi-Fi';
            else if (decodedText.startsWith('BEGIN:VCARD')) type = 'Contact';
            
            // Save to DB
            await db.history.add({
              type,
              source: 'Scanned',
              content: decodedText,
              timestamp: new Date()
            });
          },
          (_errorMessage) => {
            // Log errors but don't disrupt user (usually just "not found yet")
          }
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Camera start error:", err);
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        }).catch(err => console.error("Stop error", err));
      } else {
        scannerRef.current?.clear();
      }
    };
  }, []);

  const handleRestart = () => {
    setScanResult(null);
    window.location.reload(); 
  };

  const toggleTorch = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: !torchOn } as any]
        });
        setTorchOn(!torchOn);
      } catch (e) {
        alert("Torch is not supported on this device's camera.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!scannerRef.current) {
         scannerRef.current = new Html5Qrcode("qr-reader");
      }
      const result = await scannerRef.current.scanFileV2(file);
      if (result?.decodedText) {
        setScanResult(result.decodedText);
        let type: QRType = 'Text';
        if (result.decodedText.startsWith('http')) type = 'URL';
        else if (result.decodedText.startsWith('WIFI:')) type = 'Wi-Fi';
        else if (result.decodedText.startsWith('BEGIN:VCARD')) type = 'Contact';
        await db.history.add({
          type,
          source: 'Scanned',
          content: result.decodedText,
          timestamp: new Date()
        });
      }
    } catch(err) {
      alert("No QR code found in the selected image.");
    }
    // reset input
    e.target.value = '';
  };

  return (
    <div className="relative mx-auto w-full h-full bg-slate-900 flex flex-col overflow-hidden">
      {/* Camera Viewport */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center">
         <div id="qr-reader" className="w-[100vw] h-[100vh] min-w-full min-h-full object-cover [&>video]:object-cover [&>video]:w-[100vw] [&>video]:h-[100vh] [&>video]:min-w-full [&>video]:min-h-full [&>div]:hidden"></div>
         <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10 dark:bg-black/40 pointer-events-none transition-colors duration-300"></div>
      </div>

      {/* Viewfinder Overlay */}
      {!scanResult && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-72 h-96 rounded-xl border-2 border-white/20 dark:border-white/10 viewfinder-border overflow-hidden shadow-[0_0_0_4000px_rgba(245,247,248,0.3)] dark:shadow-[0_0_0_4000px_rgba(2,6,23,0.7)] transition-shadow duration-300">
            <div className="scanner-line absolute w-full top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg shadow-[0_0_10px_rgba(0,123,255,0.5)]"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg shadow-[0_0_10px_rgba(0,123,255,0.5)]"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg shadow-[0_0_10px_rgba(0,123,255,0.5)]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg shadow-[0_0_10px_rgba(0,123,255,0.5)]"></div>
          </div>
          <div className="mt-8">
            {isScanning ? (
              <>
                <div className="h-1 w-full max-w-xs bg-black/20 dark:bg-white/20 rounded-full overflow-hidden mb-2 hidden">
                   <div className="h-full bg-primary w-full shadow-[0_0_10px_#007bff]"></div>
                </div>
                <p className="text-slate-800 dark:text-white font-medium text-sm tracking-wide bg-white/70 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/10 shadow-lg text-center">
                  Position document in the frame
                </p>
              </>
            ) : (
              <p className="text-slate-600 dark:text-slate-300 font-medium text-xs tracking-widest uppercase bg-white/60 dark:bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md drop-shadow-md text-center">
                Initializing Camera...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-safe">
        <button className="size-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 backdrop-blur-md transition-colors border border-black/5 dark:border-white/10 text-slate-800 dark:text-white" onClick={() => alert('Help documentation coming soon!')}>
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white drop-shadow-md">Document Scanner</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="size-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 backdrop-blur-md transition-colors border border-black/5 dark:border-white/10 text-slate-800 dark:text-white pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Controls */}
      {!scanResult && (
        <div className="relative z-20 px-4 pb-8">
          <div className="frosted-glass rounded-xl p-6 flex items-center justify-between mb-4 shadow-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            
            {/* Gallery Trigger */}
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 group w-16">
              <div className="size-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-white/20 transition-colors border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="material-symbols-outlined">photo_library</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-tighter">Gallery</span>
            </button>
            
            {/* Shutter Button */}
            <button onClick={handleRestart} className="relative size-20 rounded-full border-4 border-primary p-1 hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(0,123,255,0.3)] dark:shadow-[0_0_25px_rgba(0,123,255,0.4)] bg-transparent">
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="material-symbols-outlined text-white text-[34px]">qr_code_scanner</span>
              </div>
            </button>
            
            {/* Flash Trigger */}
            <button onClick={toggleTorch} className="flex flex-col items-center gap-1 group w-16">
              <div className={`size-12 rounded-full flex items-center justify-center transition-colors border shadow-sm ${torchOn ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(0,123,255,0.5)]' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/20'}`}>
                <span className="material-symbols-outlined">flash_on</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${torchOn ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>Flash</span>
            </button>
          </div>
        </div>
      )}
      
      {scanResult && <ScanResultModal result={scanResult} onClose={handleRestart} />}
    </div>
  );
}
