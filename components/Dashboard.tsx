
import React from 'react';

interface DashboardProps {
  onSelectStory: () => void;
  onSelectAffiliate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectStory, onSelectAffiliate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-7xl font-bebas tracking-tighter text-white">
          MODUL <span className="text-yellow-400">COMMAND CENTER</span>
        </h2>
        <p className="text-white/40 font-bold text-xs uppercase tracking-[0.4em]">
          Silahkan pilih modul yang ingin anda gunakan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Story Button */}
        <button 
          onClick={onSelectStory}
          className="group relative overflow-hidden glass-effect p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-yellow-500/40 transition-all text-left flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-500 rounded-3xl flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-wand-magic-sparkles text-3xl md:text-4xl"></i>
            </div>
            <div>
              <h3 className="font-bebas text-3xl md:text-5xl text-white tracking-widest leading-none mb-2">TOOLS FAKTA MENARIK</h3>
              <p className="text-white/40 text-xs md:text-sm font-medium">Cinematic Educational Storytelling with AI Engine v4</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-white/10 group-hover:text-yellow-500 group-hover:translate-x-2 transition-all text-3xl hidden md:block"></i>
        </button>

        {/* Affiliate Button */}
        <button 
          onClick={onSelectAffiliate}
          className="group relative overflow-hidden glass-effect p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/40 transition-all text-left flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500 rounded-3xl flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cart-shopping text-3xl md:text-4xl"></i>
            </div>
            <div>
              <h3 className="font-bebas text-3xl md:text-5xl text-white tracking-widest leading-none mb-2">TOOLS AFILIATE PRODUK</h3>
              <p className="text-white/40 text-xs md:text-sm font-medium">Auto-Optimize Product Marketing Content</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-white/10 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all text-3xl hidden md:block"></i>
        </button>
      </div>

      <div className="flex justify-center pt-10">
         <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="flex -space-x-2">
               {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-yellow-500/20 border border-white/10"></div>)}
            </div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Join 2,400+ Active Creators</span>
         </div>
      </div>
    </div>
  );
};
