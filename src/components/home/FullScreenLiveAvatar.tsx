import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  BookOpen,
  Film,
  Droplets,
  Settings,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Scale,
} from 'lucide-react';
import { AVATAR_COSTUMES } from '../../data/avatars';
import { AvatarCostumeId, NavigationTab, AppSettings } from '../../types';
import { speechService } from '../../services/speechService';
import { DAILY_HEALTH_TIPS } from '../../data/dailyTips';

interface FullScreenLiveAvatarProps {
  activeCostumeId: AvatarCostumeId;
  settings: AppSettings;
  onCostumeChange: (costumeId: AvatarCostumeId) => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenSettings: () => void;
}

export const FullScreenLiveAvatar: React.FC<FullScreenLiveAvatarProps> = ({
  activeCostumeId,
  settings,
  onCostumeChange,
  onNavigate,
  onOpenSettings,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSubtitle, setSpeechSubtitle] = useState(
    'আসসালামু আলাইকুম! আমি ডা. মুন্না। স্ক্রিনে সোয়াইপ করে আমার পোশাক বদলাতে পারেন।'
  );
  const [showCostumeMenu, setShowCostumeMenu] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Swipe touch coordinates
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentCostumeIndex = AVATAR_COSTUMES.findIndex((c) => c.id === activeCostumeId);
  const currentCostume = AVATAR_COSTUMES[currentCostumeIndex >= 0 ? currentCostumeIndex : 0];

  useEffect(() => {
    const unsubSpeak = speechService.subscribeSpeakingState(setIsSpeaking);
    const unsubListen = speechService.subscribeListeningState(setIsListening);
    return () => {
      unsubSpeak();
      unsubListen();
    };
  }, []);

  // Swipe handlers for dress change
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Minimum swipe threshold
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe Left -> Next Dress
        const nextIdx = (currentCostumeIndex + 1) % AVATAR_COSTUMES.length;
        switchDress(AVATAR_COSTUMES[nextIdx].id);
      } else {
        // Swipe Right -> Previous Dress
        const prevIdx = (currentCostumeIndex - 1 + AVATAR_COSTUMES.length) % AVATAR_COSTUMES.length;
        switchDress(AVATAR_COSTUMES[prevIdx].id);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const switchDress = (costumeId: AvatarCostumeId) => {
    onCostumeChange(costumeId);
    const target = AVATAR_COSTUMES.find((c) => c.id === costumeId);
    if (target) {
      const msg = `আমি এখন ${target.labelBn} পরিধান করেছি। ${target.roleDescription}`;
      setSpeechSubtitle(msg);
      if (settings.voiceEnabled) {
        speechService.speak(msg, {
          pitch: 1.18,
          rate: 0.96,
        });
      }
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      const textToSpeak = speechSubtitle || `নমস্কার! আমি ডা. মুন্না। আপনার স্বাস্থ্য সুরক্ষায় আমি সার্বক্ষণিক প্রস্তুত।`;
      speechService.speak(textToSpeak, {
        pitch: 1.18,
        rate: 0.96,
      });
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopListening();
    } else {
      setSpeechSubtitle('ডা. মুন্না কান পেতে আপনার কথা শুনছেন... বলুন...');
      speechService.startListening(
        {
          onResult: (transcript) => {
            setSpeechSubtitle(`আপনি বলেছেন: "${transcript}"`);
            onNavigate('AI Chat');
          },
          onError: () => {
            setSpeechSubtitle('কথা বোঝা যায়নি, অনুগ্রহ করে আবার স্পষ্ট করে বলুন।');
          },
        },
        'bn-BD'
      );
    }
  };

  const handleNextHealthTip = () => {
    const next = (tipIndex + 1) % DAILY_HEALTH_TIPS.length;
    setTipIndex(next);
    const tip = DAILY_HEALTH_TIPS[next];
    setSpeechSubtitle(`স্বাস্থ্য টিপস: ${tip.textBn}`);
    if (settings.voiceEnabled) {
      speechService.speak(`আজকের স্বাস্থ্য টিপস: ${tip.textBn}`, {
        pitch: 1.18,
        rate: 0.96,
      });
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[calc(100vh-125px)] min-h-[580px] max-w-md mx-auto overflow-hidden rounded-3xl bg-[#070b16] select-none flex flex-col justify-between"
    >
      {/* Dynamic Background Glow Atmosphere */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isListening
            ? 'bg-radial from-amber-500/20 via-[#070b16] to-[#070b16]'
            : isSpeaking
            ? 'bg-radial from-cyan-500/25 via-[#070b16] to-[#070b16]'
            : 'bg-radial from-blue-900/20 via-[#070b16] to-[#070b16]'
        }`}
      />

      {/* TOP FLOATING STATUS BAR */}
      <div className="relative z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                isListening
                  ? 'bg-amber-400 animate-ping'
                  : isSpeaking
                  ? 'bg-[#61e7f5] animate-ping'
                  : 'bg-emerald-400'
              }`}
            />
          </div>
          <span className="text-xs font-bold text-white tracking-wide flex items-center space-x-1">
            <span>ডা. মুন্না লাইভ অ্যাভাটার</span>
            <span className="text-[10px] text-[#61e7f5] bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              {currentCostume.badge}
            </span>
          </span>
        </div>

        {/* Swipe Hint */}
        <div className="text-[11px] text-gray-400 flex items-center space-x-1 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
          <ChevronLeft className="w-3 h-3 text-[#61e7f5]" />
          <span>সোয়াইপ করে পোশাক বদলান</span>
          <ChevronRight className="w-3 h-3 text-[#61e7f5]" />
        </div>
      </div>

      {/* CENTER: LIVE FULLSCREEN FEMALE AVATAR */}
      <div className="relative flex-1 flex flex-col items-center justify-center z-10 px-4">
        {/* Animated aura rings around avatar */}
        <div
          className={`absolute w-72 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isListening
              ? 'bg-amber-400/35 scale-110'
              : isSpeaking
              ? 'bg-cyan-400/35 scale-110'
              : 'bg-blue-600/20 scale-95'
          }`}
        />

        {/* AVATAR CONTAINER WITH LIVE POSTURE ANIMATIONS */}
        <div
          className={`relative w-64 h-[380px] sm:w-72 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border-2 ${
            isListening
              ? 'border-amber-400 ring-4 ring-amber-400/30 rotate-2 translate-y-1' // কান পেতে শোনার ভঙ্গি (Tilted head listening)
              : isSpeaking
              ? 'border-[#61e7f5] ring-4 ring-[#61e7f5]/30 scale-102' // কথা বলার ভঙ্গি
              : 'border-white/15'
          }`}
        >
          {/* Real Avatar Portrait Photo */}
          <img
            src={currentCostume.image}
            alt={currentCostume.label}
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${
              isSpeaking ? 'animate-bounce-gentle' : ''
            }`}
          />

          {/* LISTENING OVERLAY ("কান পেতে শুনছে") */}
          {isListening && (
            <div className="absolute top-4 right-4 bg-amber-400/90 text-black px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center space-x-1 shadow-lg animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>👂 কান পেতে শুনছেন...</span>
            </div>
          )}

          {/* SPEAKING LIVE MOUTH & AUDIO WAVE OVERLAY ("মুখে কথা বলছে") */}
          {isSpeaking && (
            <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-4 bg-[#61e7f5] rounded-full animate-pulse" />
                <span className="w-1.5 h-7 bg-[#61e7f5] rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-9 bg-cyan-300 rounded-full animate-pulse delay-150" />
                <span className="w-1.5 h-6 bg-[#61e7f5] rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-3 bg-[#61e7f5] rounded-full animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-cyan-200">
                🎙️ নারী কণ্ঠে কথা বলছেন
              </span>
            </div>
          )}

          {/* Bottom Dress Tag */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-[10px] text-white font-medium flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#61e7f5]" />
            <span>{currentCostume.labelBn}</span>
          </div>
        </div>
      </div>

      {/* LEFT SIDE: LIQUID GLASS TRANSPARENT ROUND ICONS */}
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
        {/* AI Chat */}
        <button
          onClick={() => onNavigate('AI Chat')}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="AI স্বাস্থ্য চ্যাট"
        >
          <MessageSquare className="w-5 h-5 text-[#61e7f5] group-hover:scale-110 transition-transform" />
        </button>

        {/* Learn & Anatomy */}
        <button
          onClick={() => onNavigate('Learn')}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="অ্যানাটমি ও স্বাস্থ্য শিক্ষা"
        >
          <BookOpen className="w-5 h-5 text-[#b59bff] group-hover:scale-110 transition-transform" />
        </button>

        {/* Movie Maker Studio */}
        <button
          onClick={() => onNavigate('Studio')}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="AI মুভি স্টুডিও"
        >
          <Film className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Tools */}
        <button
          onClick={() => onNavigate('Tools')}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="টুলস ও ক্যালকুলেটর"
        >
          <Scale className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Dress Selector Drawer Toggle */}
        <button
          onClick={() => setShowCostumeMenu(!showCostumeMenu)}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="পোশাক তালিকা"
        >
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* RIGHT SIDE: LIQUID GLASS TRANSPARENT ROUND ICONS */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
        {/* Live Mic / Listening trigger ("কান পেতে শুনুন") */}
        <button
          onClick={handleToggleMic}
          className={`w-11 h-11 rounded-full backdrop-blur-xl border shadow-xl flex items-center justify-center transition-all ${
            isListening
              ? 'bg-amber-500 text-black border-amber-300 animate-pulse scale-110'
              : 'bg-white/10 hover:bg-white/20 active:scale-90 border-white/25 text-white'
          }`}
          title={isListening ? 'রেকর্ডিং বন্ধ করুন' : 'কথা বলুন (কান পেতে শুনবেন)'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-black" />
          ) : (
            <Mic className="w-5 h-5 text-cyan-300" />
          )}
        </button>

        {/* Live Female Voice Playback ("মুখে কথা বলুন") */}
        <button
          onClick={handleToggleSpeak}
          className={`w-11 h-11 rounded-full backdrop-blur-xl border shadow-xl flex items-center justify-center transition-all ${
            isSpeaking
              ? 'bg-rose-500/80 text-white border-rose-400 animate-pulse'
              : 'bg-white/10 hover:bg-white/20 active:scale-90 border-white/25 text-white'
          }`}
          title={isSpeaking ? 'কথা থামান' : 'নারী কণ্ঠে শুনুন'}
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#61e7f5]" />
          )}
        </button>

        {/* Daily Health Tip */}
        <button
          onClick={handleNextHealthTip}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="পরের স্বাস্থ্য টিপস"
        >
          <Lightbulb className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
        </button>

        {/* Switch Dress Next */}
        <button
          onClick={() => {
            const nextIdx = (currentCostumeIndex + 1) % AVATAR_COSTUMES.length;
            switchDress(AVATAR_COSTUMES[nextIdx].id);
          }}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="পরের পোশাক"
        >
          <RefreshCw className="w-4 h-4 text-cyan-200 group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all group"
          title="সেটিংস"
        >
          <Settings className="w-5 h-5 text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* BOTTOM SPEECH SUBTITLE / INTERACTION CARD */}
      <div className="relative z-20 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-between space-x-2">
          <p className="text-xs text-white leading-relaxed line-clamp-2 select-text font-medium flex-1">
            "{speechSubtitle}"
          </p>
          <button
            onClick={handleToggleSpeak}
            className="p-2 rounded-xl bg-[#61e7f5] text-black font-bold shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md"
            title="মুখে শুনুন"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POPUP DRESS SELECTOR OVERLAY */}
      {showCostumeMenu && (
        <div className="absolute inset-x-3 bottom-20 z-40 p-3 rounded-3xl bg-[#0b1020]/95 backdrop-blur-2xl border border-white/20 shadow-2xl animate-fade-in space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-300 font-bold px-1">
            <span>পোশাক নির্বাচন করুন:</span>
            <button
              onClick={() => setShowCostumeMenu(false)}
              className="text-gray-400 hover:text-white"
            >
              বন্ধ করুন
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {AVATAR_COSTUMES.map((costume) => {
              const isSelected = costume.id === activeCostumeId;
              return (
                <button
                  key={costume.id}
                  onClick={() => {
                    switchDress(costume.id);
                    setShowCostumeMenu(false);
                  }}
                  className={`p-1.5 rounded-2xl border text-center transition-all flex flex-col items-center ${
                    isSelected
                      ? 'bg-[#1e293b] border-[#61e7f5] ring-2 ring-[#61e7f5]/40 shadow-lg'
                      : 'bg-[#0f172a] border-white/10 hover:border-gray-500'
                  }`}
                >
                  <img
                    src={costume.image}
                    alt={costume.label}
                    className="w-10 h-10 object-cover object-top rounded-xl mb-1"
                  />
                  <span className="text-[10px] text-gray-200 truncate w-full font-medium">
                    {costume.labelBn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
