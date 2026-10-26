import React, { useState } from 'react';
import { Scale, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [heightCm, setHeightCm] = useState('165');
  const [weightKg, setWeightKg] = useState('65');
  const [result, setResult] = useState<{
    bmi: number;
    status: string;
    color: string;
    advice: string;
  } | null>(null);

  const calculateBmi = () => {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;

    const bmi = +(w / (h * h)).toFixed(1);
    let status = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      status = 'কম ওজন (Underweight)';
      color = 'text-amber-400';
      advice = 'পুষ্টিকর খাদ্য ও প্রোটিন গ্রহণ বৃদ্ধি করুন। প্রয়োজনে পুষ্টিবিদের পরামর্শ নিন।';
    } else if (bmi <= 24.9) {
      status = 'আদর্শ সুস্থ ওজন (Normal)';
      color = 'text-emerald-400';
      advice = 'চমৎকার! বর্তমান সুষম খাদ্যাভ্যাস এবং শরীরচর্চা অব্যাহত রাখুন।';
    } else if (bmi <= 29.9) {
      status = 'অতিরিক্ত ওজন (Overweight)';
      color = 'text-amber-400';
      advice = 'দৈনিক ৩০ মিনিট দ্রুত হাঁটা এবং মিষ্টি ও অতিরিক্ত শর্করাযুক্ত খাবার কমান।';
    } else {
      status = 'স্থূলতা (Obese)';
      color = 'text-rose-400';
      advice = 'ডায়াবেটিস ও উচ্চ রক্তচাপের ঝুঁকি রয়েছে। চিকিৎসকের পরামর্শ অনুযায়ী খাদ্য ও ব্যায়াম শুরু করুন।';
    }

    setResult({ bmi, status, color, advice });
  };

  return (
    <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-purple-500/20 text-[#b59bff]">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            বডি ম্যাস ইনডেক্স (BMI) ক্যালকুলেটর
          </h3>
          <p className="text-[11px] text-gray-400">
            উচ্চতা ও ওজনের স্বাস্থ্যকর অনুপাত নির্ধারণ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] text-gray-300">উচ্চতা (সেমি / cm):</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full bg-[#0b1020] border border-[#243257] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#61e7f5]/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-gray-300">ওজন (কেজি / kg):</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full bg-[#0b1020] border border-[#243257] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#61e7f5]/60"
          />
        </div>
      </div>

      <button
        onClick={calculateBmi}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xs hover:opacity-90 active:scale-98 transition-all shadow-md"
      >
        BMI হিসাব করুন
      </button>

      {result && (
        <div className="p-3 rounded-2xl bg-[#0b1020] border border-white/5 space-y-1.5 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">আপনার বিএমআই স্কোর:</span>
            <span className="text-base font-extrabold text-white">
              {result.bmi} <span className="text-xs font-normal">kg/m²</span>
            </span>
          </div>
          <div className="flex items-center space-x-1.5 font-bold">
            <Activity className={`w-4 h-4 ${result.color}`} />
            <span className={result.color}>{result.status}</span>
          </div>
          <p className="text-[11px] text-gray-300 border-t border-white/5 pt-1.5 leading-relaxed">
            {result.advice}
          </p>
        </div>
      )}
    </div>
  );
};
