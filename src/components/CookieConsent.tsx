import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";

export type ConsentValue = "accepted" | "rejected";

export function getStoredConsent(): ConsentValue | null {
  return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) {
      setVisible(true);
    }
  }, []);

  function handleChoice(value: ConsentValue) {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    // Recarrega para que scripts de anúncios/analytics respeitem a escolha
    // desde o primeiro carregamento seguinte.
    window.location.reload();
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[70] p-4 md:p-6">
      <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-5 shadow-2xl border border-outline-variant/20">
        <span className="material-symbols-outlined text-primary text-3xl shrink-0">cookie</span>
        <p className="text-sm text-on-surface-variant flex-1 text-center md:text-left">
          Usamos cookies essenciais e, com a sua permissão, cookies de publicidade para manter o
          Conexões Íntimas funcional e sustentável. Podes ler mais na nossa{" "}
          <a href="/privacidade" className="text-primary underline">
            Política de Privacidade
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice("rejected")}
            className="border border-outline-variant/40 text-on-surface-variant px-5 py-2.5 rounded-full text-xs font-label-caps hover:bg-surface-variant/20 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full text-xs font-label-caps hover:brightness-110 transition-all"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}