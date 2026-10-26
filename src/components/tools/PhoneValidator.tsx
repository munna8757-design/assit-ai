import React, { useState } from 'react';
import { Smartphone, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export const PhoneValidator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    operator?: string;
    type?: string;
    note: string;
  } | null>(null);

  const handleValidate = () => {
    const raw = phoneNumber.replace(/[\s-]/g, '');
    const clean = raw.startsWith('+88')
      ? raw.slice(3)
      : raw.startsWith('88')
      ? raw.slice(2)
      : raw;

    if (!clean) return;

    if (!/^01[3-9]\d{8}$/.test(clean)) {
      setResult({
        valid: false,
        note: 'নম্বরটি সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর ফরম্যাটে (যেমন: 017xxxxxxxx) নেই।',
      });
      return;
    }

    const prefix = clean.substring(0, 3);
    let operator = 'অজানা অপারেটর';
    if (prefix === '017' || prefix === '013') {
      operator = 'Grameenphone (GP)';
    } else if (prefix === '018' || prefix === '016') {
      operator = 'Robi / Airtel';
    } else if (prefix === '019' || prefix === '014') {
      operator = 'Banglalink';
    } else if (prefix === '015') {
      operator = 'Teletalk (রাষ্ট্রায়ত্ত)';
    }

    setResult({
      valid: true,
      operator,
      type: 'বাংলাদেশ মোবাইল জিএসএম নেটওয়ার্ক',
      note: 'টেলিকম রেগুলেশন (BTRC) এবং সাইবার নিরাপত্তা আইন অনুযায়ী কোনো ব্যক্তির ব্যক্তিগত লাইভ লোকেশন বা অননুমোদিত তথ্য ট্র্যাকিং করা সম্পূর্ণ নিষিদ্ধ। বৈধ নম্বর ফরম্যাট ও অনুমোদিত অপারেটর ইনফো এখানে যাচাই করা হয়েছে।',
    });
  };

  return (
    <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-[#61e7f5]">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            মোবাইল নম্বর ফরম্যাট ও অপারেটর যাচাই
          </h3>
          <p className="text-[11px] text-gray-400">
            বাংলাদেশি ১১-ডিজিটের সিম নেটওয়ার্ক ভ্যালিডেশন
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="যেমন: 01712345678"
          className="flex-1 bg-[#0b1020] border border-[#243257] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
        />
        <button
          onClick={handleValidate}
          className="px-4 py-2 rounded-xl bg-[#61e7f5] text-black font-semibold text-xs hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          যাচাই করুন
        </button>
      </div>

      {result && (
        <div
          className={`p-3 rounded-2xl border text-xs space-y-1.5 animate-fade-in ${
            result.valid
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center space-x-1.5 font-bold">
            {result.valid ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>বৈধ বাংলাদেশি নম্বর: {result.operator}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>অবৈধ বা অসম্পূর্ণ নম্বর</span>
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{result.note}</p>
        </div>
      )}
    </div>
  );
};
