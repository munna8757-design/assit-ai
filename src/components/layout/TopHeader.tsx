import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { AppSettings } from '../../types';

interface TopHeaderProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onToggleVoice: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  settings,
  onOpenSettings,
  onToggleVoice,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return speechService.subscribeSpeakingState(setIsSpeaking);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0b1020]/95 backdrop-blur-md border-b border-[#243257] px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Status */}
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img
              src="/icon-192.png"
              alt="Dr. Munna Logo"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#61e7f5]/40 shadow-lg shadow-cyan-500/20"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#61e7f5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#61e7f5]"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Dr. Munna <span className="text-[#61e7f5]">Assist AI</span>
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#61e7f5] border border-cyan-500/30 px-1.5 py-0.5 rounded-full font-medium">
                বাংলা
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-gray-400">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-[#61e7f5] animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{isSpeaking ? 'কথা বলছেন...' : 'ভার্চুয়াল ডাক্তার প্রস্তুত'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Speaking Audio indicator / stop */}
          {isSpeaking && (
            <button
              onClick={() => speechService.stop()}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs animate-pulse hover:bg-rose-500/30 transition-all"
              title="কথা থামান"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>থামান</span>
            </button>
          )}

          {/* Voice Output Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-xl transition-all border ${
              settings.voiceEnabled
                ? 'bg-[#151d33] border-[#243257] text-[#61e7f5] hover:border-[#61e7f5]/40'
                : 'bg-[#151d33]/50 border-transparent text-gray-500 hover:text-gray-300'
            }`}
            title={settings.voiceEnabled ? 'ভয়েস অন' : 'ভয়েস অফ'}
            aria-label="Toggle voice output"
          >
            {settings.voiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#151d33] border border-[#243257] text-gray-300 hover:text-white hover:border-[#61e7f5]/40 transition-all"
            title="সেটিংস ও এপিআই কনফিগারেশন"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
