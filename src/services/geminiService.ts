import { AppSettings, ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `You are Dr. Munna Assist AI, a helpful, empathetic, multilingual doctor and healthcare virtual assistant. 
Match the user language, especially fluent Bengali (বাংলা). Be clear, respectful, practical, and compassionate.
For medical topics, provide scientifically grounded educational information, never claim to deliver a final medical diagnosis or write prescription dosages, explain uncertainty clearly, and recommend qualified clinicians or hospital healthcare facilities when alarming symptoms occur.`;

export const geminiService = {
  async chat(
    message: string,
    history: ChatMessage[],
    settings: AppSettings
  ): Promise<{ reply: string; model: string }> {
    // If backend URL is provided
    if (settings.backendUrl) {
      try {
        const res = await fetch(`${settings.backendUrl.replace(/\/$/, '')}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(settings.googleApiKey ? { Authorization: `Bearer ${settings.googleApiKey}` } : {}),
          },
          body: JSON.stringify({
            message,
            history: history.slice(-8).map(h => ({ role: h.role, text: h.text })),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) return { reply: data.reply, model: data.model || 'gemini-flash' };
        }
      } catch (e) {
        console.warn('Backend call failed, falling back:', e);
      }
    }

    // Direct Google Gemini API call if key is provided
    if (settings.googleApiKey) {
      try {
        const contents = history.slice(-6).map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }],
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(settings.googleApiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents,
            generationConfig: { temperature: 0.65, maxOutputTokens: 2048 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim();
          if (reply) return { reply, model: 'gemini-2.5-flash' };
        }
      } catch (e) {
        console.warn('Direct Gemini call failed:', e);
      }
    }

    // Offline / Built-in Medical AI Assistant responses for reliable offline experience
    return {
      reply: getContextualHealthResponse(message),
      model: 'Dr. Munna Assist Knowledge Engine (On-Device)',
    };
  },

  async generateCreativeText(
    prompt: string,
    presetType: string,
    settings: AppSettings
  ): Promise<string> {
    const fullPrompt = `You are the creative writer for Dr. Munna AI Studio. Category: ${presetType}. Write a high quality, authentic Bengali piece based on: "${prompt}". Output only the final creative script or text.`;

    if (settings.googleApiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(settings.googleApiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim();
          if (text) return text;
        }
      } catch (e) {
        console.warn('Creative text generation failed:', e);
      }
    }

    // Curated rich fallback based on category
    if (presetType.includes('মিনা') || presetType.includes('কার্টুন')) {
      return `মিনা: মিঠু, জানো? আমাদের পাঠশালার নতুন স্বাস্থ্য ক্লাবে আজ সবাই মিলে প্রতিজ্ঞা করেছি!\nমিঠু: টিয়া পাখি মিঠু বলে—প্রতিদিন সাবান দিয়ে হাত ধোবো, পরিষ্কার জামাকাপড় পরবো!\nরাজু: আপু, আমি তো ছোট, আমিও কি গ্রামে সবাইকে পরিষ্কার পরিচ্ছন্ন থাকার কথা বলতে পারবো?\nমিনা: অবশ্যই রাজু! ছোট-বড় সবাই মিলেই গড়বো আমাদের সুস্থ ও সুন্দর সোনার বাংলাদেশ!`;
    } else if (presetType.includes('গান')) {
      return `আকাশ প্রদীপ জ্বেলে রাতের মঞ্চে গান গাই আমি,\nতোমার ভালোবাসার সুর হয়ে মোর অন্তরে বাজে দামি।\nহৃদয় নদীর কূল ছাপিয়ে সুরের ধারা বয়,\nতোমার হাসির মিষ্টি ছোঁয়ায় দুঃখ দূরে রয়।\nতুমি আমার গানের সুর, তুমি প্রাণের ভাষা,\nতোমার মাঝেই খুঁজে পেলাম বাঁচার নতুন আশা।`;
    } else if (presetType.includes('কবিতা')) {
      return `হে অনন্ত মহাবিশ্ব, তোমার সীমানাহীন নীলিমায়\nমানবাত্মার সুপ্ত গান নক্ষত্রের মতো আলো ছড়ায়।\nঝরে পড়া পাতার মর্মরে বাজে এক চিরন্তন সুর,\nক্লান্ত পথিক খুঁজে পায় তার আপন শান্তির নীড় দূর।\nসবুজ ঘাসের ডগায় জমে থাকা শিশির কণার দ্যুতি,\nআমাদের শেখায় ভালোবেসে বাঁচাই জীবনের শ্রেষ্ঠ প্রাপ্তি।`;
    } else {
      return `দৃশ্য: ঢাকা মেডিকেল জরুরি বিভাগ — রাত ২:১৫\nশব্দ: ইসিজি মনিটরের সঙ্কেত এবং দ্রুত পদশব্দ।\nডা. মুন্না: "নার্স, তাৎক্ষণিক ও-নেগেটিভ ব্লাড দিন এবং আইভি ফ্লুইড চালু করুন!"\nরোগীর স্বজন: "ডাক্তার সাহেব, আমার ভাই বাঁচবে তো?"\nডা. মুন্না: "ধৈর্য রাখুন, আমরা আমাদের সর্বোচ্চ চেষ্টা করছি। জীবন বাঁচানোই আমাদের ব্রত।"`;
    }
  },

  async generateImage(
    prompt: string,
    settings: AppSettings
  ): Promise<{ imageUrl: string; reply: string }> {
    if (settings.googleApiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(settings.googleApiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Create one high quality educational image based on: ${prompt}` }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const imagePart = parts.find((p: any) => p.inlineData?.data || p.inline_data?.data);
          const inline = imagePart?.inlineData || imagePart?.inline_data;
          if (inline?.data) {
            const mime = inline.mimeType || inline.mime_type || 'image/png';
            return {
              imageUrl: `data:${mime};base64,${inline.data}`,
              reply: 'এআই চিত্র সফলভাবে তৈরি হয়েছে।',
            };
          }
        }
      } catch (e) {
        console.warn('Image API call failed:', e);
      }
    }

    // Local library fallback
    return {
      imageUrl: '/assets/anatomy_organs_1792300685684.jpg',
      reply: 'মানবদেহের অ্যানাটমি ও অঙ্গসংস্থান চিত্র প্রদর্শিত হয়েছে। আরও কাস্টম ছবির জন্য সেটিংসে জেমিনি এপিআই কি দিন।',
    };
  },
};

function getContextualHealthResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('জ্বর') || lower.includes('fever') || lower.includes('মাথাব্যথা') || lower.includes('headache')) {
    return `সাধারণ জ্বর ও মাথাব্যথা দেখা দিলে করণীয়:
১. পর্যাপ্ত বিশ্রাম নিন এবং শরীরকে রিল্যাক্স রাখুন।
২. প্রচুর পানি, ডাবের পানি, তাজা ফলের রস বা স্যুপ পান করে হাইড্রেটেড থাকুন।
৩. কপালে নরম ভেজা কাপড়ের জলপট্টি দিন।
৪. সাধারণ জ্বরে চিকিৎসকের পরামর্শ অনুযায়ী প্যারাসিটামল গ্রহণ করা যেতে পারে; তবে খালি পেটে নয়।
⚠️ সতর্কতা: যদি জ্বর ১০৩° ফারেনহাইটের বেশি হয়, ৩ দিনের বেশি স্থায়ী থাকে, বা তীব্র ঘাড় শক্ত হওয়া, শ্বাসকষ্ট কিংবা শরীরে র‍্যাশ দেখা দেয়, তবে কালবিলম্ব না করে নিকটস্থ হাসপাতালে যান বা যোগ্য চিকিৎসকের পরামর্শ নিন।`;
  }

  if (lower.includes('বুক') || lower.includes('ব্যথা') || lower.includes('chest pain') || lower.includes('হার্ট')) {
    return `জরুরি স্বাস্থ্য সতর্কতা:
বুকের মাঝখানে বা বাম পাশে তীব্র চাপ, ভারী ভাব বা জ্বালাপোড়া এবং তা যদি বাম হাত, চোয়াল বা পিঠে ছড়িয়ে পড়ে—তা হৃদরোগের জরুরি লক্ষণ হতে পারে।
তাৎক্ষণিক করণীয়:
১. অবিলম্বে রোগীকে আরামদায়কভাবে হেলান দিয়ে বসিয়ে দিন।
২. দ্রুত নিকটস্থ হাসপাতালের জরুরি বিভাগে নিয়ে যান বা অ্যাম্বুলেন্স ডাকুন।
৩. কোনো শারীরিক পরিশ্রম বা হাঁটাহাঁটি করাবেন না।
(বি.দ্র. সাধারণ গ্যাস্ট্রিকের অস্বস্তিতেও অনেকে বুকে চাপ অনুভব করেন; তবে চিকিৎসকের পরামর্শ গ্রহণ করাই নিরাপদ)।`;
  }

  if (lower.includes('পানি') || lower.includes('water') || lower.includes('হাইড্রেট')) {
    return `দৈনিক পানি পানের প্রয়োজনীয়তা ও নিয়ম:
• একজন প্রাপ্তবয়স্ক মানুষের দৈনিক গড়ে ২ থেকে ২.৫ লিটার (৮ থেকে ১০ গ্লাস) বিশুদ্ধ পানি পান করা উচিত।
• গরমে বা শারীরিক পরিশ্রমের দিনে পানির পরিমাণ কিছুটা বাড়িয়ে ৩ লিটার পর্যন্ত করা যেতে পারে।
• কিডনি ও পরিপাকতন্ত্র সুস্থ রাখতে, ত্বক সতেজ রাখতে এবং মাথাব্যথা প্রতিরোধে সঠিক হাইড্রেশন অপরিহার্য।
💡 টিপস: আমাদের অ্যাপের 'Tools' ট্যাবে থাকা 'Water Tracker' ব্যবহার করে আপনার দৈনিক লক্ষ্য পূরণ করতে পারেন!`;
  }

  if (lower.includes('প্রেসার') || lower.includes('রক্তচাপ') || lower.includes('blood pressure') || lower.includes('হাইপারটেনশন')) {
    return `উচ্চ রক্তচাপ (High BP) নিয়ন্ত্রণে বিশেষজ্ঞ পরামর্শ:
১. খাবারে কাঁচা লবণ ও অতিরিক্ত সোডিয়াম জাতীয় খাবার বর্জন করুন।
২. ধূমপান, জর্দা ও তামাকজাত পণ্য সম্পূর্ণ এড়িয়ে চলুন।
৩. প্রতিদিন অন্তত ৩০ মিনিট হাঁটুন বা হালকা শরীরচর্চা করুন।
৪. মানসিক চাপ কমাতে গভীর শ্বাস-প্রশ্বাসের ব্যায়াম ও পর্যাপ্ত ৭-৮ ঘণ্টা ঘুম নিশ্চিত করুন।
৫. নিয়মিত রক্তচাপ পরিমাপ করে ডায়েরিতে নোট রাখুন এবং চিকিৎসকের দেওয়া ওষুধ নিয়মিত সেবন করুন।`;
  }

  if (lower.includes('খাবার') || lower.includes('ডায়েট') || lower.includes('diet') || lower.includes('ওজন')) {
    return `সুস্থ জীবন ও ওজন নিয়ন্ত্রণের ডায়েট চার্ট:
• সকালের নাস্তা: ওটস বা লাল আটার রুটি, ডিম সেদ্ধ, এবং তাজা ফল।
• দুপুরের খাবার: লাল চালের ভাত (পরিমিত), প্রচুর শাকসবজি, ডাল এবং মাছ বা মুরগির মাংস।
• বিকালের নাস্তা: এক মুঠো বাদাম, চিয়া সিডস বা টক দই।
• রাতের খাবার: হালকা খাবার—সবজি স্যুপ বা রুটি, শোবার অন্তত ২ ঘণ্টা আগে শেষ করুন।
চিনিযুক্ত কোমল পানীয়, ফাস্টফুড ও ডিপ ফ্রাই খাবার পরিহার করুন।`;
  }

  return `আপনার স্বাস্থ্য জিজ্ঞাসার জন্য ধন্যবাদ! 

একটি সুস্থ ও দীর্ঘ জীবনের জন্য প্রতিদিনের কয়েকটি মৌলিক নিয়ম মেনে চলা দরকার:
• পর্যাপ্ত বিশুদ্ধ পানি পান করা (৮-১০ গ্লাস)।
• সুষম পুষ্টিকর খাবার এবং সবুজ শাকসবজি গ্রহণ।
• নিয়মিত ৩০ মিনিট শরীরচর্চা ও শারীরিক গতিশীলতা।
• প্রতিদিন ৭-৮ ঘণ্টা গভীর ঘুম।
• মানসিক চাপমুক্ত থাকা ও পজিটিভ চিন্তা করা।

আপনার নির্দিষ্ট কোনো উপসর্গ বা প্রশ্ন থাকলে (যেমন: জ্বর, সর্দি, গ্যাস্ট্রিক, খাদ্যতালিকা) আমাকে খুলে বলুন। আমি তথ্য দিয়ে সহায়তা করতে প্রস্তুত!
(শিক্ষামূলক তথ্য; এটি সরাসরি প্রেসক্রিপশন নয়)।`;
}
