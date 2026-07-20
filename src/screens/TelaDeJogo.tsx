import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import BottomNav from "../components/BottomNav";
import NavDrawer from "../components/NavDrawer";
import GameCard from "../components/GameCard";
import Toggle from "../components/Toggle";
import {
  fetchSessionDeck,
  incrementDrawnCount,
  type Question,
  type SessionDeck,
} from "../lib/questions";
import type { GameSetup, SessionStats } from "../lib/gameTypes";
import { playChime, vibrateShort } from "../lib/feedback";

const navItems = [
  { icon: "home", label: "Início", href: "/inicio" },
  { icon: "layers", label: "Jogo", href: "/jogo" },
  { icon: "favorite", label: "Favoritos", href: "/favoritos" },
  { icon: "settings", label: "Configurações", href: "/configuracoes" },
];

const fallbackSetup: GameSetup = {
  players: ["Jogador 1", "Jogador 2"],
  mode: "classic",
  intensity: 50,
  soundOn: true,
  vibrationOn: true,
};

// Número máximo de cartas por sessão, independente de quantas perguntas
// existirem na base de dados — evita sessões cansativas de centenas de
// cartas. Cada sessão nova sorteia um conjunto diferente.
const SESSION_LENGTH = 12;

const INTENSITY_DISPLAY: Record<string, string> = {
  suave: "Suave",
  equilibrado: "Equilibrado",
  provocante: "Provocante",
};

function intensityKey(value: number): "suave" | "equilibrado" | "provocante" {
  if (value < 34) return "suave";
  if (value < 67) return "equilibrado";
  return "provocante";
}

type Choice = "verdade" | "desafio";

