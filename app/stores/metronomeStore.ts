import { makeAutoObservable } from "mobx";
import { Audio } from "expo-av";

class MetronomeStore {
  bpm = 100;
  isRunning = false;
  beat = 0;
  interval: NodeJS.Timeout | null = null;
  totalBeats = 4;

  regularSound: Audio.Sound | null = null;
  accentSound: Audio.Sound | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadSounds();
  }

  async loadSounds() {
    const [regular, accent] = await Promise.all([
      Audio.Sound.createAsync(require("../../assets/click.wav")),
      Audio.Sound.createAsync(require("../../assets/click_accent.wav"))
    ]);

    this.regularSound = regular.sound;
    this.accentSound = accent.sound;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const intervalMs = 60_000 / this.bpm;
    this.interval = setInterval(() => this.tick(), intervalMs);
  }

  stop() {
    this.isRunning = false;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.beat = 0;
  }

  async tick() {
    const isAccent = this.beat === 0;
    if (isAccent && this.accentSound) {
      await this.accentSound.replayAsync();
    } else if (!isAccent && this.regularSound) {
      await this.regularSound.replayAsync();
    }

    this.beat = (this.beat + 1) % this.totalBeats;
  }

  setBpm(newBpm: number) {
    this.bpm = newBpm;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  setTimeSignature(beatsPerMeasure: number) {
    this.totalBeats = beatsPerMeasure;
  }
}

export const metronomeStore = new MetronomeStore();
