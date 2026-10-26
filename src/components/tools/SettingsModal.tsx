import React, { useState } from 'react';
import {
  X,
  Key,
  Globe,
  Sliders,
  Volume2,
  Check,
  Shield,
  Eye,
  EyeOff,
  Server,
  Info,
  RefreshCw,
} from 'lucide-react';
import { AppSettings } from '../../types';
import { speechService } from '../../services/speechService';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!formData.backendUrl) {
      setConnectionStatus('সার্ভার URL খালি। লোকাল অন-ডিভাইস মোড সক্রিয় থাকবে।');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('সার্ভার স্বাস্থ্য পরীক্ষা করা হচ্ছে...');
    try {
      const res = await fetch(`${formData.backendUrl.replace(/\/$/, '')}/health`);
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(`সার্ভার অনলাইন (${data.service || 'সংযুক্ত'})`);
      } else {
        setConnectionStatus(`সার্ভার প্রতিক্রিয়া: HTTP ${res.status}`);
      }
    } catch (e: any) {
      setConnectionStatus('সার্ভারে সংযোগ ব্যর্থ হয়েছে। URL যাচাই করুন।');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestVoice = () => {
    speechService.speak('ডা. মুন্না এসিস্ট এআই ভয়েস টেস্ট সম্পন্ন হয়েছে।', {
      rate: formData.speechRate,
      pitch: formData.speechPitch,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#151d33] border border-[#243257] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#243257] bg-[#0e1628]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/20 text-[#61e7f5]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">অ্যাপ সেটিংস ও এপিআই</h3>
              <p className="text-[10px] text-gray-400">কনফিগারেশন ও ভয়েস কন্ট্রোল</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* AI Credentials Group */}
          <div className="space-y-3 bg-[#0b1020] p-3.5 rounded-2xl border border-white/5">
            <span className="text-[11px] font-bold text-[#61e7f5] uppercase tracking-wider block">
              AI মডেল ও ব্যাকএন্ড সংযোগ
            </span>

            {/* Google API Key */}
            <div className="space-y-1">
              <label className="text-gray-300 font-medium flex items-center space-x-1">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Gemini API Key (ঐচ্ছিক):</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.googleApiKey}
                  onChange={(e) => setFormData({ ...formData, googleApiKey: e.target.value })}
                  placeholder="AI Studio API key (না দিলেও অফলাইন AI কাজ করবে)"
                  className="w-full bg-[#151d33] border border-[#243257] rounded-xl px-3 py-2 pr-9 text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Backend URL */}
            <div className="space-y-1">
              <label className="text-gray-300 font-medium flex items-center space-x-1">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>কাস্টম ব্যাকএন্ড URL (ঐচ্ছিক):</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="url"
                  value={formData.backendUrl}
                  onChange={(e) => setFormData({ ...formData, backendUrl: e.target.value })}
                  placeholder="https://your-backend.onrender.com"
                  className="flex-1 bg-[#151d33] border border-[#243257] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-3 py-2 bg-[#243257] hover:bg-[#324577] text-white rounded-xl text-[11px] font-medium"
                >
                  {testingConnection ? 'যাচাই...' : 'টেস্ট'}
                </button>
              </div>
              {connectionStatus && (
                <p className="text-[11px] text-cyan-300 mt-1">{connectionStatus}</p>
              )}
            </div>
          </div>

          {/* Voice & TTS Control Group */}
          <div className="space-y-3 bg-[#0b1020] p-3.5 rounded-2xl border border-white/5">
            <span className="text-[11px] font-bold text-[#b59bff] uppercase tracking-wider block">
              ভয়েস ও উচ্চারণ সেটিংস
            </span>

            {/* Voice Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">ভয়েস সহকারী স্বয়ংক্রিয় পাঠ:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, voiceEnabled: !formData.voiceEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  formData.voiceEnabled ? 'bg-[#61e7f5]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                    formData.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>কথা বলার গতি (Speed Rate):</span>
                <span>{formData.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={formData.speechRate}
                onChange={(e) =>
                  setFormData({ ...formData, speechRate: parseFloat(e.target.value) })
                }
                className="w-full accent-[#61e7f5]"
              />
            </div>

            {/* Speech Pitch Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>কণ্ঠের সুর (Pitch):</span>
                <span>{formData.speechPitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={formData.speechPitch}
                onChange={(e) =>
                  setFormData({ ...formData, speechPitch: parseFloat(e.target.value) })
                }
                className="w-full accent-[#b59bff]"
              />
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              className="w-full py-1.5 rounded-xl bg-[#151d33] border border-[#243257] text-[#61e7f5] hover:bg-[#1f2b4c] text-[11px] flex items-center justify-center space-x-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>নমুনা বাংলা উচ্চারণ পরীক্ষা করুন</span>
            </button>
          </div>

          {/* App Info Box */}
          <div className="p-3 rounded-2xl bg-[#0b1020]/60 border border-white/5 space-y-1 text-[11px] text-gray-400">
            <div className="flex items-center space-x-1 font-semibold text-gray-300">
              <Info className="w-3.5 h-3.5 text-[#61e7f5]" />
              <span>Dr. Munna Assist AI v2.0 (Native Android Web)</span>
            </div>
            <p>লক্ষণ মূল্যায়ন, প্রজনন স্বাস্থ্য, এআই স্ক্রিপ্ট ও অ্যানাটমি এডুকেশন প্ল্যাটফর্ম।</p>
          </div>

          {/* Submit Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#61e7f5] to-blue-600 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-black" />
              <span>সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
