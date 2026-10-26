import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Volume2,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { HEALTH_ARTICLES } from '../../data/healthArticles';
import { HealthArticle } from '../../types';
import { speechService } from '../../services/speechService';

const CATEGORIES = [
  'সব বিষয়',
  'অ্যানাটমি',
  'প্রজনন স্বাস্থ্য',
  'সম্পর্ক ও সুরক্ষা',
  'সুরক্ষা ও প্রতিরোধ',
  'সাধারণ স্বাস্থ্য',
] as const;

export const HealthLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব বিষয়');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('reproduction');

  const filteredArticles = HEALTH_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'সব বিষয়' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSpeakArticle = (article: HealthArticle) => {
    speechService.speak(
      `${article.title}। ${article.summary} বিস্তারিত: ${article.details.join('. ')}। পরামর্শ: ${article.clinicalNote}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#b59bff]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              স্বাস্থ্য শিক্ষা ও সচেতনতা লাইব্রেরি
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">
            {filteredArticles.length}টি অধ্যায়
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিষয় বা লক্ষণ দিয়ে অনুসন্ধান করুন..."
            className="w-full bg-[#151d33] border border-[#243257] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-[#61e7f5] text-black font-semibold shadow-md'
                  : 'bg-[#151d33] text-gray-300 border border-[#243257] hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs bg-[#151d33] rounded-2xl border border-[#243257]">
            কোনো অধ্যায় খুঁজে পাওয়া যায়নি। অনুসন্ধান পরিবর্তন করুন।
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;

            return (
              <div
                key={article.id}
                className="rounded-2xl bg-[#151d33] border border-[#243257] overflow-hidden transition-all duration-200 hover:border-[#61e7f5]/30 shadow-lg"
              >
                {/* Header Row */}
                <div
                  onClick={() => handleToggleExpand(article.id)}
                  className="p-4 cursor-pointer flex items-start justify-between space-x-3 select-none"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: article.iconColor }}
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white hover:text-[#61e7f5] transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakArticle(article);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#61e7f5] hover:bg-white/5 transition-all"
                      title="অডিও শুনুন"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 bg-[#0e1628]/60 animate-fade-in">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                        গুরুত্বপূর্ণ বৈজ্ঞানিক দিকসমূহ:
                      </span>
                      {article.details.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-2 text-xs text-gray-300 leading-relaxed"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: article.iconColor }}
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clinical Note Box */}
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-[#61e7f5] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold text-[#61e7f5]">
                          চিকিৎসকের পরামর্শ:{' '}
                        </span>
                        <span>{article.clinicalNote}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
