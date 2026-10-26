import React, { useState, useEffect } from 'react';
import { Eye, Heart, Brain, Wind, Shield, Utensils, Volume2, VolumeX, Info, ChevronRight, X, Sparkles } from 'lucide-react';
import { AnatomyTab, OrganDetail } from '../../types';
import { ORGAN_SYSTEMS } from '../../data/anatomy';
import { speechService } from '../../services/speechService';

export const AnatomyViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnatomyTab>('organs');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganDetail | null>(ORGAN_SYSTEMS[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return speechService.subscribeSpeakingState(setIsSpeaking);
  }, []);

  const tabs: { id: AnatomyTab; label: string }[] = [
    { id: 'human', label: 'রিয়েল মানুষ' },
    { id: 'organs', label: 'অঙ্গসংস্থান (Real)' },
    { id: 'skeleton', label: 'কঙ্কালতন্ত্র' },
  ];

  const handleSpeakOrgan = (organ: OrganDetail) => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      speechService.speak(
        `${organ.nameBn}। ${organ.summary} বিস্তারিত তথ্যে রয়েছে: ${organ.details.join('। ')}। ডাক্তারের পরামর্শ: ${organ.clinicalNote}`,
        {
          pitch: 1.18,
          rate: 0.96,
        }
      );
    }
  };

  const getOrganIcon = (name: string) => {
    switch (name) {
      case 'Brain':
        return <Brain className="w-4 h-4 text-[#61e7f5]" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-amber-400" />;
      default:
        return <Utensils className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Doctor Explanation Header Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#151d33] to-blue-950/50 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#61e7f5] shadow-lg">
            <img
              src="/assets/avatar_doctor_1792299251841.jpg"
              alt="Dr. Munna Doctor"
              className="w-full h-full object-cover object-top"
            />
            {isSpeaking && (
              <span className="absolute inset-0 bg-[#61e7f5]/30 animate-pulse" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1">
              <span>ডা. মুন্না লাইভ অ্যানাটমি লেকচার</span>
              <Sparkles className="w-3 h-3 text-[#61e7f5]" />
            </h4>
            <p className="text-[10px] text-cyan-200">
              {isSpeaking ? '🎙️ নারী কণ্ঠে ব্যাখ্যা করছেন...' : 'অঙ্গ নির্বাচন করে নারী কণ্ঠে শুনুন'}
            </p>
          </div>
        </div>

        {selectedOrgan && (
          <button
            onClick={() => handleSpeakOrgan(selectedOrgan)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md transition-all ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-[#61e7f5] text-black hover:opacity-95'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'থামান' : 'শুনুন'}</span>
          </button>
        )}
      </div>

      {/* Anatomy Visualizer Card */}
      <div className="rounded-3xl bg-[#151d33] border border-[#243257] p-4 shadow-xl relative overflow-hidden">
        {/* Tabs for Anatomy Mode */}
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-[#61e7f5]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              অ্যানাটমি ভিজ্যুয়ালাইজার
            </h3>
          </div>

          <div className="flex items-center bg-[#0b1020] p-0.5 rounded-xl border border-[#243257]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#61e7f5] text-black font-semibold shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Frame Container */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1020] to-[#111827] border border-[#243257]/80 h-64 sm:h-72 flex items-center justify-center group">
          {activeTab === 'organs' ? (
            <div className="relative w-full h-full">
              <img
                src="/assets/anatomy_organs_1792300685684.jpg"
                alt="Human Organs Anatomy"
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Interactive Organ Hotspots */}
              <button
                onClick={() => {
                  setSelectedOrgan(ORGAN_SYSTEMS[0]);
                  handleSpeakOrgan(ORGAN_SYSTEMS[0]);
                }}
                className="absolute top-8 left-1/2 -translate-x-1/2 p-2 rounded-full bg-[#61e7f5] text-black shadow-xl ring-2 ring-white/50 animate-pulse hover:scale-110 active:scale-95 transition-all"
                title="মস্তিষ্ক"
              >
                <Brain className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedOrgan(ORGAN_SYSTEMS[1]);
                  handleSpeakOrgan(ORGAN_SYSTEMS[1]);
                }}
                className="absolute top-24 left-[45%] p-2 rounded-full bg-rose-500 text-white shadow-xl ring-2 ring-white/50 animate-pulse hover:scale-110 active:scale-95 transition-all"
                title="হৃৎপিণ্ড"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedOrgan(ORGAN_SYSTEMS[2]);
                  handleSpeakOrgan(ORGAN_SYSTEMS[2]);
                }}
                className="absolute top-24 left-[55%] p-2 rounded-full bg-cyan-400 text-black shadow-xl ring-2 ring-white/50 animate-pulse hover:scale-110 active:scale-95 transition-all"
                title="ফুসফুস"
              >
                <Wind className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedOrgan(ORGAN_SYSTEMS[3]);
                  handleSpeakOrgan(ORGAN_SYSTEMS[3]);
                }}
                className="absolute top-36 left-1/2 -translate-x-1/2 p-2 rounded-full bg-emerald-400 text-black shadow-xl ring-2 ring-white/50 animate-pulse hover:scale-110 active:scale-95 transition-all"
                title="পরিপাকতন্ত্র ও লিভার"
              >
                <Utensils className="w-4 h-4" />
              </button>
            </div>
          ) : activeTab === 'human' ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <img
                src="/assets/avatar_doctor_1792299251841.jpg"
                alt="Human Anatomy Overview"
                className="h-44 rounded-2xl object-cover object-top border border-cyan-500/30 shadow-xl mb-2"
              />
              <span className="text-xs font-semibold text-white">
                মানব শরীর ও বাহ্যিক শারীরবৃত্তীয় অবয়ব
              </span>
              <p className="text-[11px] text-gray-400 max-w-xs mt-0.5">
                শারীরবৃত্তীয় ভারসাম্য ও সুস্থ জীবনযাপনের বৈজ্ঞানিক পরিচয়।
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
                <Shield className="w-10 h-10 text-amber-400 animate-pulse-slow" />
              </div>
              <span className="text-xs font-semibold text-white">
                কঙ্কালতন্ত্র (২০৬টি অস্থি)
              </span>
              <p className="text-[11px] text-gray-400 max-w-xs mt-0.5">
                অক্ষীয় ও উপাঙ্গীয় কঙ্কাল, অস্থিমজ্জা ও পেশীবহুল সুরক্ষা বলয়।
              </p>
              <button
                onClick={() => {
                  setSelectedOrgan(ORGAN_SYSTEMS[4]);
                  handleSpeakOrgan(ORGAN_SYSTEMS[4]);
                }}
                className="mt-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-medium hover:bg-amber-500/30 transition-all"
              >
                হাড় ও পেশিতন্ত্রের কথা শুনুন
              </button>
            </div>
          )}

          {/* Quick guide watermark */}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-gray-400 border border-white/5">
            অঙ্গে চাপুন — লাইভ ব্যাখ্যা শুনুন
          </div>
        </div>

        {/* Organ Quick Selector Badges */}
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {ORGAN_SYSTEMS.map((organ) => {
            const isSelected = selectedOrgan?.id === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => {
                  setSelectedOrgan(organ);
                  handleSpeakOrgan(organ);
                }}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center ${
                  isSelected
                    ? 'bg-[#1e293b] border-[#61e7f5] shadow-lg ring-1 ring-[#61e7f5]/40'
                    : 'bg-[#0b1020] border-[#243257] hover:border-gray-500'
                }`}
              >
                {getOrganIcon(organ.iconName)}
                <span className="text-[10px] font-medium text-gray-300 mt-1 truncate w-full">
                  {organ.nameBn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Organ Detail Card */}
      {selectedOrgan && (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#151d33] to-[#10172a] border border-[#61e7f5]/30 shadow-2xl animate-fade-in relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-[#61e7f5]">
                {getOrganIcon(selectedOrgan.iconName)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {selectedOrgan.nameBn}
                </h4>
                <p className="text-[11px] text-cyan-300">
                  {selectedOrgan.nameEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeakOrgan(selectedOrgan)}
              className="p-2 rounded-xl bg-[#61e7f5] text-black font-semibold text-xs flex items-center space-x-1"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'থামান' : 'শুনুন'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            {selectedOrgan.summary}
          </p>

          <div className="space-y-1.5 mb-3 bg-[#0b1020]/60 p-3 rounded-xl border border-white/5">
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              প্রধান উপাদানসমূহ:
            </span>
            {selectedOrgan.details.map((detail, idx) => (
              <div key={idx} className="flex items-start space-x-1.5 text-xs text-gray-300">
                <ChevronRight className="w-3.5 h-3.5 text-[#61e7f5] shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-300">ক্লিনিক্যাল পরামর্শ: </span>
              <span>{selectedOrgan.clinicalNote}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
