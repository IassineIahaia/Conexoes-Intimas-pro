import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "install-prompt-dismissed";

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "true") return;

    if (isIos()) {
      setPlatform("ios");
      setVisible(true);
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "true");
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-md">
      <div className="glass-card rounded-2xl p-5 flex items-start gap-4 shadow-2xl">
        <span className="material-symbols-outlined text-primary text-3xl">
          {platform === "ios" ? "ios_share" : "install_mobile"}
        </span>
        <div className="flex-1">
          <p className="font-body-md text-on-surface font-medium mb-1">
            Instala o Conexões Íntimas
          </p>
          {platform === "ios" ? (
            <p className="text-sm text-on-surface-variant">
              Toca em <span className="text-primary">Partilhar</span> e depois em{" "}
              <span className="text-primary">"Adicionar à Tela de Início"</span>.
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Acesso mais rápido, ecrã inteiro, sem barra do browser.
            </p>
          )}
          <div className="flex gap-3 mt-3">
            {platform === "android" && (
              <button
                onClick={handleInstall}
                className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-xs font-label-caps"
              >
                Instalar
              </button>
            )}
            <button
              onClick={dismiss}
              className="text-on-surface-variant/60 text-xs font-label-caps px-2"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}