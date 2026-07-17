import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import BottomNav from "../components/BottomNav";
import NavDrawer from "../components/NavDrawer";

const navItems = [
  { icon: "home", label: "Início", href: "/inicio" },
  { icon: "explore", label: "Explorar", href: "/explorar" },
  { icon: "favorite", label: "Favoritos", href: "/favoritos" },
  { icon: "settings", label: "Configurações", href: "/configuracoes" },
];

interface ComingSoonProps {
  title: string;
  icon: string;
  description: string;
}

export default function ComingSoon({ title, icon, description }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
        activeHref={navItems.find((i) => i.label === title)?.href ?? "/inicio"}
      />

      <main className="pt-24 pb-32 lg:pl-80 min-h-screen flex flex-col items-center justify-center px-gutter-mobile text-center">
        <div className="glass-card p-10 rounded-3xl max-w-md flex flex-col items-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-6">{icon}</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">{title}</h2>
          <p className="font-body-md text-on-surface-variant mb-8">{description}</p>
          <button
            onClick={() => navigate("/inicio")}
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-caps text-label-caps hover:scale-105 transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </main>

      <BottomNav items={navItems} activeHref={navItems.find((i) => i.label === title)?.href ?? "/inicio"} />
    </div>
  );
}