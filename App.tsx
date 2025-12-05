import React, { useState, useEffect } from 'react';
import { PromptInputs, VideoGenerationState, AspectRatio, Resolution, GeneratedPrompts } from './types';
import { refinePromptWithGemini, generateVeoVideo, checkApiKey, requestApiKey } from './services/geminiService';
import InputForm from './components/InputForm';
import PromptDisplay from './components/PromptDisplay';
import VideoResult from './components/VideoResult';
import { Sparkles, Key } from 'lucide-react';

const App: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
  
  // New 12-field input state
  const [inputs, setInputs] = useState<PromptInputs>({
    subject: '',
    action: '',
    expression: '',
    place: '',
    time: '',
    camera: '',
    lighting: '',
    style: '',
    mood: '',
    sound: '',
    spokenWords: '',
    details: ''
  });

  // State for the dual prompt result
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompts | null>(null);
  
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  
  const [videoState, setVideoState] = useState<VideoGenerationState>({
    isGenerating: false,
    progressMessage: '',
    videoUri: null,
    error: null
  });

  // Check API key on mount
  useEffect(() => {
    const initKey = async () => {
      const hasKey = await checkApiKey();
      setApiKeyReady(hasKey);
    };
    initKey();
  }, []);

  const handleConnectKey = async () => {
    try {
      await requestApiKey();
      setApiKeyReady(true);
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!inputs.subject) return;
    setIsOptimizing(true);
    try {
      const result = await refinePromptWithGemini(inputs);
      setGeneratedPrompts(result);
    } catch (error) {
      console.error(error);
      alert("Failed to optimize prompt. See console.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateVideo = async (aspectRatio: AspectRatio, resolution: Resolution) => {
    if (!apiKeyReady) {
      await handleConnectKey();
    }

    if (!generatedPrompts?.english) return;

    setVideoState({
      isGenerating: true,
      progressMessage: 'Initializing Veo 3...',
      videoUri: null,
      error: null
    });

    try {
      const uri = await generateVeoVideo(
        generatedPrompts.english, 
        aspectRatio, 
        resolution,
        (msg) => setVideoState(prev => ({ ...prev, progressMessage: msg }))
      );
      setVideoState(prev => ({
        ...prev,
        isGenerating: false,
        videoUri: uri
      }));
    } catch (error: any) {
      let errorMessage = error.message || "An unexpected error occurred.";
      
      // Enhanced Error Handling Logic
      const isAuthError = 
        errorMessage.includes("AUTH_ERROR") || 
        errorMessage.includes("API Key") || 
        errorMessage.includes("403");
        
      if (isAuthError) {
         setApiKeyReady(false); // Reset key state to force re-selection
         // Clean up message for UI
         errorMessage = errorMessage.replace("AUTH_ERROR: ", "");
         if (!errorMessage.includes("Please")) {
            errorMessage += " Please reconnect your API key.";
         }
      } else if (errorMessage.includes("QUOTA_ERROR")) {
         errorMessage = errorMessage.replace("QUOTA_ERROR: ", "");
      } else if (errorMessage.includes("VALIDATION_ERROR")) {
         errorMessage = errorMessage.replace("VALIDATION_ERROR: ", "");
      }

      setVideoState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage
      }));
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Veo 3 Prompt Director</h1>
              <p className="text-xs text-slate-400">Structured Prompt & Video Generator</p>
            </div>
          </div>
          
          {!apiKeyReady ? (
            <button 
              onClick={handleConnectKey}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-500/20 transition-all"
            >
              <Key className="w-4 h-4" />
              Connect Paid API Key
            </button>
          ) : (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-full text-xs font-medium">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               Veo 3 Connected
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro / Instructions */}
        <div className="text-center py-4">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Master the Veo 3 Structure</h2>
           <p className="text-slate-400 max-w-2xl mx-auto">
             Fill in the 12 cinematic elements below to generate a perfect Veo 3 prompt.
             <span className="text-purple-400 font-mono text-sm block mt-2">
               Auto-translates to English for the model (keeping spoken words original).
             </span>
           </p>
           {!apiKeyReady && (
             <div className="mt-6 p-4 bg-slate-800 rounded-lg inline-block border border-slate-700">
               <p className="text-sm text-slate-300 mb-2">To generate videos, you need a paid Google Cloud Project API key.</p>
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                 View Billing Documentation
               </a>
             </div>
           )}
        </div>

        <InputForm 
          inputs={inputs} 
          setInputs={setInputs} 
          onOptimize={handleOptimizePrompt}
          isOptimizing={isOptimizing}
        />

        {generatedPrompts && (
          <PromptDisplay 
            prompts={generatedPrompts}
            onUpdateIndonesian={(val) => setGeneratedPrompts({...generatedPrompts, indonesian: val})}
            onGenerateVideo={handleGenerateVideo}
            isGeneratingVideo={videoState.isGenerating}
          />
        )}

        <VideoResult state={videoState} />

      </main>
    </div>
  );
};

export default App;