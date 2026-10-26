// Real HTML5 Canvas & Web Audio Movie Generator Engine
export interface GeneratedMovieResult {
  videoUrl: string;
  blob: Blob;
  fileName: string;
  durationSeconds: number;
}

export async function generateRealMovie(
  themeId: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  onProgress: (percent: number, statusText: string) => void
): Promise<GeneratedMovieResult> {
  const width = aspectRatio === '16:9' ? 640 : 360;
  const height = aspectRatio === '16:9' ? 360 : 640;
  const fps = 30;
  const durationSec = 6;
  const totalFrames = fps * durationSec;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Setup Web Audio synthesized soundtrack
  let audioStream: MediaStreamTrack | null = null;
  let audioContext: AudioContext | null = null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
      const dest = audioContext.createMediaStreamDestination();
      
      // Create musical background tones
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = themeId.includes('মিনা') ? 'triangle' : themeId.includes('গান') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(220, audioContext.currentTime);

      // Simple melody sequence
      const notes = themeId.includes('মিনা') 
        ? [261.63, 293.66, 329.63, 392.00, 329.63, 261.63]
        : themeId.includes('গান')
        ? [220.0, 277.18, 329.63, 440.0, 329.63, 277.18]
        : [196.0, 246.94, 293.66, 392.0, 293.66, 246.94];

      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + idx * 0.9);
      });

      gain.gain.setValueAtTime(0.12, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(audioContext.currentTime + durationSec);

      audioStream = dest.stream.getAudioTracks()[0] || null;
    }
  } catch (err) {
    console.warn('Audio synthesis skipped:', err);
  }

  // Combine Canvas stream with Audio stream
  const canvasStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...(audioStream ? [audioStream] : []),
  ]);

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
    ? 'video/webm'
    : 'video/mp4';

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 2500000,
  });

  const chunks: BlobPart[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.start();

  // Animation render loop
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / fps;
    const progress = Math.round((frame / totalFrames) * 100);
    onProgress(progress, `মুভি সিনারি ফ্রেম রেন্ডারিং হচ্ছে... ${progress}%`);

    renderMovieFrame(ctx, width, height, t, durationSec, themeId);

    // Wait for frame timing
    await new Promise((resolve) => setTimeout(resolve, 1000 / fps));
  }

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(blob);
      const fileName = `Dr_Munna_${themeId}_${Date.now()}.webm`;
      if (audioContext) {
        try { audioContext.close(); } catch {}
      }
      onProgress(100, 'মুভি সফলভাবে তৈরি হয়েছে!');
      resolve({
        videoUrl,
        blob,
        fileName,
        durationSeconds: durationSec,
      });
    };
    mediaRecorder.stop();
  });
}

function renderMovieFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  totalDur: number,
  themeId: string
) {
  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  if (themeId.includes('মিনা') || themeId.includes('কার্টুন')) {
    // 1. MEENA CARTOON ANIMATION
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Sun with rays
    const sunX = w * 0.85;
    const sunY = h * 0.2;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 32 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Green Village Hills
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.quadraticCurveTo(w * 0.4, h * 0.5, w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w * 0.6, h * 0.65, w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Flying Mithu Parrot with animated flapping wings
    const mithuX = (w * 0.2 + (t * 60)) % (w + 80) - 40;
    const mithuY = h * 0.3 + Math.sin(t * 6) * 18;
    const wingAngle = Math.sin(t * 16) * 15;

    ctx.save();
    ctx.translate(mithuX, mithuY);
    // Green parrot body
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Red beak
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(14, -2);
    ctx.lineTo(24, 0);
    ctx.lineTo(14, 5);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(9, -4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Flapping wing
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.ellipse(-2, -wingAngle, 12, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Walking Meena Cartoon Character on the grass
    const meenaX = w * 0.35 + Math.sin(t * 2) * 15;
    const meenaY = h * 0.72;
    const walkBounce = Math.abs(Math.sin(t * 8)) * 8;

    ctx.save();
    ctx.translate(meenaX, meenaY - walkBounce);
    // Yellow/Red Sari dress
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-18, 45);
    ctx.lineTo(0, 0);
    ctx.lineTo(18, 45);
    ctx.fill();
    // Face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -12, 16, 0, Math.PI * 2);
    ctx.fill();
    // Dark hair
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(0, -15, 17, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    // Smile & eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-5, -12, 2, 0, Math.PI * 2);
    ctx.arc(5, -12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -7, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();

    // Cartoon Title & Dialogue Banner at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(15, h - 70, w - 30, 55, 12) : ctx.fillRect(15, h - 70, w - 30, 55);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 মিনা কার্টুন মুভি — শিক্ষামূলক অ্যানিমেশন', w / 2, h - 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('মিঠু: "হাত ধুয়ে খাবো মোরা, সুস্থ দেহ রবে সদা!"', w / 2, h - 25);

  } else if (themeId.includes('গান')) {
    // 2. LIVE STAGE CONCERT
    // Dark stage gradient
    const stageBg = ctx.createLinearGradient(0, 0, 0, h);
    stageBg.addColorStop(0, '#090d16');
    stageBg.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = stageBg;
    ctx.fillRect(0, 0, w, h);

    // Rotating Spotlights
    const spotX1 = w * 0.3 + Math.sin(t * 3) * (w * 0.2);
    const spotX2 = w * 0.7 - Math.cos(t * 3) * (w * 0.2);
    ctx.fillStyle = 'rgba(97, 231, 245, 0.18)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(spotX1 - 50, h);
    ctx.lineTo(spotX1 + 50, h);
    ctx.fill();

    ctx.fillStyle = 'rgba(236, 72, 153, 0.18)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(spotX2 - 50, h);
    ctx.lineTo(spotX2 + 50, h);
    ctx.fill();

    // Dynamic Sound Wave Spectrum Bars
    const barCount = 18;
    const barWidth = (w * 0.8) / barCount;
    const startX = w * 0.1;
    for (let i = 0; i < barCount; i++) {
      const barH = 30 + Math.sin(t * 8 + i * 0.6) * 28 + Math.cos(t * 12 + i) * 20;
      const barGrad = ctx.createLinearGradient(0, h * 0.7 - barH, 0, h * 0.7);
      barGrad.addColorStop(0, '#ec4899');
      barGrad.addColorStop(1, '#61e7f5');
      ctx.fillStyle = barGrad;
      ctx.fillRect(startX + i * barWidth, h * 0.7 - barH, barWidth - 4, barH);
    }

    // Center Singer Silhouette with Microphone
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.55, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 18, h * 0.58, 36, 40);
    // Mic stand
    ctx.strokeStyle = '#61e7f5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 + 10, h * 0.52);
    ctx.lineTo(w / 2 + 10, h * 0.7);
    ctx.stroke();

    // Lyrics overlay
    ctx.fillStyle = 'rgba(11, 16, 32, 0.9)';
    ctx.fillRect(0, h - 65, w, 65);
    ctx.fillStyle = '#61e7f5';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎤 মঞ্চে লাইভ কনসার্ট — ডা. মুন্না মিউজিক', w / 2, h - 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('🎶 "তুমি আমার গানের সুর, তুমি প্রাণের ভাষা..."', w / 2, h - 18);

  } else {
    // 3. POETRY & CINEMATIC DRAMA
    const darkBg = ctx.createLinearGradient(0, 0, 0, h);
    darkBg.addColorStop(0, '#030712');
    darkBg.addColorStop(1, '#0f172a');
    ctx.fillStyle = darkBg;
    ctx.fillRect(0, 0, w, h);

    // Starry night with glowing particles
    for (let i = 0; i < 40; i++) {
      const starX = (i * 37 + t * 15) % w;
      const starY = (i * 29) % (h * 0.6);
      const alpha = 0.4 + Math.sin(t * 4 + i) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(starX, starY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heartbeat ECG Pulse Line across center
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    for (let x = 0; x < w; x += 10) {
      const phase = (x - t * 180) % w;
      let y = h * 0.45;
      if (phase > 100 && phase < 115) y -= 35;
      else if (phase >= 115 && phase < 130) y += 45;
      else if (phase >= 130 && phase < 145) y -= 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Cinematic Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect ? ctx.roundRect(15, h - 80, w - 30, 65, 12) : ctx.fillRect(15, h - 80, w - 30, 65);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎬 ডা. মুন্না সিনেমা ও কাব্য দৃশ্যনাট্য', w / 2, h - 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('📖 "মানবাত্মার সুপ্ত গান নক্ষত্রের মতো আলো ছড়ায়..."', w / 2, h - 25);
  }
}
