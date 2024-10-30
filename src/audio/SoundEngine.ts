import { Note, Scale } from './types';

class SoundEngine {
  private audioContext: AudioContext;
  private oscillators: Map<string, OscillatorNode>;
  private gainNodes: Map<string, GainNode>;
  private masterGain: GainNode;
  private bpm: number = 120;
  private baseFrequency: number = 440;

  constructor() {
    this.audioContext = new AudioContext();
    this.oscillators = new Map();
    this.gainNodes = new Map();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.2; // Master volume
  }

  private createOscillator(frequency: number, type: OscillatorType = 'square'): [OscillatorNode, GainNode] {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    return [oscillator, gainNode];
  }

  playNote(note: Note, duration: number = 0.1): void {
    const frequency = this.baseFrequency * Math.pow(2, note / 12);
    const [osc, gain] = this.createOscillator(frequency);
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }

  playArpeggio(scale: Scale, speed: number = 0.1): void {
    scale.forEach((note, index) => {
      setTimeout(() => this.playNote(note), index * speed * 1000);
    });
  }

  playCollectSound(): void {
    const frequency = 880;
    const [osc, gain] = this.createOscillator(frequency, 'sine');
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 2, this.audioContext.currentTime + 0.1);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playShoot(): void {
    const [osc, gain] = this.createOscillator(880, 'sawtooth');
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.1);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playEnemyHit(): void {
    const [osc, gain] = this.createOscillator(220, 'square');
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.2);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  playBattleStart(): void {
    const scale: Scale = [0, 4, 7, 12, 7, 4, 0];
    this.playArpeggio(scale, 0.08);
  }

  startBackgroundMusic(): void {
    const bassline: Scale = [0, 0, 7, 7, 3, 3, 5, 5];
    const melody: Scale = [12, 15, 19, 24, 19, 15, 12, 7];
    
    setInterval(() => {
      this.playArpeggio(bassline, 0.2);
      setTimeout(() => this.playArpeggio(melody, 0.15), 800);
    }, 3200);
  }
}

export const soundEngine = new SoundEngine();