import { GoogleGenAI } from "@google/genai";
import { PromptInputs, GeneratedPrompts, AspectRatio, Resolution } from "../types";

// Helper to get a fresh client instance (important for key switching)
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for environments without the wrapper (though app depends on it)
};

export const requestApiKey = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

export const refinePromptWithGemini = async (inputs: PromptInputs): Promise<GeneratedPrompts> => {
  const ai = getClient();
  
  const systemInstruction = `You are a specialized prompt engineer for Google Veo 3 video generation.
  
  Your task is to take 12 user inputs and generate TWO versions of a high-quality video generation prompt:
  1. **Indonesian Version**: A creative, detailed, and expanded paragraph in Indonesian.
  2. **English Version**: A translation of the detailed Indonesian prompt into English, optimized for the Veo 3 model.

  ### Critical Rules for English Version:
  - Translate all descriptions (Subject, Action, Place, etc.) into descriptive English.
  - **EXCEPTION**: The content of the "Spoken Words" (Kalimat yang diucapkan) input MUST remain in its ORIGINAL language (Indonesian). Do not translate the spoken text.
  - Structure: "[Camera Movement] of [Subject] [Action] with [Expression] in [Place] at [Time]. [Lighting], [Style], [Mood]. [Details]. Sound: [Sound]. Character says: '[Spoken Words]'."

  ### User Inputs:
  1. Subject: ${inputs.subject}
  2. Action: ${inputs.action}
  3. Expression: ${inputs.expression}
  4. Place: ${inputs.place}
  5. Time: ${inputs.time}
  6. Camera: ${inputs.camera}
  7. Lighting: ${inputs.lighting}
  8. Style: ${inputs.style}
  9. Mood: ${inputs.mood}
  10. Sound/Music: ${inputs.sound}
  11. Spoken Words: ${inputs.spokenWords}
  12. Additional Details: ${inputs.details}

  Output strictly in JSON format: { "indonesian": "string", "english": "string" }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate the dual-language prompts now based on the instructions.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    try {
        const json = JSON.parse(text);
        return {
            indonesian: json.indonesian || "Gagal membuat prompt Bahasa Indonesia.",
            english: json.english || "Failed to generate English prompt."
        };
    } catch (e) {
        console.error("JSON Parse Error", e);
        return { indonesian: text, english: text }; // Fallback
    }

  } catch (error) {
    console.error("Error optimizing prompt:", error);
    throw new Error("Could not optimize prompt. Please try again.");
  }
};

export const generateVeoVideo = async (
  prompt: string, 
  aspectRatio: AspectRatio, 
  resolution: Resolution,
  onProgress: (msg: string) => void
): Promise<string> => {
  const ai = getClient();

  try {
    onProgress("Initializing generation request...");
    
    // Using 'veo-3.1-fast-generate-preview' for quicker interactive results.
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution, 
        aspectRatio: aspectRatio
      }
    });

    onProgress("Veo 3 is dreaming up your video...");
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      onProgress("Rendering frames...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed.");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("No video URI returned from API.");
    }

    // Append API key to the URI for access
    const authenticatedUri = `${videoUri}&key=${process.env.API_KEY}`;
    
    return authenticatedUri;

  } catch (error: any) {
    console.error("Veo generation error:", error);
    
    const msg = error.message || error.toString();
    
    // Handle specific API errors with prefixed codes for App.tsx to interpret
    if (msg.includes("Requested entity was not found") || msg.includes("API key not valid")) {
       throw new Error("AUTH_ERROR: The selected API Key is invalid or not found. Please re-select a paid GCP project key.");
    }
    
    if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
       throw new Error("AUTH_ERROR: Permission denied. Your API key may lack access to Veo. Ensure billing is enabled.");
    }
    
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("QUOTA_ERROR: API usage limit exceeded. Please check your project quotas.");
    }
    
    if (msg.includes("400") || msg.includes("INVALID_ARGUMENT")) {
         throw new Error("VALIDATION_ERROR: The model rejected the request. Please try modifying your prompt.");
    }

    throw error;
  }
};