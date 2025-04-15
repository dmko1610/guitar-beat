import { makeAutoObservable, runInAction } from "mobx";

export type Phase = "inhale" | "hold" | "exhale" | "ready";

class BreathingStore {
  phase: Phase = "ready";
  duration = { inhale: 4, hold: 7, exhale: 8 };
  isRunning = false;

  private interval: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.setPhase("inhale");
    this.runBreathingCycle();
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    // if (this.interval) {
    //   clearInterval(this.interval);
    //   this.interval = null;
    // }
    // this.setPhase("ready");
  }

  resetPhase() {
    runInAction(() => {
      this.phase = "ready";
      this.isRunning = false;
    });
  }

  private async runBreathingCycle() {
    while (this.isRunning) {
      await this.waitForPhaseToEnd();
      this.nextPhase();
    }
  }

  private async waitForPhaseToEnd() {
    const phaseDuration =
      this.duration[this.phase as Exclude<Phase, "ready">] || 0;

    return new Promise((resolve) => {
      setTimeout(resolve, phaseDuration * 1000);
    });
  }

  private nextPhase() {
    if (this.phase === "inhale") {
      this.setPhase("hold");
    } else if (this.phase === "hold") {
      this.setPhase("exhale");
    } else {
      this.setPhase("inhale");
    }
  }

  private setPhase(phase: Phase) {
    runInAction(() => {
      this.phase = phase;
    });
  }
}

export const breathingStore = new BreathingStore();
