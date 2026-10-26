import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  Copy,
  Check,
  Share2,
  Sparkles,
  Music,
  BookOpen,
  Mic,
  MessageSquare,
} from 'lucide-react';
import { STUDIO_PRESETS } from '../../data/studioPresets';
import { AppSettings } from '../../types';
import { geminiService } from '../../services/geminiService';
import { speechService } from '../../services/speechService';

interface ScriptWriterProps {
  settings: AppSettings;
}

export const ScriptWriter: React.FC<ScriptWriterProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'গান' | 'কবিতা' | 'মিনা_কার্টুন' | 'মুভি'>('গান');
  const [customPrompt, setCustomPrompt] = useState('');
  const [outputScript, setOutputScript] = useState(
    STUDIO_PRESETS.find((p) => p.id === 'গান')?.generatedSample || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'গান', label: 'বাংলা গান ও লিরিক্স', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'কবিতা', label: 'কাব্যমঞ্চে কবিতা', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'মিনা_কার্টুন', label: 'মিনা ও মিঠু স্ক্রিপ্ট', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'মুভি', label: 'নাটক ও সিনেমা দৃশ্য', icon: <FileText className="w-3.5 h-3.5" /> },
  ] as const;

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const preset = STUDIO_PRESETS.find((p) => p.id === tab);
    if (preset) {
      setOutputScript(preset.generatedSample);
    }
  };

  const handleGenerateScript = async () => {
    setIsLoading(true);
    try {
      const promptToUse =
        customPrompt.trim() ||
        STUDIO_PRESETS.find((p) => p.id === activeTab)?.promptExample ||
        'বাংলা লিরিক্স বা স্ক্রিপ্ট';
      const text = await geminiService.generateCreativeText(promptToUse, activeTab, settings);
      setOutputScript(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    speechService.speak(outputScript);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ডা. মুন্না স্টুডিও সাহিত্য ও স্ক্রিপ্ট',
        text: outputScript,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const isSelected = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-[#61e7f5] text-black border-transparent shadow-lg'
                  : 'bg-[#151d33] border-[#243257] text-gray-300 hover:border-gray-500'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="font-semibold">বিষয় বা নিজস্ব ভাবনা (ঐচ্ছিক):</span>
          <span className="text-[11px] text-gray-500">বাংলা বা ইংরেজি</span>
        </div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={2}
          placeholder="যেমন: নদীর তীরে সূর্যাস্তের গান, বন্ধুত্ব নিয়ে কবিতা..."
          className="w-full bg-[#0b1020] border border-[#243257] rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
        />

        <button
          onClick={handleGenerateScript}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
            isLoading
              ? 'bg-[#243257] text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#61e7f5] to-blue-600 text-black hover:opacity-95 active:scale-98 shadow-cyan-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>{isLoading ? 'লিখছি...' : 'নতুন লেখা জেনারেট করুন'}</span>
        </button>
      </div>

      {/* Output Script Card */}
      {outputScript && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#151d33] to-[#0e1628] border border-[#243257] shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-[#61e7f5]" />
              <span>রচিত লিরিক্স ও স্ক্রিপ্ট</span>
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-lg bg-[#0b1020] border border-[#243257] text-[#61e7f5] hover:bg-[#1f2b4c] transition-all"
                title="আবৃত্তি শুনুন"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-[#0b1020] border border-[#243257] text-gray-300 hover:text-white hover:bg-[#1f2b4c] transition-all"
                title="কপি করুন"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg bg-[#0b1020] border border-[#243257] text-gray-300 hover:text-white hover:bg-[#1f2b4c] transition-all"
                title="শেয়ার করুন"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-200 whitespace-pre-line leading-relaxed font-serif p-2 select-text">
            {outputScript}
          </div>
        </div>
      )}
    </div>
  );
};
