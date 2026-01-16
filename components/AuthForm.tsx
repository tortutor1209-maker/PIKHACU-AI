
import React, { useState } from 'react';

interface AuthFormProps {
  onLoginSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return showAlert('Harap isi semua bidang');

    const users = JSON.parse(localStorage.getItem('anoalabs_users') || '[]');
    if (users.find((u: any) => u.username === username)) {
      return showAlert('Username sudah terdaftar');
    }

    users.push({ username, password });
    localStorage.setItem('anoalabs_users', JSON.stringify(users));
    showAlert('Akun berhasil dibuat! Silahkan login.', 'success');
    setMode('login');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('anoalabs_users') || '[]');
    const user = users.find((u: any) => u.username === username);

    if (!user) {
      return showAlert('silahkan buat akun terlebih dahulu');
    }

    if (user.password !== password) {
      return showAlert('sandi anda salah mohon periksa ulang sandi anda');
    }

    localStorage.setItem('anoalabs_current_user', JSON.stringify(user));
    onLoginSuccess();
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Dynamic Top Alert */}
      {alert && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl border shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
          alert.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'
        }`}>
          <div className="flex items-center gap-3 font-bold text-sm tracking-wide">
            <i className={`fa-solid ${alert.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            {alert.message}
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bebas tracking-widest text-white">
          {mode === 'login' ? 'LOGIN SYSTEM' : 'CREATE ACCOUNT'}
        </h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
          Access AnoaLabs Ultimate Tools
        </p>
      </div>

      <div className="glass-effect p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70 ml-1">Username</label>
            <div className="relative group">
              <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-500 transition-colors"></i>
              <input
                type="text"
                placeholder="Masukkan username"
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-yellow-500/50 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70 ml-1">Password</label>
            <div className="relative group">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-500 transition-colors"></i>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-yellow-500/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_20px_rgba(234,179,8,0.15)] transform active:scale-95"
          >
            {mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">
            {mode === 'login' ? 'Belum punya akses?' : 'Sudah punya akun?'}
          </p>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-yellow-500 hover:text-yellow-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-yellow-500/30 pb-1"
          >
            {mode === 'login' ? 'Buat Akun Baru' : 'Login ke Akun'}
          </button>
        </div>
      </div>
    </div>
  );
};
