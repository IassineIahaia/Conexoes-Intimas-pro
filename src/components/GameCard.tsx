interface GameCardProps {
  playerName: string;
  mode: "Verdade" | "Desafio";
  prompt: string;
  intensity: string;
}

export default function GameCard({ playerName, mode, prompt, intensity }: GameCardProps) {
  const icon = mode === "Verdade" ? "favorite" : "bolt";

  return (
    <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-[4/5] card-enter">
      <div className="glass-card absolute inset-0 rounded-[2rem] flex flex-col items-center justify-center p-8 md:p-12 text-center group cursor-pointer overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        </div>

        <div className="relative z-10 flex flex-col items-center h-full w-full">
          <div className="mb-auto">
            <span className="block font-label-caps text-label-caps text-secondary mb-2 tracking-[0.2em] uppercase">
              Para: {playerName}
            </span>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary-container/30 border border-primary/10">
              <span
                className="material-symbols-outlined text-primary text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
              <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                {mode}
              </span>
            </div>
          </div>

          <div className="my-auto px-4">
            <p className="font-headline-md text-headline-md md:text-[36px] leading-snug text-on-surface italic">
              "{prompt}"
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="px-6 py-2 rounded-full border border-outline-variant/30 text-on-surface-variant font-label-caps text-[10px] tracking-widest uppercase">
              Intensidade: {intensity}
            </div>
          </div>
        </div>

        <div className="absolute top-8 right-8 opacity-20">
          <span className="material-symbols-outlined text-4xl">auto_awesome</span>
        </div>
      </div>
    </div>
  );
}