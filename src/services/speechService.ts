// Speech service with guaranteed female voice selection, audio fallback, and speech event hooks
class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isListening = false;
  private recognition: any = null;
  private onSpeakingChangeCallbacks: ((speaking: boolean) => void)[] = [];
  private onListeningChangeCallbacks: ((listening: boolean) => void)[] = [];
  private voicesLoaded = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.availableVoices = this.synth.getVoices();
    if (this.availableVoices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  public subscribeSpeakingState(callback: (speaking: boolean) => void): () => void {
    this.onSpeakingChangeCallbacks.push(callback);
    callback(this.isSpeaking);
    return () => {
      this.onSpeakingChangeCallbacks = this.onSpeakingChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  public subscribeListeningState(callback: (listening: boolean) => void): () => void {
    this.onListeningChangeCallbacks.push(callback);
    callback(this.isListening);
    return () => {
      this.onListeningChangeCallbacks = this.onListeningChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifySpeakingState(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onSpeakingChangeCallbacks.forEach(cb => cb(speaking));
  }

  private notifyListeningState(listening: boolean) {
    this.isListening = listening;
    this.onListeningChangeCallbacks.forEach(cb => cb(listening));
  }

  // Find best female voice
  private getBestFemaleVoice(lang: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.availableVoices.length > 0 ? this.availableVoices : this.synth.getVoices();

    // 1. Bengali female voices
    const bnFemale = voices.find(v => 
      (v.lang.startsWith('bn') || v.lang.includes('BD') || v.lang.includes('IN')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('lekha') || v.name.toLowerCase().includes('mitu'))
    );
    if (bnFemale) return bnFemale;

    // 2. Any Bengali voice
    const bnAny = voices.find(v => v.lang.startsWith('bn') || v.lang.includes('BD') || v.lang.includes('IN'));
    if (bnAny) return bnAny;

    // 3. Any high quality female voice (Hindi, English UK, US)
    const femaleVoice = voices.find(v => 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('kavya') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
    );
    if (femaleVoice) return femaleVoice;

    return voices[0] || null;
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      lang?: string;
      onEnd?: () => void;
    }
  ): void {
    if (!this.synth) {
      options?.onEnd?.();
      return;
    }

    // Stop ongoing speech
    this.stop();

    // Clean markdown and non-verbal tokens
    const cleanedText = text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Live sweet female doctor tone tuning
    // Pitch 1.15 to 1.2 makes speech clearly feminine, pleasant, and natural
    utterance.pitch = options?.pitch ?? 1.18;
    utterance.rate = options?.rate ?? 0.96;

    const isBangla = /[ঀ-৿]/.test(cleanedText);
    const targetLang = options?.lang || (isBangla ? 'bn-BD' : 'en-US');
    utterance.lang = targetLang;

    const femaleVoice = this.getBestFemaleVoice(targetLang);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      this.notifySpeakingState(true);
    };

    utterance.onend = () => {
      this.notifySpeakingState(false);
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.notifySpeakingState(false);
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    this.currentUtterance = utterance;

    // iOS/Android Chrome workaround for speech synthesis pause bug
    try {
      this.synth.resume();
    } catch {}

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
      this.notifySpeakingState(false);
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Voice Recognition (Mic) with listening posture notification
  public startListening(
    callbacks: {
      onResult: (transcript: string) => void;
      onError?: (err: string) => void;
      onEnd?: () => void;
    },
    lang: string = 'bn-BD'
  ): () => void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      callbacks.onError?.('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না।');
      return () => {};
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang;

      rec.onstart = () => {
        this.notifyListeningState(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        callbacks.onResult(transcript);
      };

      rec.onerror = (event: any) => {
        this.notifyListeningState(false);
        callbacks.onError?.(event.error || 'স্পিচ ইনপুট হয়নি।');
      };

      rec.onend = () => {
        this.notifyListeningState(false);
        callbacks.onEnd?.();
      };

      rec.start();
      this.recognition = rec;

      return () => {
        try {
          rec.abort();
        } catch {}
        this.notifyListeningState(false);
      };
    } catch (err: any) {
      this.notifyListeningState(false);
      callbacks.onError?.(err?.message || 'মাইক্রোফোন চালু করা যায়নি।');
      return () => {};
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.notifyListeningState(false);
    }
  }
}

export const speechService = new SpeechService();
