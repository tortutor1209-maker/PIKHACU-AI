
import React, { useState } from 'react';
import { StoryResult, StructuredPrompt } from '../types';

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

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const getConsolidatedPrompt = (p: StructuredPrompt) => {
    return `${p.subject}, ${p.action}, in ${p.environment}. Camera: ${p.camera_movement}. Lighting: ${p.lighting}. Style: ${p.visual_style_tags}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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

🔥 PROMPT VARIANT A:
${getConsolidatedPrompt(s.structuredPrompt1)}

⚡ PROMPT VARIANT B:
${getConsolidatedPrompt(s.structuredPrompt2)}
`).join('\n')}

🎬 BONUS OTOMATIS
📱 TikTok Cover (9:16): ${data.tiktokCover}
🖥️ YouTube Cover (16:9): ${data.youtubeCover}
🔥 Hashtags: ${data.hashtags.join(' ')}
    `;
    copyToClipboard(text, 'all');
  };

  const PromptGrid = ({ prompt, label, colorClass, sceneNum, variant }: { prompt: StructuredPrompt, label: string, colorClass: string, sceneNum: number, variant: string }) => (
    <div className={`space-y-4 p-5 rounded-2xl bg-white/60 border border-black/5 hover:border-black/20 transition-all`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-black/60`}>{label}</span>
        <button 
          onClick={() => copyToClipboard(getConsolidatedPrompt(prompt), `text-${sceneNum}-${variant}`)}
          className={`text-[9px] font-black px-3 py-1.5 bg-black border border-black/10 rounded-lg transition-all text-white flex items-center gap-1 hover:bg-neutral-800`}
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
                    <span className="font-bebas text-2xl tracking-wider text-black block leading-none">SCENE SEQUENCE</span>
                    <span className="text-[10px] text-black/40 font-black uppercase tracking-widest">{scene.tone}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Narration */}
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-black/10 rounded-full"></div>
                <div className="flex items-center gap-2 text-black mb-3">
                  <i className="fa-solid fa-microphone-lines text-sm opacity-50"></i>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em]">Voiceover Script</span>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed font-bold text-black italic">
                  "{scene.narration}"
                </p>
              </div>

              {/* Dual Prompt Engine Display */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <PromptGrid 
                    prompt={scene.structuredPrompt1} 
                    label="PROMPT VARIANT A (PRIMARY)" 
                    colorClass="black" 
                    sceneNum={scene.number} 
                    variant="a" 
                  />
                  <PromptGrid 
                    prompt={scene.structuredPrompt2} 
                    label="PROMPT VARIANT B (SECONDARY)" 
                    colorClass="black" 
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
