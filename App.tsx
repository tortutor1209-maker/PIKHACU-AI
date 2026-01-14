
import React, { useState } from 'react';
import { StoryForm } from './components/StoryForm';
import { StoryDisplay } from './components/StoryDisplay';
import { APP_CONFIG } from './constants';
import { StoryRequest, StoryResult } from './types';
import { generateStoryContent } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: StoryRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedData = await generateStoryContent(data);
      setResult(generatedData);
      // Scroll to result
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Gagal membuat cerita. Silakan coba lagi nanti atau periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-yellow-500 selection:text-black">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <i className="fa-solid fa-clapperboard text-xl"></i>
            </div>
            <div>
              <h1 className="font-bebas text-2xl tracking-widest neon-yellow leading-none">PIKHACU.AI</h1>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{APP_CONFIG.VERSION}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] border border-white/10 px-4 py-2 rounded-full">
              Automated Cinematic Storytelling System
            </span>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-4xl mx-auto px-6 pt-12 space-y-16">
        <section className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-bold text-yellow-400 uppercase tracking-[0.2em] mb-4">
            New Generation Engine
          </div>
          <h2 className="text-5xl md:text-7xl font-bebas tracking-tighter text-white">
            Ubah Ide Menjadi <span className="text-yellow-400">Narasi Sinematik</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Hasilkan rangkaian scene storytelling edukatif dengan format profesional. 
            Otomatisasi prompt untuk Midjourney, DALL-E, atau Stable Diffusion dengan gaya visual yang konsisten.
          </p>
        </section>

        {/* Form Section */}
        <section id="generator" className="max-w-2xl mx-auto">
          <StoryForm onSubmit={handleGenerate} isLoading={loading} />
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section className="pt-8">
            <StoryDisplay data={result} />
          </section>
        )}
      </main>

      {/* Floating Sparkle Elements for aesthetics */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-yellow-500/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-yellow-600/5 blur-[150px] rounded-full -z-10 animate-pulse delay-700"></div>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} PIKHACU.AI • Powered by Gemini Engine
        </p>
      </footer>
    </div>
  );
};

export default App;
