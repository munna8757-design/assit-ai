import React, { useState, useEffect } from 'react';
import { NavigationTab, AppSettings, AvatarCostumeId } from './types';
import { storageService } from './services/storageService';
import { speechService } from './services/speechService';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { FloatingVoiceButton } from './components/layout/FloatingVoiceButton';
import { FullScreenLiveAvatar } from './components/home/FullScreenLiveAvatar';
import { ChatScreen } from './components/chat/ChatScreen';
import { AnatomyViewer } from './components/learn/AnatomyViewer';
import { HealthLibrary } from './components/learn/HealthLibrary';
import { VideoMaker } from './components/studio/VideoMaker';
import { ScriptWriter } from './components/studio/ScriptWriter';
import { ImageStudio } from './components/studio/ImageStudio';
import { ApkInstallerCard } from './components/tools/ApkInstallerCard';
import { PhoneValidator } from './components/tools/PhoneValidator';
import { BmiCalculator } from './components/tools/BmiCalculator';
import { WaterTracker } from './components/tools/WaterTracker';
import { PillReminder } from './components/tools/PillReminder';
import { CodeExporter } from './components/tools/CodeExporter';
import { SettingsModal } from './components/tools/SettingsModal';
import { Film, FileText, Image as ImageIcon, Eye, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('Home');
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [learnSubTab, setLearnSubTab] = useState<'anatomy' | 'articles'>('anatomy');
  const [studioSubTab, setStudioSubTab] = useState<'video' | 'script' | 'image'>('video');

  const handleCostumeChange = (costumeId: AvatarCostumeId) => {
    const updated = { ...settings, activeCostume: costumeId };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const handleToggleVoice = () => {
    const updated = { ...settings, voiceEnabled: !settings.voiceEnabled };
    setSettings(updated);
    storageService.saveSettings(updated);
    if (!updated.voiceEnabled) {
      speechService.stop();
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex flex-col font-sans select-none selection:bg-[#61e7f5] selection:text-black">
      {/* Top Application Bar */}
      <TopHeader
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleVoice={handleToggleVoice}
      />

      {/* Main Tab Screen Container */}
      <main className="flex-1 max-w-md w-full mx-auto pb-20">
        {/* TAB 1: HOME - FULL SCREEN LIVE FEMALE AVATAR */}
        {currentTab === 'Home' && (
          <div className="p-1 sm:p-2 animate-fade-in">
            <FullScreenLiveAvatar
              activeCostumeId={settings.activeCostume}
              settings={settings}
              onCostumeChange={handleCostumeChange}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: AI CHAT */}
        {currentTab === 'AI Chat' && (
          <div className="animate-fade-in">
            <ChatScreen settings={settings} />
          </div>
        )}

        {/* TAB 3: LEARN (Anatomy & Health Knowledge) */}
        {currentTab === 'Learn' && (
          <div className="p-3.5 space-y-4 animate-fade-in">
            {/* Sub-nav switch */}
            <div className="flex items-center bg-[#151d33] p-1 rounded-2xl border border-[#243257]">
              <button
                onClick={() => setLearnSubTab('anatomy')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  learnSubTab === 'anatomy'
                    ? 'bg-[#61e7f5] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>অ্যানাটমি ও অঙ্গসংস্থান</span>
              </button>
              <button
                onClick={() => setLearnSubTab('articles')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  learnSubTab === 'articles'
                    ? 'bg-[#61e7f5] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>স্বাস্থ্য শিক্ষা ও প্রজনন</span>
              </button>
            </div>

            {learnSubTab === 'anatomy' ? <AnatomyViewer /> : <HealthLibrary />}
          </div>
        )}

        {/* TAB 4: STUDIO */}
        {currentTab === 'Studio' && (
          <div className="p-3.5 space-y-4 animate-fade-in">
            {/* Studio Mode Selector */}
            <div className="flex items-center bg-[#151d33] p-1 rounded-2xl border border-[#243257]">
              <button
                onClick={() => setStudioSubTab('video')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  studioSubTab === 'video'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>মুভি ও ভিডিও</span>
              </button>
              <button
                onClick={() => setStudioSubTab('script')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  studioSubTab === 'script'
                    ? 'bg-gradient-to-r from-blue-600 to-[#61e7f5] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>লিরিক্স ও কবিতা</span>
              </button>
              <button
                onClick={() => setStudioSubTab('image')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  studioSubTab === 'image'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>AI ছবি</span>
              </button>
            </div>

            {studioSubTab === 'video' && <VideoMaker settings={settings} />}
            {studioSubTab === 'script' && <ScriptWriter settings={settings} />}
            {studioSubTab === 'image' && <ImageStudio settings={settings} />}
          </div>
        )}

        {/* TAB 5: TOOLS */}
        {currentTab === 'Tools' && (
          <div className="p-3.5 space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">
                টুলস ও মোবাইল ইউটিলিটি
              </h2>
              <p className="text-xs text-gray-400">
                স্বাস্থ্য ব্যবস্থাপনা, ক্যালকুলেটর, জরুরি হটলাইন ও বিকাশকারী মডিউল।
              </p>
            </div>

            {/* Android APK & Mobile Installation Card */}
            <ApkInstallerCard />

            {/* Water Tracker */}
            <WaterTracker />

            {/* Pill Reminder */}
            <PillReminder />

            {/* BMI Calculator */}
            <BmiCalculator />

            {/* BD Mobile Operator Validator */}
            <PhoneValidator />

            {/* Code Templates Exporter */}
            <CodeExporter />
          </div>
        )}
      </main>

      {/* Floating Assistant Voice Button when not in chat */}
      {currentTab !== 'AI Chat' && (
        <FloatingVoiceButton onOpenVoiceChat={() => setCurrentTab('AI Chat')} />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          speechService.stop();
          setCurrentTab(tab);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
};
export default App;
