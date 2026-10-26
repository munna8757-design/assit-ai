import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { DAILY_HEALTH_TIPS, DailyTip } from '../../data/dailyTips';
import { speechService } from '../../services/speechService';

export const DailyTipCard: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const currentTip: DailyTip = DAILY_HEALTH_TIPS[tipIndex];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_HEALTH_TIPS.length);
  };

  const handleSpeak = () => {
    speechService.speak(`আজকের স্বাস্থ্য টিপস: ${currentTip.textBn}`);
  };

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-950/40 via-[#151d33] to-cyan-950/40 border border-emerald-500/20 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1">
              <span>দৈনিক স্বাস্থ্য টিপস</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full lowercase">
                #{currentTip.category}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all"
            title="মুখে শুনুন"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextTip}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all active:rotate-180"
            title="পরের টিপস দেখুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-200 leading-relaxed pl-1">
        "{currentTip.textBn}"
      </p>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-2">
        <span className="italic truncate pr-2">"{currentTip.textEn}"</span>
        <button
          onClick={handleNextTip}
          className="text-emerald-400 hover:underline font-medium shrink-0 flex items-center space-x-1"
        >
          <span>{currentTip.actionText}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
