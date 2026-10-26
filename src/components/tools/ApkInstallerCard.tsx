import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, Info, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

export const ApkInstallerCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'মোবাইলে ইন্সটল করতে:\n১. ক্রোম/ব্রাউজারের ৩-ডট মেন্যুতে (⋮) ট্যাপ করুন।\n২. "Install app" অথবা "Add to Home screen" (হোম স্ক্রিনে যোগ করুন) চাপুন।\n\nএটি সরাসরি আপনার ফোনের অ্যাপ ড্রয়ারে নেটিভ অ্যাপের মতো যুক্ত হয়ে যাবে!'
      );
    }
  };

  return (
    <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#151d33] to-[#0e1628] border border-[#61e7f5]/30 shadow-2xl space-y-3.5">
      <div className="flex items-center space-x-2.5">
        <div className="p-2.5 rounded-2xl bg-[#61e7f5]/20 text-[#61e7f5] shadow-lg shadow-cyan-500/20">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
            <span>Android APK ও মোবাইল ইনস্টলেশন</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              Android 10+ রেডি
            </span>
          </h3>
          <p className="text-[11px] text-gray-400">
            মোবাইলে স্মুথভাবে পূর্ণ স্ক্রিনে চালানোর জন্য
          </p>
        </div>
      </div>

      {/* Direct Mobile Installation Button */}
      <button
        onClick={handleInstallPwa}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#61e7f5] via-blue-600 to-purple-600 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center space-x-2"
      >
        <Download className="w-4 h-4 text-black" />
        <span>
          {isInstalled
            ? 'মোবাইলে ইনস্টল সম্পন্ন (Standalone)'
            : 'ফোনে সরাসরি ইনস্টল করুন (Install on Phone)'}
        </span>
      </button>

      {/* APK & Mobile Instructions */}
      <div className="p-3 rounded-2xl bg-[#0b1020] border border-white/5 space-y-2 text-xs text-gray-300">
        <div className="font-semibold text-[#61e7f5] flex items-center space-x-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>মোবাইলে সঠিকভাবে চালানোর দুটি সহজ উপায়:</span>
        </div>

        <div className="space-y-1.5 text-[11px] pl-1">
          <div className="flex items-start space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-[#151d33] border border-[#243257] flex items-center justify-center text-[10px] font-bold text-[#61e7f5] shrink-0 mt-0.5">
              ১
            </span>
            <p>
              <strong className="text-white">১-ক্লিকে ওয়েব-এপিকে (WebAPK):</strong> মোবাইল ব্রাউজারে উপরের বাটনে চাপুন অথবা ব্রাউজার মেন্যু থেকে <em>"Add to Home screen"</em> দিলে ফোনে আলাদা অ্যাপ আইকন সহ ইনস্টল হয়ে যাবে।
            </p>
          </div>

          <div className="flex items-start space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-[#151d33] border border-[#243257] flex items-center justify-center text-[10px] font-bold text-[#61e7f5] shrink-0 mt-0.5">
              ২
            </span>
            <p>
              <strong className="text-white">Capacitor Native APK:</strong> প্রজেক্টটিতে <code>@capacitor/android</code> কনফিগার করা আছে। গিটহাবে পুশ করলে GitHub Actions স্বয়ংক্রিয়ভাবে <code>app-debug.apk</code> বিল্ড করে দেয়।
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% সেফ ও সিকিউর মোবাইল প্যাকেজ</span>
        </span>
        <span className="text-cyan-400 font-mono">v1.0.1 (Android)</span>
      </div>
    </div>
  );
};
