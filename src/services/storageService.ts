import { AppSettings, ChatMessage, PillReminderItem } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'dr_munna_settings_v2',
  CHATS: 'dr_munna_chats_v2',
  REMINDERS: 'dr_munna_reminders_v2',
  WATER_INTAKE: 'dr_munna_water_intake',
};

const DEFAULT_SETTINGS: AppSettings = {
  googleApiKey: '',
  backendUrl: '',
  language: 'bn',
  speechRate: 0.95,
  speechPitch: 1.0,
  voiceEnabled: true,
  activeCostume: 'doctor',
};

export const storageService = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getChats(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load chats:', e);
    }
    return [
      {
        id: 'welcome-1',
        role: 'model',
        text: 'আসসালামু আলাইকুম! আমি ডা. মুন্না অ্যাসিস্ট এআই (Dr. Munna Assist AI)। আমি আপনাকে স্বাস্থ্য সচেতনতা, অ্যানাটমি, লক্ষণ পর্যালোচনা এবং সাধারণ সুস্থ জীবনযাপনের পরামর্শ দিতে পারি। আপনি কীভাবে অনুভব করছেন বা আপনার কোনো স্বাস্থ্য জিজ্ঞাসা আছে কি?',
        timestamp: Date.now(),
      },
    ];
  },

  saveChats(chats: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats.slice(-40)));
    } catch (e) {
      console.error('Failed to save chats:', e);
    }
  },

  getReminders(): PillReminderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load reminders:', e);
    }
    return [
      {
        id: '1',
        medicineName: 'ক্যালসিয়াম ও ভিটামিন ডি৩',
        dosage: '১টি ট্যাবলেট',
        time: '০৮:০০ AM',
        frequency: 'প্রতিদিন সকালে খাওয়ার পর',
        isActive: true,
        notes: 'হাড়ের সুস্থতার জন্য',
      },
      {
        id: '2',
        medicineName: 'ওমেগা-৩ ফিশ অয়েল',
        dosage: '১টি ক্যাপসুল',
        time: '০৮:৩০ PM',
        frequency: 'রাতে খাবারের পর',
        isActive: true,
        notes: 'হার্ট ও রক্ত সঞ্চালন ভালো রাখতে',
      },
    ];
  },

  saveReminders(reminders: PillReminderItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.error('Failed to save reminders:', e);
    }
  },

  getWaterIntake(): { date: string; glasses: number } {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const data = localStorage.getItem(STORAGE_KEYS.WATER_INTAKE);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.date === today) return parsed;
      }
      return { date: today, glasses: 0 };
    } catch {
      return { date: new Date().toISOString().slice(0, 10), glasses: 0 };
    }
  },

  saveWaterIntake(glasses: number): void {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.WATER_INTAKE, JSON.stringify({ date: today, glasses }));
    } catch (e) {
      console.error('Failed to save water intake:', e);
    }
  },
};
