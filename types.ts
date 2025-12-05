export interface PromptInputs {
  subject: string; // 1. Subjek
  action: string; // 2. Aksi
  expression: string; // 3. Ekspresi
  place: string; // 4. Tempat
  time: string; // 5. Waktu
  camera: string; // 6. Gerakan Kamera
  lighting: string; // 7. Pencahayaan
  style: string; // 8. Gaya Video
  mood: string; // 9. Suasana Video
  sound: string; // 10. Suara atau Musik
  spokenWords: string; // 11. Kalimat yang diucapkan
  details: string; // 12. Detail Tambahan
}

export interface GeneratedPrompts {
  indonesian: string;
  english: string;
}

export interface VideoGenerationState {
  isGenerating: boolean;
  progressMessage: string;
  videoUri: string | null;
  error: string | null;
}

export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16'
}

export enum Resolution {
  HD = '720p',
  FHD = '1080p'
}