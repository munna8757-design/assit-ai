import React from 'react';
import { Home, MessageSquare, BookOpen, Sparkles, Wrench } from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: NavigationTab; label: string; labelBn: string; icon: React.ReactNode }[] = [
    {
      id: 'Home',
      label: 'Home',
      labelBn: 'হোম',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'AI Chat',
      label: 'AI Chat',
      labelBn: 'এআই চ্যাট',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'Learn',
      label: 'Learn',
      labelBn: 'শিক্ষা',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'Studio',
      label: 'Studio',
      labelBn: 'স্টুডিও',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'Tools',
      label: 'Tools',
      labelBn: 'টুলস',
      icon: <Wrench className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#151d33]/95 backdrop-blur-lg border-t border-[#243257] shadow-2xl pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#61e7f5]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-7 h-1 bg-[#61e7f5] rounded-full shadow-lg shadow-cyan-400/50 animate-fade-in" />
              )}
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] font-medium mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
