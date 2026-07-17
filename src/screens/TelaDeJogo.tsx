import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import BottomNav from "../components/BottomNav";
import NavDrawer from "../components/NavDrawer";
import GameCard from "../components/GameCard";
import { fetchQuestionsForSession, incrementDrawnCount, type Question } from "../lib/questions";
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

const INTENSITY_LABEL: Record<string, string> = {
  suave: "Suave",
  equilibrado: "Equilibrado",
  provocante: "Provocante",
};

function intensityRank(value: number): number {
  if (value < 34) return 1;
  if (value < 67) return 2;
  return 3;
}

export default function TelaDeJogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const setup = (location.state as GameSetup | undefined) ?? fallbackSetup;

  const players = setup.players.filter((p) => p.trim().length > 0);
  const activePlayers = players.length > 0 ? players : fallbackSetup.players;

  const [deck, setDeck] = useState<Question[]>([]);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [round, setRound] = useState(1);
  const [cardIndex, setCardIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchQuestionsForSession(setup.mode, intensityRank(setup.intensity))
      .then((questions) => {
        // Baralha as perguntas para cada sessão ser diferente
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
      })
      .finally(() => setLoadingDeck(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRounds = deck.length;
  const currentCard = deck[cardIndex % (deck.length || 1)];
  const currentPlayer = activePlayers[cardIndex % activePlayers.length];
  const progressPercent = totalRounds ? (round / totalRounds) * 100 : 0;

  function advanceCard(onComplete: () => void) {
    if (isLeaving) return;

    if (setup.soundOn) playChime();
    if (setup.vibrationOn) vibrateShort();

    setIsLeaving(true);
    setTimeout(() => {
      onComplete();
      setIsLeaving(false);
      setAnimKey((k) => k + 1);
    }, 250);
  }

  function goToNext() {
    if (currentCard) {
      incrementDrawnCount(currentCard.id);
    }

    const updatedCounts = {
      ...playerCounts,
      [currentPlayer]: (playerCounts[currentPlayer] ?? 0) + 1,
    };
    setPlayerCounts(updatedCounts);

    advanceCard(() => {
      if (round >= totalRounds) {
        const highlightEntry = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1])[0];
        const stats: SessionStats = {
          cardsPlayed: round,
          durationSeconds: Math.round((Date.now() - startTime) / 1000),
          highlightPlayer: highlightEntry?.[0] ?? currentPlayer,
          highlightCount: highlightEntry?.[1] ?? 1,
        };
        navigate("/resultados", { state: stats });
        return;
      }
      setRound((r) => r + 1);
      setCardIndex((i) => i + 1);
    });
  }

  function goToSkip() {
    advanceCard(() => {
      setCardIndex((i) => i + 1);
    });
  }

  if (loadingDeck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        A preparar a sua jornada...
      </div>
    );
  }

  if (totalRounds === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-gutter-mobile gap-4">
        <span className="material-symbols-outlined text-primary text-5xl">sentiment_dissatisfied</span>
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

      <main className="min-h-screen pt-24 pb-32 px-gutter-mobile flex flex-col items-center justify-center max-w-container-max mx-auto lg:pl-80">
        <div className="w-full max-w-md mb-5 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Jornada Íntima
            </span>
            <span className="font-label-caps text-label-caps text-primary">
              Rodada {round} / {totalRounds}
            </span>
          </div>
          <div className="h-[2px] w-full bg-outline-variant/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary progress-glow transition-all duration-1000 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div
          className="w-full max-w-lg transition-opacity duration-200 ease-in-out"
          style={{ opacity: isLeaving ? 0 : 1 }}
        >
          {currentCard && (
            <GameCard
              key={animKey}
              playerName={currentPlayer}
              mode={currentCard.categoria === "verdade" ? "Verdade" : "Desafio"}
              prompt={currentCard.texto}
              intensity={INTENSITY_LABEL[currentCard.intensidade]}
            />
          )}
        </div>

        <div className="mt-5 w-full max-w-lg flex items-center justify-between gap-2">
          <button onClick={goToSkip} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant transition-all duration-300 group-hover:border-primary group-hover:text-primary group-active:scale-90">
              <span className="material-symbols-outlined">fast_forward</span>
            </div>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">
              Pular
            </span>
          </button>

          <button
            onClick={goToNext}
            className="flex-1 bg-primary text-on-primary h-16 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all duration-300 active:scale-95 group"
          >
            <span className="font-label-caps text-label-caps font-bold uppercase tracking-[0.2em] ml-4">
              Próxima
            </span>
            <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant transition-all duration-300 group-hover:border-primary group-hover:text-primary group-active:scale-90">
              <span className="material-symbols-outlined">pause</span>
            </div>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">
              Pausar
            </span>
          </button>
        </div>
      </main>

      <BottomNav items={navItems} activeHref="/jogo" />
    </div>
  );
}