import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';

const CODE_TEMPLATES = {
  Kotlin: `// Dr. Munna Assist AI - Kotlin Mobile Module
package com.munna.assistai

data class HealthTip(val id: Int, val title: String, val category: String)

fun main() {
    println("Hello from Dr. Munna Assist AI Native Android Client")
    val assistant = "Dr. Munna AI"
    val tips = listOf(
        HealthTip(1, "পর্যাপ্ত পানি পান করুন", "হাইড্রেশন"),
        HealthTip(2, "প্রতিদিন ৩০ মিনিট হাঁটুন", "ব্যায়াম")
    )
    println("Active Assistant: $assistant with \${tips.size} health modules loaded.")
}`,

  Python: `# Dr. Munna Assist AI - Python Script
import json

def get_health_status():
    return {
        "status": "active",
        "assistant": "Dr. Munna Assist AI",
        "language": "Bangla",
        "modules": ["anatomy", "voice_assistant", "hydration", "pill_reminder"]
    }

if __name__ == "__main__":
    print(json.dumps(get_health_status(), indent=2, ensure_ascii=False))`,

  JavaScript: `// Dr. Munna Assist AI - Express Backend Service
import express from 'express';
const app = express();
const PORT = 8080;

app.get('/health', (req, res) => {
  res.json({
    service: 'Dr. Munna Assist AI Backend',
    status: 'online',
    bengaliTts: true,
    features: ['anatomy', 'avatar_voice', 'health_chat', 'pill_scheduler']
  });
});

app.listen(PORT, () => console.log(\`Running on \${PORT}\`));`,
};

export const CodeExporter: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'Kotlin' | 'Python' | 'JavaScript'>('Kotlin');
  const [copied, setCopied] = useState(false);

  const code = CODE_TEMPLATES[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-[#61e7f5]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              ডেভেলপার কোড টেমপ্লেট
            </h3>
            <p className="text-[11px] text-gray-400">
              Android Kotlin, Python ও JS মডিউল
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-1 bg-[#0b1020] border border-[#243257] rounded-xl text-xs text-gray-300 hover:text-white transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
        </button>
      </div>

      {/* Language Switcher */}
      <div className="flex items-center space-x-1 bg-[#0b1020] p-1 rounded-xl border border-white/5">
        {(['Kotlin', 'Python', 'JavaScript'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${
              activeLang === lang
                ? 'bg-[#61e7f5] text-black font-semibold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Code Block */}
      <pre className="p-3 rounded-2xl bg-[#090d1a] border border-[#243257] text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed select-text">
        {code}
      </pre>
    </div>
  );
};
