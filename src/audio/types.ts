export type Note = number; // Semitones from A4 (440Hz)
export type Scale = Note[];

export interface SoundEffects {
  collect: () => void;
  battle: () => void;
  win: () => void;
  lose: () => void;
}