import React, { useState, useEffect } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface FloatingVoiceButtonProps {
  onOpenVoiceChat: () => void;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({ onOpenVoiceChat }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return speechService.subscribeSpeakingState(setIsSpeaking);
  }, []);

  return (
    <button
      onClick={onOpenVoiceChat}
      title="Dr. Munna Voice Assistant খুলুন"
      className="fixed bottom-20 right-4 z-30 p-3.5 rounded-full bg-gradient-to-tr from-[#61e7f5] via-blue-600 to-purple-600 text-black shadow-2xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all duration-200 group flex items-center justify-center border border-white/20"
      aria-label="Open voice assistant"
    >
      {isSpeaking ? (
        <Volume2 className="w-5 h-5 animate-pulse text-black" />
      ) : (
        <Mic className="w-5 h-5 text-black" />
      )}
      <span className="sr-only">ভয়েস সহকারী</span>
    </button>
  );
};
