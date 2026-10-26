import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

export const WaterTracker: React.FC = () => {
  const [glasses, setGlasses] = useState(0);
  const targetGlasses = 8; // 2 Liters

  useEffect(() => {
    const data = storageService.getWaterIntake();
    setGlasses(data.glasses);
  }, []);

  const updateGlasses = (newCount: number) => {
    const val = Math.max(0, newCount);
    setGlasses(val);
    storageService.saveWaterIntake(val);
    if (val === targetGlasses) {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const percent = Math.min(100, Math.round((glasses / targetGlasses) * 100));

  return (
    <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              দৈনিক পানি পান ট্র্যাকার (হাইড্রেশন)
            </h3>
            <p className="text-[11px] text-gray-400">
              দৈনিক লক্ষ্য: ৮ গ্লাস (২ লিটার)
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#61e7f5] bg-cyan-950/50 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          {percent}% সম্পন্ন
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0b1020] h-2.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-blue-500 to-[#61e7f5] h-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between bg-[#0b1020] p-3 rounded-2xl border border-white/5">
        <button
          onClick={() => updateGlasses(glasses - 1)}
          disabled={glasses <= 0}
          className="w-10 h-10 rounded-xl bg-[#151d33] border border-[#243257] flex items-center justify-center text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          title="১ গ্লাস কমান"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-2xl font-extrabold text-white">{glasses}</span>
          <span className="text-xs text-gray-400 ml-1">/ {targetGlasses} গ্লাস</span>
          <span className="text-[10px] text-cyan-300 block">
            ({glasses * 250} মিলিমিটার)
          </span>
        </div>

        <button
          onClick={() => updateGlasses(glasses + 1)}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#61e7f5] to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
          title="১ গ্লাস বাড়ান"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {glasses >= targetGlasses && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>অভিনন্দন! আজকের প্রয়োজনীয় হাইড্রেশন লক্ষ্য পূর্ণ হয়েছে।</span>
        </div>
      )}
    </div>
  );
};
