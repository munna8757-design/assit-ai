import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const PROMPT_SUGGESTIONS = [
  'মাথাব্যথা ও জ্বরের সাধারণ যত্ন কীভাবে করবো?',
  'সুস্থ থাকতে দৈনিক কতটুকু পানি খাওয়া উচিত?',
  'উচ্চ রক্তচাপ নিয়ন্ত্রণে কী কী নিয়ম মানবো?',
  'বুকের ব্যথায় তাৎক্ষণিক জরুরি করণীয় কী?',
  'ওজন কমানোর জন্য সহজ খাদ্যতালিকা দিন।',
  'অনিদ্রা দূর করে ভালো ঘুমের উপায় কী?',
];

export const PromptChips: React.FC<PromptChipsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-2 px-1">
        <span className="text-[11px] text-gray-400 flex items-center space-x-1 shrink-0">
          <Sparkles className="w-3 h-3 text-[#61e7f5]" />
          <span>পরামর্শ:</span>
        </span>
        {PROMPT_SUGGESTIONS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="text-[11px] bg-[#151d33] hover:bg-[#1f2b4c] text-gray-300 hover:text-white border border-[#243257] hover:border-[#61e7f5]/40 px-3 py-1.5 rounded-full shrink-0 transition-all text-left"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
