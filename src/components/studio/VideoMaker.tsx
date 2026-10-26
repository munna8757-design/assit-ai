import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  Share2,
  Copy,
  Clock,
  Download,
  Monitor,
  Smartphone,
  Save,
} from 'lucide-react';
import { STUDIO_PRESETS } from '../../data/studioPresets';
import { StudioPreset, AppSettings } from '../../types';
import { generateRealMovie, GeneratedMovieResult } from '../../services/movieEngine';
import confetti from 'canvas-confetti';

interface VideoMakerProps {
  settings: AppSettings;
}

export const VideoMaker: React.FC<VideoMakerProps> = ({ settings }) => {
  const [selectedPreset, setSelectedPreset] = useState<StudioPreset>(STUDIO_PRESETS[0]);
  const [prompt, setPrompt] = useState(STUDIO_PRESETS[0].promptExample);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [movieResult, setMovieResult] = useState<GeneratedMovieResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset: StudioPreset) => {
    setSelectedPreset(preset);
    setPrompt(preset.promptExample);
    setMovieResult(null);
  };

  const handleGenerateVideo = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setProgress(5);
    setStatusText('মুভি ফ্রেম প্রসেসিং শুরু হচ্ছে...');
    setMovieResult(null);

    try {
      const result = await generateRealMovie(
        selectedPreset.id,
        aspectRatio,
        (percent, text) => {
          setProgress(percent);
          setStatusText(text);
        }
      );

      setMovieResult(result);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Movie generation failed:', err);
      setStatusText('মুভি রেন্ডারিংয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!movieResult) return;
    const a = document.createElement('a');
    a.href = movieResult.videoUrl;
    a.download = movieResult.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* Preset Selector */}
      <div>
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
          মুভি ও ভিডিও থিম নির্বাচন করুন:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STUDIO_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e293b] border-[#61e7f5] ring-2 ring-[#61e7f5]/20 shadow-lg'
                    : 'bg-[#151d33] border-[#243257] hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    {preset.label.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#61e7f5]" />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 line-clamp-1">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Generation Controls Card */}
      <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
        {/* Aspect Ratio Picker */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300">ভিডিও ফ্রেম সাইজ:</span>
          <div className="flex items-center bg-[#0b1020] p-1 rounded-xl border border-[#243257]">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-[#61e7f5] text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>১৬:৯ (ওয়াইড)</span>
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-[#61e7f5] text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>৯:১৬ (রিল/শর্টস)</span>
            </button>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>ভিডিও প্রম্পট ও দৃশ্যপট:</span>
            <button
              onClick={() => setPrompt(selectedPreset.promptExample)}
              className="text-[#61e7f5] hover:underline text-[11px]"
            >
              ডিফল্ট প্রম্পট দিন
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="ভিডিও বা অ্যানিমেশনের দৃশ্যপট বিস্তারিত লিখুন..."
            className="w-full bg-[#0b1020] border border-[#243257] rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
          />
        </div>

        {/* Real Movie Generation Button */}
        <button
          onClick={handleGenerateVideo}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xl transition-all ${
            isGenerating
              ? 'bg-[#243257] text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 via-purple-600 to-[#61e7f5] text-white hover:opacity-95 active:scale-98 shadow-purple-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-pink-300" />
              <span>{statusText || `মুভি রেন্ডার হচ্ছে (${progress}%)...`}</span>
            </>
          ) : (
            <>
              <Film className="w-4 h-4 text-white" />
              <span>মুভি তৈরি করুন ও প্লেয়ারে চালান</span>
            </>
          )}
        </button>
      </div>

      {/* REAL VIDEO PLAYER & SAVE CONTROLS */}
      {movieResult && (
        <div className="rounded-3xl bg-[#0b1020] border-2 border-[#61e7f5]/40 overflow-hidden shadow-2xl animate-fade-in p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Film className="w-4 h-4 text-[#61e7f5]" />
              <span>{selectedPreset.label} — প্রস্তুত মুভি</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
              প্লেয়ারে চলছে
            </span>
          </div>

          {/* REAL HTML5 VIDEO PLAYER */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-black border border-[#243257] flex items-center justify-center ${
              aspectRatio === '9:16' ? 'h-96' : 'h-56'
            }`}
          >
            <video
              src={movieResult.videoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* SAVE / DOWNLOAD MOVIE BUTTON */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 rounded-2xl bg-[#61e7f5] text-black font-extrabold text-xs shadow-lg shadow-cyan-500/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-black" />
              <span>ভিডিও সেভ / ডাউনলোড করুন</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedPreset.generatedSample);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="py-2.5 px-3 rounded-2xl bg-[#151d33] border border-[#243257] text-gray-200 hover:text-white font-bold text-xs hover:border-[#61e7f5]/40 transition-all flex items-center justify-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে' : 'স্ক্রিপ্ট কপি করুন'}</span>
            </button>
          </div>

          {/* Script Details Card */}
          <div className="p-3 rounded-2xl bg-[#151d33] border border-white/5 space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-400 block">
              মুভির অডিও ডায়লগ ও গানের লিরিক্স:
            </span>
            <div className="text-xs text-gray-300 whitespace-pre-line leading-relaxed bg-[#0b1020] p-2.5 rounded-xl border border-[#243257] font-mono">
              {selectedPreset.generatedSample}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
