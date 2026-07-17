import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerificacaoIdade() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setOrbOffset({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function handleEnter() {
    setLeaving(true);
    setTimeout(() => navigate("/inicio"), 800);
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center overflow-hidden font-body-md relative">
      {/* Background Orbs */}
      <div
        className="orb w-[500px] h-[500px] bg-primary-container -top-40 -left-20"
        style={{ transform: `translate(${orbOffset.x * 20}px, ${orbOffset.y * 20}px)` }}
      />
      <div
        className="orb w-[400px] h-[400px] bg-on-tertiary-fixed-variant -bottom-20 -right-20"
        style={{
          animationDelay: "-5s",
          transform: `translate(${orbOffset.x * 40}px, ${orbOffset.y * 40}px)`,
        }}
      />
      <div className="orb w-[300px] h-[300px] bg-secondary-container top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      {/* Main Content */}
      <main
        className="relative z-10 w-full max-w-lg px-gutter-mobile flex flex-col items-center transition-all duration-700"
        style={leaving ? { opacity: 0, transform: "scale(0.98)" } : undefined}
      >
        <div className="mb-12 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter mb-2">
            Conexões Íntimas
          </h1>
          <div className="h-px w-12 bg-primary mx-auto opacity-40" />
        </div>

        <div className="glass-card w-full rounded-xl p-10 md:p-12 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-6 opacity-80">
            lock
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
            Espaço Reservado
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
            Este ambiente foi desenhado para experiências sensoriais e diálogos adultos.
            <br className="hidden md:block" />
            Sua privacidade é nosso compromisso.
          </p>

          <button
            onClick={handleEnter}
            className="group relative w-full overflow-hidden rounded-full bg-primary-container py-5 transition-all duration-500 hover:bg-primary-container/80 active:scale-95 premium-glow"
          >
            <span className="relative z-10 font-label-caps text-label-caps text-on-primary-container tracking-widest">
              SOU MAIOR DE 18 ANOS
            </span>
            <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-primary/20 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
          </button>

          <button className="mt-6 font-label-caps text-label-caps text-on-surface-variant/60 hover:text-primary transition-colors duration-300">
            SAIR DO SITE
          </button>
        </div>

        <div className="mt-12 flex items-center gap-4 text-on-surface-variant/40">
          <span className="h-px w-8 bg-current" />
          <span className="font-label-caps text-[10px]">EDITORIAL EXPERIENCE v1.0</span>
          <span className="h-px w-8 bg-current" />
        </div>
      </main>

      <footer
        className="fixed bottom-8 w-full text-center px-gutter-mobile z-10 transition-opacity duration-500"
        style={leaving ? { opacity: 0 } : undefined}
      >
        <p className="font-label-caps text-[10px] text-on-surface-variant/40 max-w-md mx-auto leading-loose">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
          <br />
          Acesso proibido para menores de 18 anos sob qualquer circunstância.
        </p>
      </footer>
    </div>
  );
}