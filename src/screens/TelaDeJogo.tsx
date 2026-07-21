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
  type QuestionIntensity,
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

// Ordem de progressão dos níveis — sempre a subir, nunca desce.
const LEVEL_ORDER: QuestionIntensity[] = ["suave", "equilibrado", "provocante"];

// Quantas cartas fazem uma "rodada" dentro de um nível, antes de fazer uma
// pausa com checkpoint. Evita sessões de 300 cartas seguidas mesmo quando
// o nível tem muito conteúdo disponível.
const ROUND_SIZE = 32;

const INTENSITY_DISPLAY: Record<QuestionIntensity, string> = {
  suave: "Suave",
  equilibrado: "Equilibrado",
  provocante: "Provocante",
};

function intensityKey(value: number): QuestionIntensity {
  if (value < 34) return "suave";
  if (value < 67) return "equilibrado";
  return "provocante";
}

type Choice = "verdade" | "desafio";
type Phase =
  | "loading-level"
  | "choosing"
  | "card"
  | "round-complete"
  | "level-complete"
  | "no-questions";

interface Summary {
  cardsPlayed: number;
  winner: string;
  winnerCount: number;
}

export default function TelaDeJogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const setup = (location.state as GameSetup | undefined) ?? fallbackSetup;

  const players = setup.players.filter((p) => p.trim().length > 0);
  const activePlayers = players.length > 0 ? players : fallbackSetup.players;

  const startingLevelIndex = LEVEL_ORDER.indexOf(intensityKey(setup.intensity));

  const [levelIndex, setLevelIndex] = useState(startingLevelIndex);
  const [deck, setDeck] = useState<SessionDeck>({ truth: [], dare: [] });
  const [truthPointer, setTruthPointer] = useState(0);
  const [darePointer, setDarePointer] = useState(0);

  const [phase, setPhase] = useState<Phase>("loading-level");
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [currentChoice, setCurrentChoice] = useState<Choice | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [discreteMode, setDiscreteMode] = useState(false);

  const [cardIndex, setCardIndex] = useState(0); // define de quem é a vez

  // Contadores da rodada atual (lote de ROUND_SIZE, reinicia a cada checkpoint)
  const [roundCardsPlayed, setRoundCardsPlayed] = useState(0);
  const [roundPlayerCounts, setRoundPlayerCounts] = useState<Record<string, number>>({});
  const [lastRoundSummary, setLastRoundSummary] = useState<Summary | null>(null);

  // Contadores do nível (soma todas as rodadas desse nível)
  const [levelCardsPlayed, setLevelCardsPlayed] = useState(0);
  const [levelPlayerCounts, setLevelPlayerCounts] = useState<Record<string, number>>({});
  const [lastLevelSummary, setLastLevelSummary] = useState<Summary | null>(null);

  // Contadores acumulados da sessão inteira (todos os níveis somados)
  const [startTime] = useState(() => Date.now());
  const [totalPlayerCounts, setTotalPlayerCounts] = useState<Record<string, number>>({});
  const [totalCategoryCounts, setTotalCategoryCounts] = useState({ verdade: 0, desafio: 0 });
  const [totalCardsPlayed, setTotalCardsPlayed] = useState(0);

  const currentIntensity = LEVEL_ORDER[levelIndex];
  const currentPlayer = activePlayers[cardIndex % activePlayers.length];

  function loadLevel() {
    setPhase("loading-level");
    setTruthPointer(0);
    setDarePointer(0);
    setLevelCardsPlayed(0);
    setLevelPlayerCounts({});
    setRoundCardsPlayed(0);
    setRoundPlayerCounts({});
    fetchSessionDeck(setup.mode, LEVEL_ORDER[levelIndex]).then((newDeck) => {
      setDeck(newDeck);
      setPhase(newDeck.truth.length + newDeck.dare.length > 0 ? "choosing" : "no-questions");
    });
  }

  useEffect(() => {
    loadLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  const truthRemaining = deck.truth.length - truthPointer;
  const dareRemaining = deck.dare.length - darePointer;
  const nextLevelIndex = levelIndex + 1;
  const hasNextLevel = nextLevelIndex < LEVEL_ORDER.length;

  function handleChoice(choice: Choice) {
    const pool = choice === "verdade" ? deck.truth : deck.dare;
    const pointer = choice === "verdade" ? truthPointer : darePointer;
    const card = pool[pointer];
    if (!card) return;

    if (setup.soundOn) playChime();
    if (setup.vibrationOn) vibrateShort();

    setCurrentCard(card);
    setCurrentChoice(choice);
    setPhase("card");
    setAnimKey((k) => k + 1);
  }

  function handleSkipCard() {
    if (!currentChoice) return;
    const pool = currentChoice === "verdade" ? deck.truth : deck.dare;
    const pointer = currentChoice === "verdade" ? truthPointer : darePointer;
    const nextPointer = pointer + 1;
    const nextCard = pool[nextPointer];

    if (!nextCard) {
      setPhase("choosing");
      setCurrentCard(null);
      setCurrentChoice(null);
      return;
    }

    if (currentChoice === "verdade") setTruthPointer(nextPointer);
    else setDarePointer(nextPointer);
    setCurrentCard(nextCard);
    setAnimKey((k) => k + 1);
  }

  function winnerFrom(counts: Record<string, number>): [string, number] {
    const entry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return [entry?.[0] ?? currentPlayer, entry?.[1] ?? 0];
  }

  function endSession() {
    const [winner, count] = winnerFrom(totalPlayerCounts);
    const stats: SessionStats = {
      cardsPlayed: totalCardsPlayed,
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
      highlightPlayer: winner,
      highlightCount: count,
      verdades: totalCategoryCounts.verdade,
      desafios: totalCategoryCounts.desafio,
    };
    navigate("/resultados", { state: stats });
  }

  function handleNextTurn() {
    if (isLeaving || !currentCard || !currentChoice) return;

    incrementDrawnCount(currentCard.id);

    const updatedRoundCounts = {
      ...roundPlayerCounts,
      [currentPlayer]: (roundPlayerCounts[currentPlayer] ?? 0) + 1,
    };
    const updatedLevelCounts = {
      ...levelPlayerCounts,
      [currentPlayer]: (levelPlayerCounts[currentPlayer] ?? 0) + 1,
    };
    const updatedTotalPlayerCounts = {
      ...totalPlayerCounts,
      [currentPlayer]: (totalPlayerCounts[currentPlayer] ?? 0) + 1,
    };
    const updatedTotalCategoryCounts = {
      ...totalCategoryCounts,
      [currentChoice]: totalCategoryCounts[currentChoice] + 1,
    };
    const newRoundCardsPlayed = roundCardsPlayed + 1;
    const newLevelCardsPlayed = levelCardsPlayed + 1;

    setRoundPlayerCounts(updatedRoundCounts);
    setLevelPlayerCounts(updatedLevelCounts);
    setTotalPlayerCounts(updatedTotalPlayerCounts);
    setTotalCategoryCounts(updatedTotalCategoryCounts);
    setRoundCardsPlayed(newRoundCardsPlayed);
    setLevelCardsPlayed(newLevelCardsPlayed);
    setTotalCardsPlayed((n) => n + 1);

    // truthPointer/darePointer já refletem o estado pós-sorteio da carta
    // atual, por isso já dizem se sobra algo para a próxima rodada.
    const levelExhausted = truthRemaining <= 0 && dareRemaining <= 0;
    const roundBatchComplete = newRoundCardsPlayed % ROUND_SIZE === 0;

    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      setCurrentCard(null);
      setCurrentChoice(null);
      setCardIndex((i) => i + 1);

      if (levelExhausted) {
        const [winner, count] = winnerFrom(updatedLevelCounts);
        setLastLevelSummary({ cardsPlayed: newLevelCardsPlayed, winner, winnerCount: count });
        setPhase("level-complete");
      } else if (roundBatchComplete) {
        const [winner, count] = winnerFrom(updatedRoundCounts);
        setLastRoundSummary({ cardsPlayed: newRoundCardsPlayed, winner, winnerCount: count });
        setPhase("round-complete");
      } else {
        setPhase("choosing");
      }
    }, 250);
  }

  function handleContinueSameLevel() {
    setRoundCardsPlayed(0);
    setRoundPlayerCounts({});
    setPhase("choosing");
  }

  function handleAdvanceLevel() {
    if (!hasNextLevel) {
      endSession();
      return;
    }
    setLevelIndex(nextLevelIndex);
  }

  const totalInLevel = deck.truth.length + deck.dare.length;
  const progressPercent = totalInLevel ? (levelCardsPlayed / totalInLevel) * 100 : 0;

  if (phase === "loading-level") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        A preparar o nível {INTENSITY_DISPLAY[currentIntensity].toLowerCase()}...
      </div>
    );
  }

  if (phase === "no-questions") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-gutter-mobile gap-4">
        <span className="material-symbols-outlined text-primary text-5xl">
          sentiment_dissatisfied
        </span>
        <p className="font-headline-sm text-headline-sm text-on-surface">
          Ainda não há perguntas de nível "{INTENSITY_DISPLAY[currentIntensity]}" para este modo.
        </p>
        <p className="text-on-surface-variant max-w-sm">
          Adiciona perguntas no painel administrativo, ou tenta outro modo no setup.
        </p>
        <div className="flex gap-3">
          {hasNextLevel && (
            <button
              onClick={handleAdvanceLevel}
              className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps"
            >
              Tentar nível seguinte
            </button>
          )}
          <button
            onClick={() => navigate("/setup")}
            className="mt-4 border border-outline-variant/40 text-on-surface-variant px-8 py-3 rounded-full font-label-caps text-label-caps"
          >
            Voltar à Configuração
          </button>
        </div>
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
          <button
            onClick={endSession}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[10px] uppercase tracking-widest"
          >
            Terminar sessão
          </button>
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
              Progresso de Níveis
            </span>
            <div className="flex flex-col gap-2">
              {LEVEL_ORDER.map((lvl, idx) => (
                <div key={lvl} className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      idx < levelIndex
                        ? "text-emerald-400"
                        : idx === levelIndex
                          ? "text-primary"
                          : "text-on-surface-variant/30"
                    }`}
                  >
                    {idx < levelIndex
                      ? "check_circle"
                      : idx === levelIndex
                        ? "radio_button_checked"
                        : "radio_button_unchecked"}
                  </span>
                  <span
                    className={`text-[11px] font-label-caps ${
                      idx === levelIndex ? "text-on-surface" : "text-on-surface-variant/50"
                    }`}
                  >
                    {INTENSITY_DISPLAY[lvl]}
                  </span>
                </div>
              ))}
            </div>
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
          {(phase === "choosing" || phase === "card") && (
            <div className="w-full mb-5 space-y-4">
              <div className="flex justify-between items-end mb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Nível {INTENSITY_DISPLAY[currentIntensity]} · Rodada {Math.floor(levelCardsPlayed / ROUND_SIZE) + 1}
                </span>
                <span className="font-label-caps text-label-caps text-primary">
                  {levelCardsPlayed} / {totalInLevel} cartas
                </span>
              </div>
              <div className="h-[2px] w-full bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary progress-glow transition-all duration-1000 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

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

              <div className="mt-5 w-full flex items-center gap-3">
                <button
                  onClick={handleSkipCard}
                  className="flex flex-col items-center gap-1 group shrink-0"
                  title="Trocar por outra carta desta categoria"
                >
                  <div className="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant transition-all duration-300 group-hover:border-primary group-hover:text-primary group-active:scale-90">
                    <span className="material-symbols-outlined">fast_forward</span>
                  </div>
                  <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase">
                    Trocar
                  </span>
                </button>

                <button
                  onClick={handleNextTurn}
                  className="flex-1 bg-primary text-on-primary h-16 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all duration-300 active:scale-95 group"
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

          {phase === "round-complete" && lastRoundSummary && (
            <div className="glass-card w-full rounded-[2rem] p-10 flex flex-col items-center text-center gap-6">
              <span className="material-symbols-outlined text-secondary text-5xl">stars</span>
              <div>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">
                  Rodada concluída
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {lastRoundSummary.winner} liderou esta rodada!
                </h2>
                <p className="text-on-surface-variant mt-2">
                  {lastRoundSummary.cardsPlayed} cartas jogadas nesta rodada · nível{" "}
                  {INTENSITY_DISPLAY[currentIntensity]}
                </p>
                <p className="text-on-surface-variant/60 text-sm mt-1">
                  Faltam {totalInLevel - levelCardsPlayed} cartas neste nível
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
                <button
                  onClick={handleContinueSameLevel}
                  className="bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps shadow-lg hover:brightness-110 transition-all"
                >
                  Continuar neste nível
                </button>
                <div className="flex gap-3">
                  {hasNextLevel && (
                    <button
                      onClick={handleAdvanceLevel}
                      className="flex-1 border border-primary/40 text-primary py-3 rounded-full font-label-caps text-[11px] hover:bg-primary/5 transition-all"
                    >
                      Avançar nível
                    </button>
                  )}
                  <button
                    onClick={endSession}
                    className="flex-1 border border-outline-variant/40 text-on-surface-variant py-3 rounded-full font-label-caps text-[11px] hover:bg-surface-variant/10 transition-all"
                  >
                    Terminar sessão
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === "level-complete" && lastLevelSummary && (
            <div className="glass-card w-full rounded-[2rem] p-10 flex flex-col items-center text-center gap-6">
              <span className="material-symbols-outlined text-primary text-5xl">military_tech</span>
              <div>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">
                  Nível {INTENSITY_DISPLAY[currentIntensity]} concluído
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {lastLevelSummary.winner} venceu este nível!
                </h2>
                <p className="text-on-surface-variant mt-2">
                  {lastLevelSummary.cardsPlayed} cartas jogadas no total · {lastLevelSummary.winnerCount}{" "}
                  respondidas por {lastLevelSummary.winner}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-4">
                {hasNextLevel ? (
                  <>
                    <button
                      onClick={handleAdvanceLevel}
                      className="flex-1 bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps shadow-lg hover:brightness-110 transition-all"
                    >
                      Avançar para {INTENSITY_DISPLAY[LEVEL_ORDER[nextLevelIndex]]}
                    </button>
                    <button
                      onClick={endSession}
                      className="flex-1 border border-outline-variant/40 text-on-surface-variant py-4 rounded-full font-label-caps text-label-caps hover:bg-surface-variant/10 transition-all"
                    >
                      Terminar aqui
                    </button>
                  </>
                ) : (
                  <button
                    onClick={endSession}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps shadow-lg hover:brightness-110 transition-all"
                  >
                    Ver Resultados Finais
                  </button>
                )}
              </div>
            </div>
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