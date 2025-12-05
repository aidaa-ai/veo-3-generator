import React from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { VideoGenerationState } from '../types';

interface VideoResultProps {
  state: VideoGenerationState;
}

const VideoResult: React.FC<VideoResultProps> = ({ state }) => {
  if (!state.isGenerating && !state.videoUri && !state.error) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl animate-fade-in mt-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="bg-indigo-500 w-1 h-6 rounded-full"></span>
        3. Result
      </h2>

      <div className="bg-black/40 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center border border-slate-800 relative">
        {state.isGenerating && (
          <div className="text-center p-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
               <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-indigo-400 font-medium animate-pulse">{state.progressMessage}</p>
            <p className="text-slate-500 text-sm mt-2">This usually takes about 1-2 minutes.</p>
          </div>
        )}

        {state.error && (
          <div className="text-center p-8 max-w-md">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-white font-medium mb-1">Generation Failed</h3>
            <p className="text-red-400 text-sm">{state.error}</p>
          </div>
        )}

        {!state.isGenerating && state.videoUri && (
          <div className="w-full h-full flex flex-col items-center">
             <video 
                src={state.videoUri} 
                controls 
                autoPlay 
                loop 
                className="max-w-full max-h-[600px] rounded-lg shadow-2xl"
                crossOrigin="anonymous" // Important for some browser security contexts
             />
             <div className="mt-4 flex gap-4">
                <a 
                  href={state.videoUri} 
                  download="veo-generation.mp4"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download MP4
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoResult;