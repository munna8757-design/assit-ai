import React from 'react';
import {
  MessageSquare,
  BookOpen,
  Sparkles,
  Scale,
  Droplets,
  Bell,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface QuickActionGridProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ onNavigate }) => {
  const actions = [
    {
      title: 'AI স্বাস্থ্য চ্যাট',
      desc: 'লক্ষণ বিশ্লেষণ ও বাংলা পরামর্শ',
      icon: <MessageSquare className="w-5 h-5 text-[#61e7f5]" />,
      tab: 'AI Chat' as NavigationTab,
      bg: 'from-cyan-950/40 to-[#151d33]',
      border: 'border-cyan-500/20 hover:border-cyan-400/50',
    },
    {
      title: 'অ্যানাটমি ও শিক্ষা',
      desc: 'অঙ্গসংস্থান ও বৈজ্ঞানিক গাইড',
      icon: <BookOpen className="w-5 h-5 text-[#b59bff]" />,
      tab: 'Learn' as NavigationTab,
      bg: 'from-purple-950/40 to-[#151d33]',
      border: 'border-purple-500/20 hover:border-purple-400/50',
    },
    {
      title: 'AI ক্রিয়েটিভ স্টুডিও',
      desc: 'মিনা কার্টুন, গান, কবিতা ও মুভি',
      icon: <Sparkles className="w-5 h-5 text-pink-400" />,
      tab: 'Studio' as NavigationTab,
      bg: 'from-pink-950/40 to-[#151d33]',
      border: 'border-pink-500/20 hover:border-pink-400/50',
    },
    {
      title: 'BMI ও স্বাস্থ্য হিসাব',
      desc: 'আদর্শ শারীরিক ওজন ক্যালকুলেটর',
      icon: <Scale className="w-5 h-5 text-emerald-400" />,
      tab: 'Tools' as NavigationTab,
      bg: 'from-emerald-950/40 to-[#151d33]',
      border: 'border-emerald-500/20 hover:border-emerald-400/50',
    },
    {
      title: 'ওষুধের রিমাইন্ডার',
      desc: 'প্রেসক্রিপশন সময়সূচী ও তালিকা',
      icon: <Bell className="w-5 h-5 text-amber-400" />,
      tab: 'Tools' as NavigationTab,
      bg: 'from-amber-950/40 to-[#151d33]',
      border: 'border-amber-500/20 hover:border-amber-400/50',
    },
    {
      title: 'হাইড্রেশন ট্র্যাকার',
      desc: 'দৈনিক ৮ গ্লাস পানি পানের হিসাব',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      tab: 'Tools' as NavigationTab,
      bg: 'from-blue-950/40 to-[#151d33]',
      border: 'border-blue-500/20 hover:border-blue-400/50',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-[#61e7f5]" />
          <span>সহজ সেবা ও ইউটিলিটিজ</span>
        </h3>
        <span className="text-[11px] text-gray-500">৬টি সক্রিয় ফিচার</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act, i) => (
          <button
            key={i}
            onClick={() => onNavigate(act.tab)}
            className={`p-3 rounded-2xl bg-gradient-to-br ${act.bg} border ${act.border} text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-[#0b1020]/60 border border-white/5">
                {act.icon}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#61e7f5] transition-colors">
                {act.title}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                {act.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
