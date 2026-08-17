"use client";

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.6;
  private sfxVolume: number = 0.8;
  private currentMood: string = "silence";
  private intervalId: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("plot_muted");
      const savedMusicVol = localStorage.getItem("plot_music_vol");
      const savedSfxVol = localStorage.getItem("plot_sfx_vol");

      if (savedMute !== null) this.isMuted = savedMute === "true";
      if (savedMusicVol !== null) this.musicVolume = parseFloat(savedMusicVol);
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
        this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;

        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("plot_muted", String(muted));
    }
    if (this.musicGain) this.musicGain.gain.value = muted ? 0 : this.musicVolume;
    if (this.sfxGain) this.sfxGain.gain.value = muted ? 0 : this.sfxVolume;
    if (this.bgmAudio) this.bgmAudio.muted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("plot_music_vol", String(this.musicVolume));
    }
    if (this.musicGain && !this.isMuted) {
      this.musicGain.gain.value = this.musicVolume;
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.musicVolume;
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("plot_sfx_vol", String(this.sfxVolume));
    }
    if (this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public playSfx(sfxType: string) {
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      if (sfxType === "stat_up" || sfxType === "heartbeat_love" || sfxType === "cheer") {
        // High sparkle chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.sfxGain!);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.45);
        });
      } else if (sfxType === "stat_down" || sfxType === "tension_drop") {
        // Descending low tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.5);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (sfxType === "heartbeat" || sfxType === "gasp") {
        // Deep thumping pulse
        [0, 0.18].forEach((offset) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(75, now + offset);
          osc.frequency.exponentialRampToValueAtTime(45, now + offset + 0.12);
          gain.gain.setValueAtTime(0.4 * this.sfxVolume, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxGain!);
          osc.start(now + offset);
          osc.stop(now + offset + 0.16);
        });
      } else if (sfxType === "camera_click" || sfxType === "glass_break" || sfxType === "door_slam") {
        // Impact noise burst
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = sfxType === "door_slam" ? "lowpass" : "highpass";
        filter.frequency.setValueAtTime(sfxType === "door_slam" ? 300 : 2000, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(now);
      } else if (sfxType === "coin_spent" || sfxType === "diamond_spent") {
        // Coin chime
        [987.77, 1318.51].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.25 * this.sfxVolume, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain!);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.4);
        });
      } else {
        // Soft subtle UI dialogue advance click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.05 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Graceful fallback if audio context blocked
    }
  }

  public playBgm(moodOrUrl: string) {
    if (this.currentMood === moodOrUrl) return;
    this.stopBgm();
    this.currentMood = moodOrUrl;

    if (moodOrUrl === "silence" || !moodOrUrl) return;

    if (moodOrUrl.startsWith("http") || moodOrUrl.startsWith("/")) {
      try {
        this.bgmAudio = new Audio(moodOrUrl);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.musicVolume;
        this.bgmAudio.muted = this.isMuted;
        this.bgmAudio.play().catch(() => {});
      } catch {}
      return;
    }

    // Synthesize Ambient Cinematic Mood Chords (Ethereal Ambient Loop)
    try {
      this.initCtx();
      if (!this.ctx || !this.musicGain) return;

      const chords: Record<string, number[]> = {
        romantic: [261.63, 329.63, 392.0, 493.88], // Cmaj7 warm pad
        dramatic: [220.0, 261.63, 329.63, 415.3], // Am(maj7) moody
        tense: [185.0, 220.0, 277.18, 311.13], // Diminished tension
        mystery: [196.0, 246.94, 293.66, 369.99], // Gmaj7#11
        sad: [174.61, 220.0, 261.63, 329.63], // Fmaj7 melancholy
        triumphant: [261.63, 329.63, 392.0, 523.25], // C major bright
      };

      const notes = chords[moodOrUrl] || chords.romantic;
      const now = this.ctx.currentTime;

      notes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Gentle LFO slow pulse
        gain.gain.setValueAtTime(0.04 * this.musicVolume, now);

        osc.connect(gain);
        gain.connect(this.musicGain!);
        osc.start(now);
        this.currentOscillators.push(osc);
      });
    } catch {}
  }

  public stopBgm() {
    this.currentOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.currentOscillators = [];
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.src = "";
      this.bgmAudio = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentMood = "silence";
  }
}

export const soundManager = new SoundManager();
