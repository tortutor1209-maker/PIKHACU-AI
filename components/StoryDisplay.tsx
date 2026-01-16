
import React, { useState, useRef } from 'react';
import { StoryResult, StructuredPrompt } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface StoryDisplayProps {
  data: StoryResult;
}

const AnoaLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 40C10 20 30 10 50 10C70 10 90 20 90 40C90 60 70 90 50 90C30 90 10 60 10 40Z" stroke="currentColor" strokeWidth="10" />
    <path d="M25 15C15 10 5 30 15 50M75 15C85 10 95 30 85 50" stroke="currentColor" strokeWidth="12" />
    <path d="M35 30C35 30 30 50 50 75C70 50 65 30 65 30" stroke="#1E4D7B" strokeWidth="14" />
  </svg>
);

// Audio helper functions
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert PCM to WAV for downloading
function pcmToWav(pcmData: Uint8Array, sampleRate: number) {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcmData.length, true);
  const pcmArray = new Uint8Array(pcmData.buffer);
  for (let i = 0; i < pcmArray.length; i++) {
    view.setUint8(44 + i, pcmArray[i]);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [sceneVoices, setSceneVoices] = useState<Record<number, string>>(
    data.scenes.reduce((acc, s) => ({ ...acc, [s.number]: 'Kore' }), {})
  );
  const [playingScene, setPlayingScene] = useState<number | null>(null);
  const [sceneAudioUrls, setSceneAudioUrls] = useState<Record<number, string>>({});

  const getConsolidatedPrompt = (p: StructuredPrompt) => {
    return `${p.subject}, ${p.action}, in ${p.environment}. Camera: ${p.camera_movement}. Lighting: ${p.lighting}. Style: ${p.visual_style_tags}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePlayVoice = async (text: string, sceneNum: number) => {
    if (playingScene !== null) return;
    
    if (sceneAudioUrls[sceneNum]) {
      playStoredAudio(sceneAudioUrls[sceneNum], sceneNum);
      return;
    }

    setPlayingScene(sceneNum);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: sceneVoices[sceneNum] },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBytes = decodeBase64(base64Audio);
        const wavBlob = pcmToWav(audioBytes, 24000);
        const url = URL.createObjectURL(wavBlob);
        
        setSceneAudioUrls(prev => ({ ...prev, [sceneNum]: url }));
        playStoredAudio(url, sceneNum);
      } else {
        setPlayingScene(null);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setPlayingScene(null);
    }
  };

  const playStoredAudio = async (url: string, sceneNum: number) => {
    setPlayingScene(sceneNum);
    const audio = new Audio(url);
    audio.onended = () => setPlayingScene(null);
    audio.play();
  };

  const handleRefresh = (sceneNum: number) => {
    if (sceneAudioUrls[sceneNum]) {
      URL.revokeObjectURL(sceneAudioUrls[sceneNum]);
      const nextUrls = { ...sceneAudioUrls };
      delete nextUrls[sceneNum];
      setSceneAudioUrls(nextUrls);
    }
  };

  const copyAll = () => {
    const text = `
Judul Storytelling : ${data.title}
Jumlah Scene : ${data.numScenes}
Gaya Visual : ${data.visualStyle}
Bahasa Narasi : ${data.language}

${data.scenes.map(s => `
Scene ${s.number}
🎙️ Narasi: ${s.narration}
🎧 Tone: ${s.tone}
`).join('\n')}

🎬 BONUS OTOMATIS
📱 TikTok Cover (9:16): ${data.tiktokCover}
🖥️ YouTube Cover (16:9): ${data.youtubeCover}
🔥 Hashtags: ${data.hashtags.join(' ')}
    `;
    copyToClipboard(text, 'all');
  };

  const PromptGrid = ({ prompt, label, sceneNum, variant }: { prompt: StructuredPrompt, label: string, sceneNum: number, variant: string }) => (
    <div className="space-y-4 p-5 rounded-2xl bg-white/60 border border-black/5 hover:border-black/20 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">{label}</span>
        <button 
          onClick={() => copyToClipboard(getConsolidatedPrompt(prompt), `text-${sceneNum}-${variant}`)}
          className="text-[9px] font-black px-3 py-1.5 bg-black border border-black/10 rounded-lg transition-all text-white flex items-center gap-1 hover:bg-neutral-800"
        >
          {copied === `text-${sceneNum}-${variant}` ? 'COPIED' : <><i className="fa-solid fa-copy text-[8px]"></i> COPY STRING</>}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(prompt).map(([key, value]) => (
          <div key={key} className="bg-white p-2 rounded-lg border border-black/5">
            <div className="text-[8px] font-black text-black/30 uppercase tracking-tighter mb-0.5">{key.replace('_', ' ')}</div>
            <p className="text-[10px] text-black font-semibold leading-tight line-clamp-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-effect p-8 rounded-3xl colorful-border shadow-2xl bg-white/80">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex w-16 h-16 bg-black rounded-2xl items-center justify-center text-white shadow-lg">
             <AnoaLogo className="w-10 h-10" />
          </div>
          <div>
            <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mb-2 block">Project Summary</span>
            <h2 className="text-4xl font-bebas tracking-wide text-black">{data.title}</h2>
            <div className="flex gap-3 mt-2">
               <span className="px-2 py-0.5 bg-black text-white rounded text-[10px] font-black uppercase">{data.numScenes} Scenes</span>
               <span className="px-2 py-0.5 bg-black/5 border border-black/10 rounded text-[10px] font-black text-black/60 uppercase">{data.visualStyle}</span>
            </div>
          </div>
        </div>
        <button
          onClick={copyAll}
          className="w-full sm:w-auto px-8 py-4 bg-black border border-black/20 text-white rounded-2xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-2xl hover:bg-neutral-900"
        >
          {copied === 'all' ? (
            <><i className="fa-solid fa-check text-green-400"></i> COPIED FULL DATA</>
          ) : (
            <><i className="fa-solid fa-copy"></i> COPY FULL SEQUENCE</>
          )}
        </button>
      </div>

      {/* Scenes List */}
      <div className="space-y-10">
        {data.scenes.map((scene) => (
          <div key={scene.number} className="glass-effect overflow-hidden rounded-3xl colorful-border group transition-all shadow-xl bg-white/60">
            {/* Scene Header */}
            <div className="bg-neutral-50 px-8 py-4 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bebas text-2xl">
                   {scene.number}
                 </div>
                 <div>
                    <span className="font-bebas text-2xl tracking-wider text-black block leading-none uppercase">Sequence Part</span>
                    <span className="text-[10px] text-black/40 font-black uppercase tracking-widest italic">{scene.tone}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Narration Section with Voice Controls */}
              <div className="relative space-y-6">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-black/10 rounded-full"></div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-black">
                    <i className="fa-solid fa-microphone-lines text-sm opacity-50"></i>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em]">Voiceover Script</span>
                  </div>

                  {/* Character Voice Selector within Script Area - 2 Pria, 2 Wanita */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select 
                        value={sceneVoices[scene.number]}
                        onChange={(e) => {
                          handleRefresh(scene.number);
                          setSceneVoices(prev => ({ ...prev, [scene.number]: e.target.value }));
                        }}
                        className="bg-black text-white pl-4 pr-8 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest appearance-none focus:outline-none hover:bg-neutral-900 transition-all border border-white/10"
                      >
                        <optgroup label="Pria" className="bg-neutral-900 text-white">
                          <option value="Kore">Pria (Kore) - Formal</option>
                          <option value="Charon">Pria (Charon) - Berat</option>
                        </optgroup>
                        <optgroup label="Wanita" className="bg-neutral-900 text-white">
                          <option value="Puck">Wanita (Puck) - Ceria</option>
                          <option value="Zephyr">Wanita (Zephyr) - Lembut</option>
                        </optgroup>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[8px] pointer-events-none"></i>
                    </div>

                    {/* Action Buttons */}
                    <button 
                      onClick={() => handlePlayVoice(scene.narration, scene.number)}
                      disabled={playingScene !== null}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[9px] tracking-widest transition-all ${
                        playingScene === scene.number 
                        ? 'bg-neutral-100 text-black border-black animate-pulse' 
                        : 'bg-black text-white border-black hover:bg-neutral-800'
                      }`}
                      title="Putar Narasi"
                    >
                      {playingScene === scene.number ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-play"></i>} PUTAR
                    </button>

                    {sceneAudioUrls[scene.number] && (
                      <a 
                        href={sceneAudioUrls[scene.number]}
                        download={`${data.title.replace(/\s+/g, '_')}_Scene_${scene.number}.wav`}
                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-black/10 text-black hover:bg-black hover:text-white transition-all shadow-sm"
                        title="Unduh Audio"
                      >
                        <i className="fa-solid fa-download text-xs"></i>
                      </a>
                    )}

                    <button 
                      onClick={() => handleRefresh(scene.number)}
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-black/10 text-black/30 hover:text-red-500 hover:border-red-500 transition-all"
                      title="Hapus Audio & Refresh"
                    >
                      <i className="fa-solid fa-rotate-right text-xs"></i>
                    </button>
                  </div>
                </div>

                <p className="text-xl md:text-2xl leading-relaxed font-bold text-black italic bg-black/5 p-6 rounded-2xl border border-black/5">
                  "{scene.narration}"
                </p>
              </div>

              {/* Dual Prompt Engine Display */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <PromptGrid 
                    prompt={scene.structuredPrompt1} 
                    label="PROMPT VARIANT A (PRIMARY)" 
                    sceneNum={scene.number} 
                    variant="a" 
                  />
                  <PromptGrid 
                    prompt={scene.structuredPrompt2} 
                    label="PROMPT VARIANT B (SECONDARY)" 
                    sceneNum={scene.number} 
                    variant="b" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Assets */}
      <div className="space-y-6 pt-10 border-t border-black/10">
        <h3 className="font-bebas text-4xl text-black flex items-center gap-4 uppercase">
          <AnoaLogo className="w-8 h-8" /> PRODUCTION ASSETS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-8 rounded-3xl colorful-border bg-white/80">
             <div className="flex items-center justify-between mb-6">
               <span className="flex items-center gap-3 text-black font-black text-xs uppercase tracking-widest">
                 <i className="fa-brands fa-tiktok text-xl"></i> TikTok Cover (9:16)
               </span>
               <button onClick={() => copyToClipboard(data.tiktokCover, 'tk')} className="w-10 h-10 rounded-xl bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-center">
                 <i className={copied === 'tk' ? "fa-solid fa-check text-green-400" : "fa-solid fa-copy"}></i>
               </button>
             </div>
             <p className="text-sm text-black font-semibold bg-white p-5 rounded-2xl border border-black/5 leading-relaxed italic">{data.tiktokCover}</p>
          </div>

          <div className="glass-effect p-8 rounded-3xl colorful-border bg-white/80">
             <div className="flex items-center justify-between mb-6">
               <span className="flex items-center gap-3 text-black font-black text-xs uppercase tracking-widest">
                 <i className="fa-brands fa-youtube text-xl"></i> YouTube Thumb (16:9)
               </span>
               <button onClick={() => copyToClipboard(data.youtubeCover, 'yt')} className="w-10 h-10 rounded-xl bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-center">
                 <i className={copied === 'yt' ? "fa-solid fa-check text-green-400" : "fa-solid fa-copy"}></i>
               </button>
             </div>
             <p className="text-sm text-black font-semibold bg-white p-5 rounded-2xl border border-black/5 leading-relaxed italic">{data.youtubeCover}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="glass-effect p-8 rounded-3xl border border-black/10 bg-white/80">
           <span className="block text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mb-4">Engagement Strategy</span>
           <div className="flex flex-wrap gap-3">
             {data.hashtags.map(tag => (
               <span key={tag} className="px-4 py-2 bg-white border border-black/10 rounded-xl text-sm text-black font-black hover:bg-black hover:text-white transition-all cursor-default uppercase">
                 {tag}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
