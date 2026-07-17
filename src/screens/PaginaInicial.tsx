import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import BottomNav from "../components/BottomNav";
import NavDrawer from "../components/NavDrawer";
import FeatureCard from "../components/FeatureCard";
import InstallPrompt from "../components/InstallPrompt";

const navItems = [
  { icon: "home", label: "Início", href: "/inicio" },
  { icon: "explore", label: "Explorar", href: "/explorar" },
  { icon: "favorite", label: "Favoritos", href: "/favoritos" },
  { icon: "settings", label: "Configurações", href: "/configuracoes" },
];

export default function PaginaInicial() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <TopAppBar
        title="Conexões Íntimas"
        rightSlot={
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 bg-primary-container" />
        }
      />
      <InstallPrompt />
      <NavDrawer
        brandTitle="Conexões Íntimas"
        brandSubtitle="Membro Premium"
        items={navItems}
        activeHref="/inicio"
      />

      <main className="pt-24 pb-32 lg:pl-80 min-h-screen relative overflow-hidden">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <section className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop text-center mb-16 md:mb-24">
          <div className="mb-6">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] uppercase">
              Experiência Sensorial
            </span>
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-8 max-w-2xl mx-auto leading-tight italic">
            Redescubram o desejo em cada carta
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10">
            Uma jornada íntima desenhada para casais que buscam profundidade, conexão e momentos
            inesquecíveis em um ambiente seguro e sofisticado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/setup")}
              className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-wider luminous-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Começar Jogada
            </button>
            <button className="bg-transparent border border-outline-variant/40 text-on-surface-variant px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-surface-variant/20 hover:border-primary/40 transition-all duration-300">
              Como Funciona
            </button>
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="layers"
              title="Modos de Jogo"
              description="Escolha entre níveis de intensidade: do suave ao profundo, adaptando-se ao humor do casal."
              ctaLabel="EXPLORAR MODOS"
              delay="0s"
            />
            <FeatureCard
              icon="favorite"
              title="Momentos Únicos"
              description="Curadoria de dinâmicas que transformam uma noite comum em uma memória eterna."
              ctaLabel="VER GALERIA"
              delay="1s"
            />
            <FeatureCard
              icon="verified_user"
              title="Privacidade Total"
              description="Criptografia de ponta a ponta. Seus momentos íntimos permanecem apenas entre vocês."
              ctaLabel="SAIBA MAIS"
              delay="2s"
            />
          </div>
        </section>

        <div className="mt-24 max-w-container-max mx-auto px-gutter-mobile opacity-40">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
      </main>

      <BottomNav items={navItems} activeHref="/inicio" />
    </div>
  );
}