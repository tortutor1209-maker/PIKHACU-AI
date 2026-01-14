
import React, { useState } from 'react';
import { VisualStyle, Language, StoryRequest } from '../types';
import { VISUAL_STYLES, LANGUAGES } from '../constants';

interface StoryFormProps {
  onSubmit: (data: StoryRequest) => void;
  isLoading: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<StoryRequest>({
    title: '',
    numScenes: 5,
    // Fix: VisualStyle.Pixar3D does not exist on the VisualStyle enum, corrected to VisualStyle.Animasi3D
    visualStyle: VisualStyle.Animasi3D,
    language: Language.Indonesian
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-effect p-6 rounded-2xl space-y-5 border border-white/5 shadow-2xl">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-yellow-400">Judul Storytelling</label>
        <input
          type="text"
          placeholder="Contoh: Keajaiban Lebah Madu"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-all text-white placeholder:text-white/20"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-yellow-400">Jumlah Scene</label>
          <input
            type="number"
            min="1"
            max="15"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-all text-white"
            value={formData.numScenes}
            onChange={(e) => setFormData({ ...formData, numScenes: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-yellow-400">Bahasa Narasi</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-all text-white appearance-none"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-neutral-900">{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-yellow-400">Gaya Visual</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VISUAL_STYLES.map(style => (
            <button
              key={style}
              type="button"
              onClick={() => setFormData({ ...formData, visualStyle: style })}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                formData.visualStyle === style 
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold' 
                : 'bg-black/20 border-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.title}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-black transition-all transform active:scale-95 ${
          isLoading ? 'bg-yellow-800 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner animate-spin"></i> GENERATING...
          </span>
        ) : (
          'START PROMPTING'
        )}
      </button>
    </form>
  );
};
