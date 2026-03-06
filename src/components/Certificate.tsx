import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const Certificate = () => {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [date] = useState(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  const handleGenerate = () => {
    if (name.trim()) {
      setGenerated(true);
    }
  };

  const handleDownload = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `AI_for_Everyone_Certificate_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 space-y-8">
      {!generated ? (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Generate Your Certificate
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter your name exactly as you want it to appear on your certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name (e.g. John Doe)"
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={!name.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Generate
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-lg hover:shadow-green-500/25"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
          </div>

          <div className="overflow-auto p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
            {/* Certificate Design */}
            <div
              ref={certificateRef}
              className="relative w-[800px] h-[600px] mx-auto bg-white text-zinc-900 p-12 shadow-2xl border-[20px] border-double border-zinc-100 flex flex-col items-center justify-between text-center select-none"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              {/* Watermark/Background Decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <div className="w-96 h-96 rounded-full border-[40px] border-zinc-900"></div>
              </div>

              {/* Header */}
              <div className="space-y-2 z-10 mt-8">
                <div className="text-sm tracking-[0.3em] uppercase text-zinc-500 font-semibold">
                  Certificate of Completion
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
                  AI for Everyone
                </h1>
              </div>

              {/* Body */}
              <div className="space-y-6 z-10 my-auto">
                <p className="text-lg text-zinc-500 italic">
                  This certifies that
                </p>
                <div className="text-4xl font-bold text-blue-600 border-b-2 border-zinc-100 pb-4 px-12 inline-block min-w-[400px]">
                  {name}
                </div>
                <p className="text-lg text-zinc-500 max-w-lg mx-auto leading-relaxed">
                  has successfully completed the comprehensive course on Artificial Intelligence concepts, ethics, and applications.
                </p>
              </div>

              {/* Footer */}
              <div className="w-full flex justify-between items-end z-10 mb-8 px-8">
                <div className="text-left space-y-1">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">Certificate ID</div>
                  <div className="font-mono text-sm text-zinc-600">{certId}</div>
                </div>
                
                <div className="text-center space-y-4">
                  {/* Signature Line */}
                  <div className="w-48 border-b border-zinc-900"></div>
                  <div className="text-sm font-semibold uppercase tracking-wider">DataRockie & Trae</div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">Date Issued</div>
                  <div className="font-medium text-sm text-zinc-600">{date}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-zinc-500">
            <button 
                onClick={() => setGenerated(false)}
                className="hover:underline"
            >
                Edit Name
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
