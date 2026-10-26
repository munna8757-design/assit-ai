import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Share2,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import { ChatMessage, AppSettings } from '../../types';
import { geminiService } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { PromptChips } from './PromptChips';
import { AVATAR_COSTUMES } from '../../data/avatars';

interface ChatScreenProps {
  settings: AppSettings;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storageService.getChats());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const activeCostume =
    AVATAR_COSTUMES.find((c) => c.id === settings.activeCostume) || AVATAR_COSTUMES[0];

  useEffect(() => {
    storageService.saveChats(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await geminiService.chat(text, newMessages, settings);
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.reply,
        timestamp: Date.now(),
        model: response.model,
      };

      setMessages((prev) => [...prev, modelMessage]);

      // If voice enabled, speak the answer
      if (settings.voiceEnabled) {
        setPlayingId(modelMessage.id);
        speechService.speak(response.reply, {
          rate: settings.speechRate,
          pitch: settings.speechPitch,
          onEnd: () => setPlayingId(null),
        });
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'অনুরোধ সম্পন্ন করতে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা ইন্টারনেট সংযোগ নিশ্চিত করুন।',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (stopListeningRef.current) stopListeningRef.current();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const stopFn = speechService.startListening(
      {
        onResult: (transcript) => {
          setIsListening(false);
          setInput(transcript);
          handleSendMessage(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          console.warn('Speech error:', err);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'bn-BD'
    );
    stopListeningRef.current = stopFn;
  };

  const handleToggleAudio = (msg: ChatMessage) => {
    if (playingId === msg.id) {
      speechService.stop();
      setPlayingId(null);
    } else {
      setPlayingId(msg.id);
      speechService.speak(msg.text, {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onEnd: () => setPlayingId(null),
      });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'ডা. মুন্না এআই স্বাস্থ্য পরামর্শ',
        text,
      }).catch(() => {});
    } else {
      handleCopy('share', text);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('আপনি কি পূর্ববর্তী সমস্ত চ্যাট মুছে ফেলতে চান?')) {
      speechService.stop();
      const initialMessage: ChatMessage = {
        id: 'welcome-reset',
        role: 'model',
        text: 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আমি ডা. মুন্না অ্যাসিস্ট এআই। আপনি যেকোনো স্বাস্থ্য বিষয়ে প্রশ্ন করতে পারেন।',
        timestamp: Date.now(),
      };
      setMessages([initialMessage]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-md mx-auto">
      {/* Top Banner / Disclaimer */}
      <div className="p-2.5 mx-3 mt-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-[11px] flex items-start space-x-2 shrink-0">
        <AlertCircle className="w-4 h-4 text-[#61e7f5] shrink-0 mt-0.5" />
        <div className="leading-tight">
          <span className="font-semibold text-white">শিক্ষামূলক স্বাস্থ্য সেবা: </span>
          <span>এটি প্রেসক্রিপশনের বিকল্প নয়। স্বাস্থ্য সমস্যায় সরাসরি রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।</span>
        </div>
        <button
          onClick={handleClearHistory}
          className="p-1 text-gray-400 hover:text-rose-400 ml-auto shrink-0 transition-colors"
          title="চ্যাট হিস্ট্রি মুছুন"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isAudioActive = playingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${
                isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              } animate-fade-in`}
            >
              {/* Avatar Icon */}
              <div className="shrink-0 mt-1">
                {isUser ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-md">
                    <User className="w-4 h-4 text-black" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#61e7f5]/40 shadow-md">
                    <img
                      src={activeCostume.image}
                      alt="Dr. Munna"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-[#1e40af] text-white rounded-tr-none'
                    : 'bg-[#151d33] border border-[#243257] text-gray-100 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/5 text-[10px] text-[#61e7f5] font-semibold">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>ডা. মুন্না এআই</span>
                    </span>
                    <span className="text-gray-400 font-normal">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}

                {/* Message Text */}
                <div className="whitespace-pre-line break-words text-[13px]">
                  {msg.text}
                </div>

                {/* Action Buttons for Model Responses */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <button
                      onClick={() => handleToggleAudio(msg)}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg transition-all ${
                        isAudioActive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'hover:text-[#61e7f5] hover:bg-white/5'
                      }`}
                    >
                      {isAudioActive ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          <span>থামান</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>শুনুন</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-white transition-colors"
                        title="কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(msg.text)}
                        className="hover:text-white transition-colors"
                        title="শেয়ার করুন"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#61e7f5]/40 shadow-md">
              <img
                src={activeCostume.image}
                alt="Dr. Munna"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="bg-[#151d33] border border-[#243257] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-gray-300 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#61e7f5] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#61e7f5] rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-[#61e7f5] rounded-full animate-bounce delay-200" />
              <span className="text-[11px] text-gray-400 ml-1">উত্তর প্রস্তুত হচ্ছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 shrink-0">
        <PromptChips onSelectPrompt={(p) => handleSendMessage(p)} />
      </div>

      {/* Input Box Bar */}
      <div className="px-3 pb-2 pt-1 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-1.5 bg-[#151d33] border border-[#243257] rounded-2xl p-1.5 shadow-xl focus-within:border-[#61e7f5]/60 transition-all"
        >
          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-gray-400 hover:text-[#61e7f5] hover:bg-white/5'
            }`}
            title={isListening ? 'রেকর্ডিং বন্ধ করুন' : 'বাংলায় কথা বলুন'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? 'শুনছি... আপনার স্বাস্থ্য জিজ্ঞাসা বলুন...'
                : 'স্বাস্থ্য বিষয়ে জিজ্ঞাসা লিখুন...'
            }
            className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 px-2 py-1.5 focus:outline-none"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? 'bg-[#61e7f5] text-black shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95'
                : 'text-gray-500 bg-[#0b1020] cursor-not-allowed opacity-50'
            }`}
            title="পাঠান"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
