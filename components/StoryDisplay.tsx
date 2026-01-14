
import React, { useState } from 'react';
import { StoryResult } from '../types';

interface StoryDisplayProps {
  data: StoryResult;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = `
Judul Storytelling : ${data.title}
Jumlah Scene : ${data.numScenes}
Gaya Visual : ${data.visualStyle}
Bahasa Narasi : ${data.language}

${data.scenes.map(s => `
Scene ${s.number}

🎙️ Narasi:
"${s.narration}"

🎧 Tone:
${s.tone}

🎨 Prompt 1 — Establishing Shot (${data.visualStyle}):
${s.prompt1}

🎨 Prompt 2 — Detail / Action Shot (${data.visualStyle}):
${s.prompt2}
`).join('\n')}

🎬 BONUS OTOMATIS

📱 Text-to-Image Prompt — TikTok Cover
${data.tiktokCover}

🖥️ Text-to-Image Prompt — YouTube Cover
${data.youtubeCover}

🔥 5 Viral Hashtags
${data.hashtags.join(' ')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-effect p-6 rounded-2xl border-l-4 border-yellow-500">
        <div>
          <h2 className="text-3xl font-bebas tracking-wide text-yellow-400">{data.title}</h2>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
            {data.numScenes} Scenes • {data.visualStyle} • {data.language}
          </p>
        </div>
        <button
          onClick={copyAll}
          className="px-6 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 rounded-full font-bold text-sm transition-all flex items-center gap-2"
        >
          {copied ? (
            <><i className="fa-solid fa-check"></i> COPIED</>
          ) : (
            <><i className="fa-solid fa-copy"></i> COPY FULL PROMPT</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.scenes.map((scene) => (
          <div key={scene.number} className="glass-effect overflow-hidden rounded-2xl border border-white/5 group hover:border-yellow-500/20 transition-all">
            <div className="bg-yellow-500/10 px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="font-bebas text-2xl text-yellow-400">SCENE {scene.number}</span>
              <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Cinematic Sequence</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-yellow-400/80 mb-1">
                  <i className="fa-solid fa-microphone-lines text-xs"></i>
                  <span className="text-[10px] uppercase font-bold tracking-tighter">Narasi Edukatif</span>
                </div>
                <p className="text-lg leading-relaxed font-medium text-white/90 italic">
                  "{scene.narration}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-effect bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <i className="fa-solid fa-mountain text-xs"></i>
                    <span className="text-[10px] uppercase font-bold">Prompt 1 — Establishing</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{scene.prompt1}</p>
                </div>
                <div className="glass-effect bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-rose-400 mb-2">
                    <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    <span className="text-[10px] uppercase font-bold">Prompt 2 — Detail / Action</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{scene.prompt2}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <i className="fa-solid fa-headphones text-yellow-400/50"></i>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Tone:</span>
                <span className="text-xs text-white/70 italic font-medium">{scene.tone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Section */}
      <div className="space-y-4">
        <h3 className="font-bebas text-3xl text-yellow-400 flex items-center gap-3">
          <i className="fa-solid fa-gift"></i> BONUS CONTENT
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-effect p-6 rounded-2xl border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <span className="flex items-center gap-2 text-white/80 font-bold text-sm">
                 <i className="fa-brands fa-tiktok"></i> TikTok Cover
               </span>
               <button onClick={() => navigator.clipboard.writeText(data.tiktokCover)} className="text-white/30 hover:text-yellow-400 transition-colors">
                 <i className="fa-solid fa-copy"></i>
               </button>
             </div>
             <p className="text-sm text-white/60 bg-black/40 p-4 rounded-xl border border-white/5">{data.tiktokCover}</p>
          </div>

          <div className="glass-effect p-6 rounded-2xl border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <span className="flex items-center gap-2 text-white/80 font-bold text-sm">
                 <i className="fa-brands fa-youtube"></i> YouTube Thumbnail
               </span>
               <button onClick={() => navigator.clipboard.writeText(data.youtubeCover)} className="text-white/30 hover:text-yellow-400 transition-colors">
                 <i className="fa-solid fa-copy"></i>
               </button>
             </div>
             <p className="text-sm text-white/60 bg-black/40 p-4 rounded-xl border border-white/5">{data.youtubeCover}</p>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-2xl border border-white/5 flex flex-wrap gap-2">
           <span className="w-full text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i className="fa-solid fa-hashtag text-yellow-500"></i> Viral Hashtags
           </span>
           {data.hashtags.map(tag => (
             <span key={tag} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm text-yellow-400 font-medium">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
};