export default function TelaDeJogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const setup = (location.state as GameSetup | undefined) ?? fallbackSetup;

  const players = setup.players.filter((p) => p.trim().length > 0);
  const activePlayers = players.length > 0 ? players : fallbackSetup.players;
  const selectedIntensity = intensityKey(setup.intensity);

  const [deck, setDeck] = useState<SessionDeck>({ truth: [], dare: [] });
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [truthPointer, setTruthPointer] = useState(0);
  const [darePointer, setDarePointer] = useState(0);

  const [round, setRound] = useState(0);
  const [cardIndex, setCardIndex] = useState(0); // só para saber de quem é a vez
  const [phase, setPhase] = useState<"choosing" | "card">("choosing");
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [currentChoice, setCurrentChoice] = useState<Choice | null>(null);

  const [animKey, setAnimKey] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});
  const [categoryCounts, setCategoryCounts] = useState({ verdade: 0, desafio: 0 });
  const [discreteMode, setDiscreteMode] = useState(false);

  useEffect(() => {
    fetchSessionDeck(setup.mode, selectedIntensity)
      .then(setDeck)
      .finally(() => setLoadingDeck(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableTotal = deck.truth.length + deck.dare.length;
  const sessionTarget = Math.min(SESSION_LENGTH, availableTotal);
  const currentPlayer = activePlayers[cardIndex % activePlayers.length];
  const progressPercent = sessionTarget ? (round / sessionTarget) * 100 : 0;

  const truthRemaining = deck.truth.length - truthPointer;
  const dareRemaining = deck.dare.length - darePointer;

  function finishSession(finalCounts: Record<string, number>, finalCategoryCounts: typeof categoryCounts) {
    const highlightEntry = Object.entries(finalCounts).sort((a, b) => b[1] - a[1])[0];
    const stats: SessionStats = {
      cardsPlayed: round,
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
      highlightPlayer: highlightEntry?.[0] ?? currentPlayer,
      highlightCount: highlightEntry?.[1] ?? 1,
      verdades: finalCategoryCounts.verdade,
      desafios: finalCategoryCounts.desafio,
    };
    navigate("/resultados", { state: stats });
  }

  function handleChoice(choice: Choice) {
    const pool = choice === "verdade" ? deck.truth : deck.dare;
    const pointer = choice === "verdade" ? truthPointer : darePointer;
    const card = pool[pointer];

    if (!card) return; // esgotado nesta categoria; os botões já ficam desativados

    if (setup.soundOn) playChime();
    if (setup.vibrationOn) vibrateShort();

    setCurrentCard(card);
    setCurrentChoice(choice);
    setPhase("card");
    if (choice === "verdade") setTruthPointer((p) => p + 1);
    else setDarePointer((p) => p + 1);
    setAnimKey((k) => k + 1);
  }

  function handleNextTurn() {
    if (isLeaving || !currentCard || !currentChoice) return;

    incrementDrawnCount(currentCard.id);

    const updatedPlayerCounts = {
      ...playerCounts,
      [currentPlayer]: (playerCounts[currentPlayer] ?? 0) + 1,
    };
    const updatedCategoryCounts = {
      ...categoryCounts,
      [currentChoice]: categoryCounts[currentChoice] + 1,
    };
    setPlayerCounts(updatedPlayerCounts);
    setCategoryCounts(updatedCategoryCounts);

    const nextRound = round + 1;

    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      if (nextRound >= sessionTarget || truthRemaining + dareRemaining <= 1) {
        finishSession(updatedPlayerCounts, updatedCategoryCounts);
        return;
      }
      setRound(nextRound);
      setCardIndex((i) => i + 1);
      setCurrentCard(null);
      setCurrentChoice(null);
      setPhase("choosing");
    }, 250);
  }

  if (loadingDeck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        A preparar a sua jornada...
      </div>
    );
  }

  if (availableTotal === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-gutter-mobile gap-4">
        <span className="material-symbols-outlined text-primary text-5xl">
          sentiment_dissatisfied
        </span>
        <p className="font-headline-sm text-headline-sm text-on-surface">
          Ainda não há perguntas para este modo e intensidade.
        </p>
        <p className="text-on-surface-variant max-w-sm">
          Adiciona perguntas no painel administrativo ou escolhe outro modo/intensidade no setup.
        </p>
        <button
          onClick={() => navigate("/setup")}
          className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps"
        >
          Voltar à Configuração
        </button>
      </div>
    );
  }

  return (
    <div className="font-body-md selection:bg-primary/30 min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb bg-primary-container w-[600px] h-[600px] -top-48 -left-48" />
        <div
          className="orb bg-secondary-container w-[500px] h-[500px] bottom-0 -right-24"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="orb bg-tertiary-container w-[400px] h-[400px] top-1/2 left-1/2"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      <TopAppBar
        title="Conexões Íntimas"
        rightSlot={
          <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 overflow-hidden bg-primary-container" />
        }
      />
      <NavDrawer
        brandTitle="Conexões Íntimas"
        brandSubtitle="Membro Premium"
        items={navItems}
        activeHref="/jogo"
      />

      <div className="min-h-screen pt-24 pb-32 px-gutter-mobile max-w-container-max mx-auto lg:pl-80 flex flex-col xl:flex-row gap-10 items-start justify-center">
        <aside className="hidden xl:flex flex-col gap-6 w-64 shrink-0">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-lg">group</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Círculo Íntimo
              </span>
            </div>
            <div className="space-y-3">
              {activePlayers.map((player) => {
                const isTurn = player === currentPlayer;
                return (
                  <div key={player} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                        isTurn
                          ? "bg-primary-container border-primary text-on-primary-container"
                          : "bg-surface-container-highest border-outline-variant/20 text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isTurn ? "text-on-surface" : "text-on-surface-variant"
                      }`}
                    >
                      {player}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-3">
              Intensidade da Sessão
            </span>
            <span className="px-3 py-1.5 rounded-full text-[11px] font-label-caps bg-primary-container text-on-primary-container">
              {INTENSITY_DISPLAY[selectedIntensity].toUpperCase()}
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                {discreteMode ? "visibility_off" : "visibility"}
              </span>
              <span className="font-label-caps text-[11px] text-on-surface-variant">
                Modo Discreto
              </span>
            </div>
            <Toggle checked={discreteMode} onChange={setDiscreteMode} />
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto">
          <div className="w-full mb-5 space-y-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Jornada Íntima
              </span>
              <span className="font-label-caps text-label-caps text-primary">
                Rodada {round} / {sessionTarget}
              </span>
            </div>
            <div className="h-[2px] w-full bg-outline-variant/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary progress-glow transition-all duration-1000 ease-in-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {phase === "choosing" && (
            <div
              key={`choice-${animKey}`}
              className="glass-card w-full rounded-[2rem] aspect-[3/4] md:aspect-[4/5] flex flex-col items-center justify-center gap-8 p-8 card-enter"
            >
              <span className="font-label-caps text-label-caps text-secondary tracking-[0.2em] uppercase">
                Para: {currentPlayer}
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface text-center">
                Verdade ou Desafio?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <button
                  onClick={() => handleChoice("verdade")}
                  disabled={truthRemaining <= 0}
                  className="flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl border border-primary/30 bg-primary-container/20 hover:bg-primary-container/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span
                    className="material-symbols-outlined text-primary text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  <span className="font-label-caps text-label-caps text-primary uppercase">
                    Verdade
                  </span>
                  {truthRemaining <= 0 && (
                    <span className="text-[10px] text-on-surface-variant/50">esgotado</span>
                  )}
                </button>
                <button
                  onClick={() => handleChoice("desafio")}
                  disabled={dareRemaining <= 0}
                  className="flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl border border-secondary/30 bg-secondary-container/20 hover:bg-secondary-container/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span
                    className="material-symbols-outlined text-secondary text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                  <span className="font-label-caps text-label-caps text-secondary uppercase">
                    Desafio
                  </span>
                  {dareRemaining <= 0 && (
                    <span className="text-[10px] text-on-surface-variant/50">esgotado</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {phase === "card" && currentCard && (
            <>
              <div
                className="w-full transition-opacity duration-200 ease-in-out"
                style={{ opacity: isLeaving ? 0 : 1 }}
              >
                <GameCard
                  key={animKey}
                  playerName={currentPlayer}
                  mode={currentCard.categoria === "verdade" ? "Verdade" : "Desafio"}
                  prompt={currentCard.texto}
                  intensity={INTENSITY_DISPLAY[currentCard.intensidade]}
                  blurred={discreteMode}
                />
              </div>

              <div className="mt-5 w-full">
                <button
                  onClick={handleNextTurn}
                  className="w-full bg-primary text-on-primary h-16 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all duration-300 active:scale-95 group"
                >
                  <span className="font-label-caps text-label-caps font-bold uppercase tracking-[0.2em]">
                    Próxima Rodada
                  </span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </>
          )}

          <div className="xl:hidden w-full mt-8 glass-card rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                {discreteMode ? "visibility_off" : "visibility"}
              </span>
              <span className="font-label-caps text-[11px] text-on-surface-variant">
                Modo Discreto
              </span>
            </div>
            <Toggle checked={discreteMode} onChange={setDiscreteMode} />
          </div>
        </main>
      </div>

      <BottomNav items={navItems} activeHref="/jogo" />
    </div>
  );
}