import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Check, Mic, User } from 'lucide-react';
import { AVATAR_COSTUMES } from '../../data/avatars';
import { AvatarCostumeId } from '../../types';
import { speechService } from '../../services/speechService';

interface AvatarViewerProps {
  activeCostumeId: AvatarCostumeId;
  onCostumeChange: (costumeId: AvatarCostumeId) => void;
  onNavigateToChat: () => void;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
  activeCostumeId,
  onCostumeChange,
  onNavigateToChat,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');

  const currentCostume =
    AVATAR_COSTUMES.find((c) => c.id === activeCostumeId) || AVATAR_COSTUMES[0];

  useEffect(() => {
    return speechService.subscribeSpeakingState(setIsSpeaking);
  }, []);

  const handleSpeakGreeting = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      speechService.speak(
        `নমস্কার ও আসসালামু আলাইকুম! আমি ডা. মুন্না অ্যাসিস্ট এআই। বর্তমানে আমি ${currentCostume.labelBn} পরিহিত অবস্থায় আছি। আপনার সুস্থতা ও স্বাস্থ্য সুরক্ষায় আমি কীভাবে সাহায্য করতে পারি?`
      );
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#151d33] via-[#0e162a] to-[#0b1020] border border-[#243257] shadow-2xl p-4 sm:p-5">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 -ml-16 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar inside Card */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#61e7f5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#61e7f5]"></span>
          </span>
          <span className="text-xs font-semibold text-gray-300">
            ভার্চুয়াল ডাক্তার অ্যাসিস্ট্যান্ট
          </span>
        </div>

        {/* 2D / 3D Mode Toggle */}
        <div className="flex items-center bg-[#0b1020]/80 p-0.5 rounded-xl border border-[#243257]">
          <button
            onClick={() => setViewMode('3D')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all ${
              viewMode === '3D'
                ? 'bg-[#61e7f5] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            3D মোড
          </button>
          <button
            onClick={() => setViewMode('2D')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all ${
              viewMode === '2D'
                ? 'bg-[#61e7f5] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            2D পোর্ট্রেট
          </button>
        </div>
      </div>

      {/* Main Avatar Showcase */}
      <div className="relative flex flex-col items-center justify-center my-1">
        {/* Glow halo behind portrait */}
        <div
          className={`absolute w-56 h-56 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isSpeaking ? 'bg-cyan-400/30 scale-110' : 'bg-blue-600/15 scale-95'
          }`}
        />

        {/* Avatar Frame */}
        <div className="relative group">
          <div
            className={`w-44 h-56 sm:w-52 sm:h-64 rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 relative ${
              isSpeaking
                ? 'border-[#61e7f5] ring-4 ring-[#61e7f5]/30'
                : 'border-[#243257] hover:border-cyan-500/50'
            }`}
          >
            <img
              src={currentCostume.image}
              alt={currentCostume.label}
              className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                viewMode === '3D' ? 'hover:scale-105' : ''
              }`}
            />

            {/* Speaking Audio Waveform Overlay */}
            {isSpeaking && (
              <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center space-x-1">
                <span className="w-1 h-3 bg-[#61e7f5] rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-[#61e7f5] rounded-full animate-pulse delay-75" />
                <span className="w-1 h-4 bg-[#61e7f5] rounded-full animate-pulse delay-150" />
                <span className="w-1 h-6 bg-[#61e7f5] rounded-full animate-pulse delay-100" />
                <span className="w-1 h-3 bg-[#61e7f5] rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* Badge over Avatar */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0b1020]/90 backdrop-blur-md border border-[#243257] text-[#61e7f5] px-3 py-0.5 rounded-full text-[11px] font-bold shadow-lg flex items-center space-x-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#61e7f5]" />
            <span>{currentCostume.badge}</span>
          </div>
        </div>

        {/* Costume & Role Title */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold text-white flex items-center justify-center space-x-1.5">
            <span>ডা. মুন্না এআই</span>
            <span className="text-xs font-normal text-gray-400">
              ({currentCostume.labelBn})
            </span>
          </h2>
          <p className="text-xs text-gray-300 max-w-xs mt-0.5 leading-relaxed">
            {currentCostume.roleDescription}
          </p>
        </div>

        {/* Action Buttons below Avatar */}
        <div className="flex items-center space-x-2.5 mt-3">
          <button
            onClick={handleSpeakGreeting}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
              isSpeaking
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                : 'bg-[#151d33] text-[#61e7f5] border border-[#243257] hover:border-cyan-400/50 hover:bg-[#1a2542]'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>কথা থামান</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#61e7f5]" />
                <span>মুখে শুনুন</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToChat}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#61e7f5] to-blue-600 text-black shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all"
          >
            <Mic className="w-4 h-4 text-black" />
            <span>পরামর্শ চান</span>
          </button>
        </div>
      </div>

      {/* Costume Selector Bar */}
      <div className="mt-4 pt-3 border-t border-[#243257]/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-300 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-[#61e7f5]" />
            <span>পোশাক ও অ্যাভাটার রূপ পরিবর্তন:</span>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {AVATAR_COSTUMES.map((costume) => {
            const isSelected = costume.id === activeCostumeId;
            return (
              <button
                key={costume.id}
                onClick={() => onCostumeChange(costume.id)}
                className={`flex flex-col items-center p-1 rounded-xl transition-all border relative ${
                  isSelected
                    ? 'bg-[#1a2542] border-[#61e7f5] ring-2 ring-[#61e7f5]/20 shadow-lg'
                    : 'bg-[#10172a] border-[#243257] opacity-75 hover:opacity-100 hover:border-gray-500'
                }`}
                title={costume.label}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 mb-1">
                  <img
                    src={costume.image}
                    alt={costume.label}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span
                  className={`text-[10px] leading-tight text-center truncate w-full ${
                    isSelected ? 'text-[#61e7f5] font-semibold' : 'text-gray-400'
                  }`}
                >
                  {costume.labelBn.split(' ')[0]}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-[#61e7f5] text-black rounded-full p-0.5 shadow">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
