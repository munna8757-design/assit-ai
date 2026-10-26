export type NavigationTab = 'Home' | 'AI Chat' | 'Learn' | 'Studio' | 'Tools';

export type AvatarCostumeId = 'doctor' | 'sari' | 'threepiece' | 'casual' | 'professional';

export interface AvatarCostume {
  id: AvatarCostumeId;
  label: string;
  labelBn: string;
  image: string;
  roleDescription: string;
  badge: string;
  accentColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  model?: string;
  isAudioPlaying?: boolean;
}

export type AnatomyTab = 'human' | 'organs' | 'skeleton';

export interface OrganDetail {
  id: string;
  nameBn: string;
  nameEn: string;
  summary: string;
  details: string[];
  clinicalNote: string;
  iconName: string;
  category: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  category: 'সব বিষয়' | 'অ্যানাটমি' | 'প্রজনন স্বাস্থ্য' | 'সম্পর্ক ও সুরক্ষা' | 'সুরক্ষা ও প্রতিরোধ' | 'সাধারণ স্বাস্থ্য';
  details: string[];
  clinicalNote: string;
  iconColor: string;
}

export type StudioTab = 'video' | 'text' | 'image';

export interface StudioPreset {
  id: string;
  label: string;
  iconName: string;
  promptExample: string;
  generatedSample: string;
}

export interface PillReminderItem {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  isActive: boolean;
  notes?: string;
}

export interface AppSettings {
  googleApiKey: string;
  backendUrl: string;
  language: 'bn' | 'en' | 'hi';
  speechRate: number;
  speechPitch: number;
  voiceEnabled: boolean;
  activeCostume: AvatarCostumeId;
}
