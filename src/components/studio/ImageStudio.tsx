import React, { useState } from 'react';
import { Image, Sparkles, Download, Copy, Check, Eye } from 'lucide-react';
import { AppSettings } from '../../types';
import { geminiService } from '../../services/geminiService';

interface ImageStudioProps {
  settings: AppSettings;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ settings }) => {
  const [prompt, setPrompt] = useState('মানবদেহের প্রধান অঙ্গসংস্থান ও অ্যানাটমি চিত্র');
  const [currentImage, setCurrentImage] = useState('/assets/anatomy_organs_1792300685684.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const samplePrompts = [
    'মানবদেহের অঙ্গসংস্থান ও অ্যানাটমি চিত্র',
    'ডাক্তার ও রোগীর স্বাস্থ্য পরামর্শ অ্যানিমেশন',
    'মিনা ও রাজুর পরিষ্কার পরিচ্ছন্নতা কার্টুন চিত্র',
    'হৃৎপিণ্ড ও রক্ত সংবহনতন্ত্রের ত্রিমাত্রিক নকশা',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setStatusMessage('এআই মডেল ছবি বিশ্লেষণ ও রেন্ডার করছে...');
    try {
      const res = await geminiService.generateImage(prompt, settings);
      setCurrentImage(res.imageUrl);
      setStatusMessage(res.reply);
    } catch (e) {
      console.error(e);
      setStatusMessage('ছবি তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Box */}
      <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="font-semibold">চিত্র প্রম্পট বর্ণনা:</span>
          <span className="text-[11px] text-[#61e7f5]">AI Image Studio</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="কোন ধরণের চিত্র তৈরি করতে চান লিখুন..."
          className="w-full bg-[#0b1020] border border-[#243257] rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
        />

        {/* Quick sample prompt chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {samplePrompts.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="text-[10px] bg-[#0b1020] hover:bg-[#1a2542] text-gray-400 hover:text-white border border-[#243257] px-2.5 py-1 rounded-full shrink-0 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
            isLoading
              ? 'bg-[#243257] text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-95 active:scale-98 shadow-cyan-500/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>{isLoading ? 'ছবি প্রস্তুত হচ্ছে...' : 'AI চিত্র জেনারেট করুন'}</span>
        </button>
      </div>

      {/* Image Preview Card */}
      <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Image className="w-4 h-4 text-[#61e7f5]" />
            <span>প্রিভিউ ও গ্যালারি</span>
          </span>
          {statusMessage && (
            <span className="text-[10px] text-gray-400 truncate max-w-xs">
              {statusMessage}
            </span>
          )}
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-[#243257] flex items-center justify-center min-h-64 max-h-96">
          {isLoading ? (
            <div className="text-center p-6 space-y-2">
              <div className="w-10 h-10 border-3 border-[#61e7f5] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-400">{statusMessage}</p>
            </div>
          ) : (
            <img
              src={currentImage}
              alt="Generated Art"
              className="w-full h-full object-contain max-h-96"
            />
          )}
        </div>

        {/* Gallery of Preset Assets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-400">
            অ্যাপের ভেতরে থাকা অ্যানাটমি ও অ্যাভাটার গ্যালারি:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { img: '/assets/anatomy_organs_1792300685684.jpg', label: 'অ্যানাটমি' },
              { img: '/assets/avatar_doctor_1792299251841.jpg', label: 'ডাক্তার' },
              { img: '/assets/avatar_sari_1792299252956.jpg', label: 'শাড়ি' },
              { img: '/assets/avatar_casual_1792299253249.jpg', label: 'ক্যাজুয়াল' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(item.img)}
                className={`p-1 rounded-xl border text-center transition-all ${
                  currentImage === item.img
                    ? 'border-[#61e7f5] bg-[#1a2542]'
                    : 'border-[#243257] bg-[#0b1020] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-12 object-cover object-top rounded-lg mb-1"
                />
                <span className="text-[10px] text-gray-300 block truncate">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
