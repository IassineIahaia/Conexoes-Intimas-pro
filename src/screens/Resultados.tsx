import { useLocation, useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import BottomNav from "../components/BottomNav";
import NavDrawer from "../components/NavDrawer";
import type { SessionStats } from "../lib/gameTypes";
import { formatDuration } from "../lib/gameTypes";

const navItems = [
  { icon: "home", label: "Início", href: "/inicio" },
  { icon: "layers", label: "Jogo", href: "/jogo" },
  { icon: "favorite", label: "Favoritos", href: "/favoritos" },
  { icon: "settings", label: "Configurações", href: "/configuracoes" },
];

const fallbackStats: SessionStats = {
  cardsPlayed: 0,
  durationSeconds: 0,
  highlightPlayer: "—",
  highlightCount: 0,
};

export default function Resultados() {
  const navigate = useNavigate();
  const location = useLocation();
  const stats = (location.state as SessionStats | undefined) ?? fallbackStats;

  return (
    <div className="min-h-screen flex flex-col items-center bg-background">
      <TopAppBar
        title="Conexões Íntimas"
        rightSlot={
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden" />
        }
      />
      <NavDrawer
        brandTitle="Conexões Íntimas"
        brandSubtitle="Membro Premium"
        items={navItems}
        activeHref="/jogo"
      />

      <main className="w-full max-w-container-max px-gutter-mobile md:px-gutter-desktop pt-32 pb-40 flex flex-col items-center lg:pl-80">
        <header className="text-center mb-16 max-w-2xl">
          <span className="font-label-caps text-label-caps text-primary mb-4 block animate-pulse">
            SESSÃO FINALIZADA
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
            Uma Jornada de Descobertas
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant/80">
            O tempo compartilhado é a semente de uma conexão mais profunda.
            Guarde estas memórias com carinho.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          <div className="md:col-span-4 glass-card p-8 rounded-3xl flex flex-col justify-between items-start group hover:border-primary/40 transition-all duration-500">
            <div className="mb-8">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">
                style
              </span>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                CARTAS JOGADAS
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-6xl text-primary font-bold">
                {stats.cardsPlayed}
              </span>
              <span className="font-body-md text-on-surface-variant/60">
                desafios
              </span>
            </div>
          </div>

          <div className="md:col-span-8 glass-card p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/40 transition-all duration-500 overflow-hidden relative">
            <div className="z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">
                schedule
              </span>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                DURAÇÃO DA SESSÃO
              </p>
            </div>
            <div className="z-10 mt-8">
              <span className="font-headline-md text-6xl text-primary font-bold">
                {formatDuration(stats.durationSeconds)}
              </span>
              <span className="font-body-md text-on-surface-variant/60 ml-2">
                de intimidade
              </span>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[12rem] text-primary">
                auto_awesome
              </span>
            </div>
          </div>

          <div className="md:col-span-7 glass-card p-8 rounded-3xl group hover:border-primary/40 transition-all duration-500">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-4">
                  volunteer_activism
                </span>
                <p className="font-label-caps text-label-caps text-on-surface-variant">
                  DESTAQUE DA SESSÃO
                </p>
              </div>
              <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                  Mais Audacioso
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary p-1 bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-4xl">
                    person
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {stats.highlightPlayer}
                </h3>
                <p className="font-body-md text-on-surface-variant/60">
                  Liderou com {stats.highlightCount} carta
                  {stats.highlightCount === 1 ? "" : "s"} "Quentes"
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-all duration-500 cursor-pointer">
            <button className="flex flex-col items-center" type="button">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">
                  share
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-2 text-on-surface">
                Compartilhar
              </h4>
              <p className="font-body-md text-on-surface-variant/60 px-4">
                Espalhe a essência dessa conexão com quem você ama.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center gap-6 w-full max-w-lg">
          <button
            onClick={() => navigate("/setup")}
            type="button"
            className="w-full py-5 px-10 bg-primary text-on-primary rounded-full font-label-caps text-label-caps tracking-widest hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(255,178,184,0.3)] group flex items-center justify-center gap-3"
          >
            JOGAR NOVAMENTE
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              refresh
            </span>
          </button>
          <button
            onClick={() => navigate("/inicio")}
            type="button"
            className="w-full py-5 px-10 border border-primary/40 text-primary rounded-full font-label-caps text-label-caps tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-3"
          >
            IR PARA O INÍCIO
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </main>

      <BottomNav items={navItems} activeHref="/jogo" />
    </div>
  );
}
