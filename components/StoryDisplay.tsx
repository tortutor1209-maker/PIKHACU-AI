
import React, { useState } from 'react';
import { StoryResult, StructuredPrompt } from '../types';

interface StoryDisplayProps {
  data: StoryResult;
}

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

🎙️ Narasi:
${s.narration}

🎧 Tone:
${s.tone}

🛠️ Structured JSON Prompt:
${JSON.stringify(s.structuredPrompt, null, 2)}

🎨 Final Consolidated Prompt:
${getConsolidatedPrompt(s.structuredPrompt)}
`).join('\n')}

🎬 BONUS OTOMATIS

📱 TikTok Cover (9:16): ${data.tiktokCover}
🖥️ YouTube Cover (16:9): ${data.youtubeCover}

🔥 Hashtags: ${data.hashtags.join(' ')}
    `;
    copyToClipboard(text, 'all');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-effect p-8 rounded-3xl border-l-8 border-yellow-500 shadow-2xl">
        <div>
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-2 block">Project Summary</span>
          <h2 className="text-4xl font-bebas tracking-wide text-white">{data.title}</h2>
          <div className="flex gap-3 mt-2">
             <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/40 uppercase">{data.numScenes} Scenes</span>
             <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/40 uppercase">{data.visualStyle}</span>
          </div>
        </div>
        <button
          onClick={copyAll}
          className="w-full sm:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
        >
          {copied === 'all' ? (
            <><i className="fa-solid fa-check"></i> COPIED FULL DATA</>
          ) : (
            <><i className="fa-solid fa-copy"></i> COPY FULL SEQUENCE</>
          )}
        </button>
      </div>

      {/* Scenes List */}
      <div className="space-y-10">
        {data.scenes.map((scene) => (
          <div key={scene.number} className="glass-effect overflow-hidden rounded-3xl border border-white/5 group hover:border-yellow-500/30 transition-all shadow-xl">
            {/* Scene Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-8 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bebas text-2xl">
                   {scene.number}
                 </div>
                 <div>
                    <span className="font-bebas text-2xl tracking-wider text-white block leading-none">SCENE SEQUENCE</span>
                    <span className="text-[10px] text-yellow-500/50 font-bold uppercase tracking-widest">{scene.tone}</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-yellow-500/60 tracking-widest">Video Engine Ready</span>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Narration */}
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-yellow-500/20 rounded-full"></div>
                <div className="flex items-center gap-2 text-yellow-500 mb-3">
                  <i className="fa-solid fa-microphone-lines text-sm opacity-50"></i>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em]">Voiceover Script</span>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed font-medium text-white/90 italic">
                  "{scene.narration}"
                </p>
              </div>

              {/* Structured Prompt Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Structured Prompt Engine</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(scene.structuredPrompt, null, 2), `json-${scene.number}`)}
                      className="text-[10px] font-bold px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all text-white/60 flex items-center gap-2"
                    >
                      {copied === `json-${scene.number}` ? 'COPIED' : <><i className="fa-solid fa-code"></i> COPY JSON</>}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(getConsolidatedPrompt(scene.structuredPrompt), `text-${scene.number}`)}
                      className="text-[10px] font-bold px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-md transition-all text-yellow-500 flex items-center gap-2"
                    >
                      {copied === `text-${scene.number}` ? 'COPIED' : <><i className="fa-solid fa-wand-magic-sparkles"></i> COPY FULL STRING</>}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(scene.structuredPrompt).map(([key, value]) => (
                    <div key={key} className="bg-black/40 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all group/item">
                      <div className="text-[9px] font-black text-yellow-500/50 uppercase tracking-widest mb-1 group-hover/item:text-yellow-500 transition-colors">
                        {key.replace('_', ' ')}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Assets */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <h3 className="font-bebas text-4xl text-yellow-500 flex items-center gap-4">
          <i className="fa-solid fa-clapperboard"></i> PRODUCTION ASSETS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-8 rounded-3xl border border-white/10 hover:border-yellow-500/20 transition-all">
             <div className="flex items-center justify-between mb-6">
               <span className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <i className="fa-brands fa-tiktok text-xl text-yellow-500"></i> TikTok Cover (9:16)
               </span>
               <button onClick={() => copyToClipboard(data.tiktokCover, 'tk')} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center">
                 <i className={copied === 'tk' ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
               </button>
             </div>
             <p className="text-sm text-white/50 bg-black/60 p-5 rounded-2xl border border-white/5 leading-relaxed italic">{data.tiktokCover}</p>
          </div>

          <div className="glass-effect p-8 rounded-3xl border border-white/10 hover:border-yellow-500/20 transition-all">
             <div className="flex items-center justify-between mb-6">
               <span className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <i className="fa-brands fa-youtube text-xl text-yellow-500"></i> YouTube Thumb (16:9)
               </span>
               <button onClick={() => copyToClipboard(data.youtubeCover, 'yt')} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center">
                 <i className={copied === 'yt' ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
               </button>
             </div>
             <p className="text-sm text-white/50 bg-black/60 p-5 rounded-2xl border border-white/5 leading-relaxed italic">{data.youtubeCover}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="glass-effect p-8 rounded-3xl border border-white/10">
           <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Engagement Strategy</span>
           <div className="flex flex-wrap gap-3">
             {data.hashtags.map(tag => (
               <span key={tag} className="px-4 py-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-sm text-yellow-500 font-bold hover:bg-yellow-500 hover:text-black transition-all cursor-default">
                 {tag}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
