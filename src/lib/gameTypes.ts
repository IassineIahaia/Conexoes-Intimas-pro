export type GameMode = "classic" | "couples" | "group";

export interface GameSetup {
  players: string[];
  mode: GameMode;
  intensity: number;
  soundOn: boolean;
  vibrationOn: boolean;
}

export const defaultGameSetup: GameSetup = {
  players: ["", ""],
  mode: "classic",
  intensity: 50,
  soundOn: true,
  vibrationOn: true,
};

export function intensityLabel(value: number): string {
  if (value < 34) return "Suave";
  if (value < 67) return "Equilibrado";
  return "Provocante";
}

export interface SessionStats {
  cardsPlayed: number;
  durationSeconds: number;
  highlightPlayer: string;
  highlightCount: number;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}