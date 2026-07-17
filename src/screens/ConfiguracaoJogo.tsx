import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Toggle from "../components/Toggle";
import {
  type GameMode,
  type GameSetup,
  defaultGameSetup,
  intensityLabel,
} from "../lib/gameTypes";

const modes: { value: GameMode; icon: string; title: string; description: string }[] = [
  { value: "classic", icon: "auto_awesome", title: "Clássico", description: "Diversão e descoberta equilibrada." },
  { value: "couples", icon: "favorite", title: "Casais", description: "Intimidade e conexão profunda." },
  { value: "group", icon: "groups", title: "Grupo", description: "Provocações e risadas coletivas." },
];

export default function ConfiguracaoJogo() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [setup, setSetup] = useState<GameSetup>(defaultGameSetup);

  function updatePlayer(index: number, value: string) {
    const players = [...setup.players];
    players[index] = value;
    setSetup({ ...setup, players });
  }

  function addPlayer() {
    setSetup({ ...setup, players: [...setup.players, ""] });
  }

 function handleNext() {
  if (step < 3) {
    setStep(step + 1);
  } else {
    navigate("/jogo", { state: setup });
  }
}

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/inicio");
    }
  }

  return (
    <div className="font-body-md text-body-md min-h-screen bg-background text-on-background overflow-x-hidden">
      <div className="bg-orb bg-primary-container top-[-100px] left-[-100px]" />
      <div className="bg-orb bg-tertiary-container bottom-[-100px] right-[-100px]" />

      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-outline-variant/10 h-16 flex items-center px-gutter-mobile">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest">Voltar</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm tracking-tight text-primary">Configuração</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-gutter-mobile max-w-2xl mx-auto min-h-screen flex flex-col">
        <ProgressBar currentStep={step} totalSteps={3} />

        <div className="flex-grow">
          {step === 1 && (
            <section className="step-transition">
              <div className="mb-10">
                <h2 className="font-display-lg-mobile text-display-lg-mobile mb-3 leading-tight">
                  Quem participará desta jornada?
                </h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                  Identifique as conexões presentes.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                {setup.players.map((player, index) => (
                  <div key={index} className="relative group">
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-4 px-0 transition-all font-body-lg text-body-lg placeholder:text-on-surface-variant/30"
                      placeholder={`Nome do Jogador ${index + 1}`}
                      value={player}
                      onChange={(e) => updatePlayer(index, e.target.value)}
                      type="text"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addPlayer}
                type="button"
                className="flex items-center gap-3 text-secondary font-label-caps text-label-caps hover:text-primary transition-colors py-2 group"
              >
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">
                  add_circle
                </span>
                <span>ADICIONAR JOGADOR</span>
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="step-transition">
              <div className="mb-10">
                <h2 className="font-display-lg-mobile text-display-lg-mobile mb-3">Escolha o Clima</h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                  Selecione a essência da experiência.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {modes.map((m) => {
                  const checked = setup.mode === m.value;
                  return (
                    <label key={m.value} className="relative cursor-pointer group">
                      <input
                        checked={checked}
                        onChange={() => setSetup({ ...setup, mode: m.value })}
                        className="peer sr-only"
                        name="mode"
                        type="radio"
                        value={m.value}
                      />
                      <div
                        className={`glass-card p-6 rounded-xl flex items-center justify-between transition-all ${
                          checked ? "border-secondary/50 bg-secondary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
                            <span className="material-symbols-outlined text-3xl">{m.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-headline-sm text-headline-sm">{m.title}</h3>
                            <p className="text-on-surface-variant text-sm">{m.description}</p>
                          </div>
                        </div>
                        <span
                          className={`material-symbols-outlined text-secondary transition-opacity ${
                            checked ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          check_circle
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="step-transition">
              <div className="mb-10">
                <h2 className="font-display-lg-mobile text-display-lg-mobile mb-3">Intensidade</h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
                  Defina o calor da experiência.
                </p>

                <div className="glass-card p-10 rounded-2xl mb-12 flex flex-col items-center">
                  <div className="text-center mb-8">
                    <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] uppercase block mb-2">
                      {intensityLabel(setup.intensity)}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto" />
                  </div>
                  <input
                    className="w-full appearance-none cursor-pointer intensity-gradient"
                    max={100}
                    min={1}
                    type="range"
                    value={setup.intensity}
                    onChange={(e) => setSetup({ ...setup, intensity: Number(e.target.value) })}
                  />
                  <div className="flex justify-between w-full mt-4">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Suave
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Provocante
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">volume_up</span>
                    <span className="font-body-md">Sons de Imersão</span>
                  </div>
                  <Toggle checked={setup.soundOn} onChange={(v) => setSetup({ ...setup, soundOn: v })} />
                </div>
                <div className="glass-card p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">vibration</span>
                    <span className="font-body-md">Vibração Háptica</span>
                  </div>
                  <Toggle
                    checked={setup.vibrationOn}
                    onChange={(v) => setSetup({ ...setup, vibrationOn: v })}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col gap-4 z-20">
        <div className="max-w-2xl mx-auto w-full flex flex-col md:flex-row gap-4">
          <button
            onClick={handleNext}
            type="button"
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps tracking-widest py-5 rounded-full shadow-[0_8px_30px_rgba(114,47,55,0.4)] hover:shadow-[0_12px_40px_rgba(114,47,55,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            {step < 3 ? (
              <>
                <span>PRÓXIMO PASSO</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </>
            ) : (
              <>
                <span>INICIAR EXPERIÊNCIA</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_fix_high
                </span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}