import React from 'react';
import { PromptInputs } from '../types';
import { Wand2 } from 'lucide-react';

interface InputFormProps {
  inputs: PromptInputs;
  setInputs: React.Dispatch<React.SetStateAction<PromptInputs>>;
  onOptimize: () => void;
  isOptimizing: boolean;
}

// Option definitions
const timeOptions = [
  "Dawn (Subuh)", "Morning (Pagi)", "Noon (Siang)", "Afternoon (Sore)", 
  "Golden Hour (Jam Emas)", "Sunset (Matahari Terbenam)", "Dusk (Senja)", 
  "Night (Malam)", "Midnight (Tengah Malam)"
];

const lightingOptions = [
  "Natural Light (Cahaya Alami)", "Cinematic (Sinematik)", "Studio Lighting (Pencahayaan Studio)",
  "Soft Lighting (Cahaya Lembut)", "Hard Lighting (Cahaya Keras)", "Volumetric (Volumetrik/Berisi)",
  "Neon (Neon)", "Low Key (Remang)", "High Key (Terang Benderang)", "Bioluminescent (Bioluminesensi)"
];

const styleOptions = [
  "Realistic (Realistis)", "Photorealistic (Fotorealistis)", "Cinematic (Sinematik)",
  "Anime (Anime)", "3D Animation (Animasi 3D)", "Cyberpunk (Cyberpunk)",
  "Vintage Film (Film Jadul)", "Black & White (Hitam Putih)", "Oil Painting (Lukisan Minyak)",
  "Documentary (Dokumenter)", "Fantasy (Fantasi)"
];

const moodOptions = [
  "Happy (Bahagia)", "Sad (Sedih)", "Mysterious (Misterius)", "Scary/Horror (Menakutkan)",
  "Intense/Action (Tegang/Aksi)", "Romantic (Romantis)", "Peaceful (Tenang)",
  "Dramatic (Dramatis)", "Dreamy (Mimpi)", "Melancholic (Melankolis)"
];

// Comprehensive Camera Options (Common + Higgsfield inspired)
const cameraOptions = [
  { value: "Static", label: "Static (Diam)" },
  { value: "Pan Left", label: "Pan Left (Geser Kiri)" },
  { value: "Pan Right", label: "Pan Right (Geser Kanan)" },
  { value: "Tilt Up", label: "Tilt Up (Dongak Atas)" },
  { value: "Tilt Down", label: "Tilt Down (Tunduk Bawah)" },
  { value: "Zoom In", label: "Zoom In (Perbesar)" },
  { value: "Zoom Out", label: "Zoom Out (Perkecil)" },
  { value: "Dolly In", label: "Dolly In (Maju Mendekat)" },
  { value: "Dolly Out", label: "Dolly Out (Mundur Menjauh)" },
  { value: "Truck Left", label: "Truck Left (Bergerak Kiri)" },
  { value: "Truck Right", label: "Truck Right (Bergerak Kanan)" },
  { value: "Pedestal Up", label: "Pedestal Up (Naik)" },
  { value: "Pedestal Down", label: "Pedestal Down (Turun)" },
  { value: "3D Rotation", label: "3D Rotation (Rotasi 3D)" },
  { value: "Orbit", label: "Orbit (Mengitari)" },
  { value: "Arc Shot", label: "Arc Shot (Lengkungan)" },
  { value: "Crane Shot", label: "Crane Shot (Kamera Melayang)" },
  { value: "Handheld", label: "Handheld (Genggam/Guncang)" },
  { value: "Shake", label: "Shake (Guncangan)" },
  { value: "Tracking Shot", label: "Tracking Shot (Mengikuti Objek)" },
  { value: "FPV Drone", label: "FPV Drone (Drone FPV)" },
  { value: "Hyperlapse", label: "Hyperlapse (Hyperlapse)" },
  { value: "Slow Motion", label: "Slow Motion (Gerak Lambat)" },
  { value: "Push In", label: "Push In (Dorong Masuk)" },
  { value: "Pull Out", label: "Pull Out (Tarik Keluar)" },
  { value: "Roll Clockwise", label: "Roll Clockwise (Putar Searah Jarum Jam)" },
  { value: "Roll Counter-Clockwise", label: "Roll Counter-Clockwise (Putar Berlawanan)" },
  { value: "Bullet Time", label: "Bullet Time (Waktu Peluru/Beku)" }
];

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onOptimize, isOptimizing }) => {
  const handleChange = (field: keyof PromptInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="bg-purple-600 w-1 h-6 rounded-full"></span>
        1. Input Detail Video
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        
        {/* 1. Subjek */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Subjek (Subject)</label>
          <input
            type="text"
            value={inputs.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="e.g., Seorang astronot wanita"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 2. Aksi */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Aksi (Action)</label>
          <input
            type="text"
            value={inputs.action}
            onChange={(e) => handleChange('action', e.target.value)}
            placeholder="e.g., Berlari menembus badai pasir sambil membawa bendera"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 3. Ekspresi */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">3. Ekspresi (Expression)</label>
          <input
            type="text"
            value={inputs.expression}
            onChange={(e) => handleChange('expression', e.target.value)}
            placeholder="e.g., Tekad yang kuat, mata berkaca-kaca"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 4. Tempat */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">4. Tempat (Place)</label>
          <input
            type="text"
            value={inputs.place}
            onChange={(e) => handleChange('place', e.target.value)}
            placeholder="e.g., Planet Mars yang tandus"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 5. Waktu */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">5. Waktu (Time)</label>
          <select
            value={inputs.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="">-- Pilih Waktu --</option>
            {timeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* 6. Gerakan Kamera */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">6. Gerakan Kamera</label>
          <select
            value={inputs.camera}
            onChange={(e) => handleChange('camera', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="">-- Pilih Gerakan Kamera --</option>
            {cameraOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 7. Pencahayaan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">7. Pencahayaan</label>
          <select
            value={inputs.lighting}
            onChange={(e) => handleChange('lighting', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
          >
             <option value="">-- Pilih Pencahayaan --</option>
             {lightingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* 8. Gaya Video */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">8. Gaya Video</label>
          <select
            value={inputs.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="">-- Pilih Gaya --</option>
            {styleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* 9. Suasana Video */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">9. Suasana (Mood)</label>
          <select
            value={inputs.mood}
            onChange={(e) => handleChange('mood', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="">-- Pilih Suasana --</option>
            {moodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* 10. Suara atau Musik */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">10. Suara / Musik</label>
          <input
            type="text"
            value={inputs.sound}
            onChange={(e) => handleChange('sound', e.target.value)}
            placeholder="e.g., Suara angin kencang, musik orkestra epik"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 11. Kalimat yang diucapkan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">11. Kalimat (Spoken)</label>
          <input
            type="text"
            value={inputs.spokenWords}
            onChange={(e) => handleChange('spokenWords', e.target.value)}
            placeholder="e.g., Saya akan bertahan hidup!"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 12. Detail Tambahan */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">12. Detail Tambahan</label>
          <textarea
            value={inputs.details}
            onChange={(e) => handleChange('details', e.target.value)}
            placeholder="e.g., Debu beterbangan, kualitas 8k, detail tinggi pada tekstur baju luar angkasa"
            rows={2}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={onOptimize}
          disabled={isOptimizing || !inputs.subject}
          className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl
            ${isOptimizing || !inputs.subject 
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20'}`}
        >
          {isOptimizing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Membuat Prompt...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Veo 3 Prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;