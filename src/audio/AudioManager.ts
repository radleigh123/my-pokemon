import lab from "@/assets/music/1-06. Birch Pokémon Lab.mp3";
import littleroot from "@/assets/music/1-05. Littleroot Town.mp3";
import route1 from "@/assets/music/1-11. Route 101.mp3";
import battle from "@/assets/music/1-09. Battle! (Wild Pokémon).mp3";
import wildBattle from "@/assets/music/1-09. Battle! (Wild Pokémon).mp3";
import victory from "@/assets/music/1-10. Victory! (Wild Pokémon).mp3";
import button from "@/assets/music/sounds/pokemon-a-button.mp3";

import { Music } from "./Music";
import { Sound } from "./Sound";

export class AudioManager {
  private readonly player = new Audio();
  private readonly sounds = new Map<Sound, string>([[Sound.Button, button]]);

  private readonly tracks = new Map<Music, string>([
    [Music.Lab, lab],
    [Music.LittlerootTown, littleroot],
    [Music.Route1, route1],
    [Music.Battle, battle],
    [Music.WildBattle, wildBattle],
    [Music.Victory, victory],
  ]);

  private current?: Music;

  constructor() {
    this.player.loop = true;
    this.player.volume = 0.4;
  }

  public async play(music: Music): Promise<void> {
    if (this.current === music && !this.player.paused) {
      return;
    }

    if (this.current !== music) {
      this.player.pause();
      this.player.src = this.tracks.get(music)!;
      this.player.currentTime = 0;
      this.current = music;
    }

    try {
      await this.player.play();
    } catch {
      // Browser blocked autoplay until user interaction.
    }
  }

  public playSound(sound: Sound): void {
    const src = this.sounds.get(sound);

    if (!src) {
      return;
    }

    // New Audio so effects can overlap
    const audio = new Audio(src);

    // audio.volume = 0.6;

    audio.play().catch(() => {});
  }

  public stop(): void {
    this.player.pause();
    this.player.currentTime = 0;
    this.current = undefined;
  }

  public setVolume(volume: number): void {
    this.player.volume = volume;
  }

  public button(): void {
    this.playSound(Sound.Button);
  }
}
