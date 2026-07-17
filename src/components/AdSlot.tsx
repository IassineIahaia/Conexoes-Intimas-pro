import { useEffect, useRef } from "react";
import { getStoredConsent } from "./CookieConsent";

interface AdSlotProps {
  slotId: string;
  label?: string;
}

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === "true";
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID;

/**
 * Slot de anúncio genérico. Em desenvolvimento (ou enquanto VITE_ADS_ENABLED
 * não estiver "true"), ou se o utilizador recusou cookies, mostra uma caixa
 * reservada em vez de um anúncio real.
 *
 * Quando tiveres uma rede aprovada (AdSense ou outra), troca só o conteúdo
 * do bloco "if (shouldShowRealAd)" — o resto da app nunca precisa de mudar,
 * porque todos os sítios onde há anúncios usam este mesmo componente.
 */
export default function AdSlot({ slotId, label = "Publicidade" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const consent = getStoredConsent();
  const shouldShowRealAd = ADS_ENABLED && Boolean(ADSENSE_CLIENT) && consent === "accepted";

  useEffect(() => {
    if (!shouldShowRealAd) return;
    try {
      // @ts-expect-error - adsbygoogle é injetado pelo script externo do AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silencioso: falha aqui não deve derrubar a app
    }
  }, [shouldShowRealAd]);

  if (!shouldShowRealAd) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-dashed border-outline-variant/30 min-h-[100px]">
        <span className="font-label-caps text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
          {label} (espaço reservado)
        </span>
        <span className="text-xs text-on-surface-variant/30">slot: {slotId}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <span className="font-label-caps text-[9px] text-on-surface-variant/40 uppercase tracking-widest self-start">
        {label}
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}