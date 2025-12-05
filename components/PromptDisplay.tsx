import React, { useState } from 'react';
import { Copy, Video, Check, Film, Settings2, Download } from 'lucide-react';
import { AspectRatio, Resolution, GeneratedPrompts } from '../types';

interface PromptDisplayProps {
  prompts: GeneratedPrompts;
  onUpdateIndonesian: (val: string) => void;
  onGenerateVideo: (ar: AspectRatio, res: Resolution) => void;
  isGeneratingVideo: boolean;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompts, onUpdateIndonesian, onGenerateVideo, isGeneratingVideo }) => {
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Landscape);
  const [resolution, setResolution] = useState<Resolution>(Resolution.HD);

  const handleCopyEnglish = () => {
    navigator.clipboard.writeText(prompts.english);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `--- VEO 3 PROMPT GENERATOR ---\n\n[INDONESIAN PROMPT]\n${prompts.indonesian}\n\n[ENGLISH PROMPT (FINAL)]\n${prompts.english}`;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "veo-prompt-result.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="bg-emerald-500 w-1 h-6 rounded-full"></span>
            2. Hasil Prompt (Result)
        </h2>
        <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
            <Download className="w-4 h-4" />
            Download Text
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Indonesian Column (Editable) */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                Bahasa Indonesia (Editable)
                <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">Bisa Diedit</span>
            </label>
            <textarea
                value={prompts.indonesian}
                onChange={(e) => onUpdateIndonesian(e.target.value)}
                className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-sans text-sm leading-relaxed resize-none"
            />
        </div>

        {/* English Column (Read-only) */}
        <div className="space-y-2 relative">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                English (Final for Veo 3)
                <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Final Result</span>
            </label>
            <div className="relative h-64">
                <textarea
                    readOnly
                    value={prompts.english}
                    className="w-full h-full bg-slate-950/80 border border-emerald-500/30 rounded-lg p-4 text-emerald-50 focus:outline-none ring-1 ring-emerald-500/20 transition-all font-mono text-sm leading-relaxed resize-none"
                />
                <button
                    onClick={handleCopyEnglish}
                    className="absolute top-3 right-3 p-2 bg-slate-800/80 backdrop-blur rounded-md text-slate-300 hover:text-white hover:bg-emerald-600 transition-all border border-slate-600"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic">*Bagian dalam tanda kutip (spoken words) tidak diterjemahkan.</p>
        </div>

      </div>

      {/* Video Config */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mt-6">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-300">
          <Settings2 className="w-4 h-4" />
          <span>Generation Settings</span>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Aspect Ratio</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAspectRatio(AspectRatio.Landscape)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                  aspectRatio === AspectRatio.Landscape 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                16:9 Landscape
              </button>
              <button
                onClick={() => setAspectRatio(AspectRatio.Portrait)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                  aspectRatio === AspectRatio.Portrait 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                9:16 Portrait
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Resolution</span>
            <div className="flex gap-2">
              <button
                onClick={() => setResolution(Resolution.HD)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                  resolution === Resolution.HD
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                720p (Fast)
              </button>
              <button
                 onClick={() => setResolution(Resolution.FHD)}
                 className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                   resolution === Resolution.FHD
                     ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                     : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                 }`}
              >
                1080p (Quality)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onGenerateVideo(aspectRatio, resolution)}
          disabled={isGeneratingVideo || !prompts.english.trim()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 w-full md:w-auto justify-center
            ${isGeneratingVideo || !prompts.english.trim()
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20'}`}
        >
          {isGeneratingVideo ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Film className="w-5 h-5" />
              Generate with Veo 3
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptDisplay;