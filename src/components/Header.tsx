import React from 'react';
import { Wand2, CalendarDays, Settings2, Sparkles, Store, Clock } from 'lucide-react';
import { ShopProfile } from '../types';

interface HeaderProps {
  activeTab: 'parser' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'parser' | 'dashboard' | 'settings') => void;
  ordersCount: number;
  todayCount: number;
  profile: ShopProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  todayCount,
  profile,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e9dfd6] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Artisan Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('parser')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('parser')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#881337] flex items-center justify-center text-white shadow-xs group-hover:bg-[#70102d] transition-colors">
              <span className="font-serif text-lg font-bold tracking-wider">BF</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-[#881337] transition-colors">
                  BakeriFlow
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-50 text-[#881337] border border-rose-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[170px] sm:max-w-xs">
                {profile.shopName || 'Pengurusan Pesanan & Dapur'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f5efe8] p-1 rounded-xl border border-[#e4d8cb]">
            <button
              onClick={() => setActiveTab('parser')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'parser'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#e2d5c6]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-[#881337]" />
              <span>Ekstrak Tempahan</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#e2d5c6]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#881337]" />
              <span>Jadual Dapur</span>
              {todayCount > 0 ? (
                <span className="ml-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#881337] text-white">
                  {todayCount}
                </span>
              ) : (
                <span className="ml-0.5 text-[10px] font-mono text-slate-400">
                  {ordersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#e2d5c6]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Menu & Profil</span>
            </button>
          </nav>

          {/* Right Header Status / Quick Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('settings')}
              className="hidden sm:flex flex-col text-right px-2.5 py-1 rounded-lg hover:bg-[#f5efe8] transition-colors border border-transparent hover:border-[#e2d5c6]"
              title="Tetapan Akaun Bank & DuitNow"
            >
              <span className="text-[11px] font-bold text-slate-800 leading-tight">
                {profile.bankName || 'Tetapan Bank'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 leading-tight">
                {profile.bankAccount ? `•••• ${profile.bankAccount.slice(-4)}` : 'DuitNow'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2d5c6] px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-3 gap-1 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('parser')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
              activeTab === 'parser'
                ? 'text-[#881337] font-bold bg-rose-50/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">Ekstrak</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors relative ${
              activeTab === 'dashboard'
                ? 'text-[#881337] font-bold bg-rose-50/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <CalendarDays className="w-5 h-5 mb-0.5" />
              {todayCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#881337] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {todayCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Jadual</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'text-[#881337] font-bold bg-rose-50/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">Kedai</span>
          </button>
        </div>
      </nav>
    </>
  );
};
