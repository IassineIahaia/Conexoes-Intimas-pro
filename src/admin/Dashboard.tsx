import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAllQuestions, type Question } from "../lib/questions";

const INTENSITY_COLORS: Record<string, string> = {
  suave: "#ffb2b8",
  equilibrado: "#f6b99e",
  provocante: "#92484f",
};

const INTENSITY_LABELS: Record<string, string> = {
  suave: "Suave",
  equilibrado: "Equilibrado",
  provocante: "Provocante",
};

const LOW_CONTENT_THRESHOLD = 5;

export default function Dashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllQuestions()
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []);

  const total = questions.length;
  const active = questions.filter((q) => q.status === "ativa");
  const verdades = questions.filter((q) => q.categoria === "verdade").length;
  const desafios = questions.filter((q) => q.categoria === "desafio").length;

  const intensityCounts = {
    suave: active.filter((q) => q.intensidade === "suave").length,
    equilibrado: active.filter((q) => q.intensidade === "equilibrado").length,
    provocante: active.filter((q) => q.intensidade === "provocante").length,
  };

  const activeTotal = active.length || 1;
  const intensityEntries = Object.entries(intensityCounts) as [
    keyof typeof intensityCounts,
    number,
  ][];

  let cumulative = 0;
  const donutSegments = intensityEntries.map(([key, count]) => {
    const percent = (count / activeTotal) * 100;
    const segment = {
      key,
      percent,
      offset: -cumulative,
      color: INTENSITY_COLORS[key],
    };
    cumulative += percent;
    return segment;
  });

  const lowContentAlerts = intensityEntries.filter(([, count]) => count < LOW_CONTENT_THRESHOLD);

  return (
    <AdminLayout title="Dashboard" activeHref="/admin">
      <div className="mb-10">
        <p className="font-label-caps text-label-caps text-primary mb-2">Visão Geral do Sistema</p>
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Estatísticas do Banco de Dados
        </h3>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">A carregar estatísticas...</p>
      ) : (
        <>
          {lowContentAlerts.length > 0 && (
            <div className="mb-8 p-5 rounded-xl border border-error/30 bg-error-container/10 flex items-start gap-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <div>
                <p className="font-body-md text-error font-bold mb-1">Conteúdo baixo detectado</p>
                <p className="text-sm text-on-surface-variant">
                  As seguintes intensidades têm menos de {LOW_CONTENT_THRESHOLD} perguntas ativas:{" "}
                  {lowContentAlerts.map(([key]) => INTENSITY_LABELS[key]).join(", ")}.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-2xl md:col-span-2 flex flex-col justify-between relative overflow-hidden">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">
                  Total de Perguntas
                </p>
                <h4 className="text-5xl font-display-lg text-primary mt-2">{total}</h4>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <span className="text-on-surface-variant/40 text-xs uppercase tracking-tighter">
                  {active.length} ativas · {total - active.length} inativas
                </span>
              </div>
              <div className="absolute top-6 right-6 opacity-10">
                <span className="material-symbols-outlined" style={{ fontSize: 80 }}>
                  database
                </span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-l-secondary">
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">
                Verdades
              </p>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">{verdades}</h4>
              <div className="w-full bg-surface-variant/30 h-1 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full shadow-[0_0_10px_#f6b99e]"
                  style={{ width: `${total ? (verdades / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-l-primary">
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">
                Desafios
              </p>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">{desafios}</h4>
              <div className="w-full bg-surface-variant/30 h-1 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full shadow-[0_0_10px_#ffb2b8]"
                  style={{ width: `${total ? (desafios / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col max-w-md">
            <h5 className="font-headline-sm text-headline-sm text-on-surface mb-8">
              Níveis de Intensidade (ativas)
            </h5>
            <div className="space-y-6 mb-10">
              {intensityEntries.map(([key, count]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: INTENSITY_COLORS[key] }}
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {INTENSITY_LABELS[key]}
                    </span>
                  </div>
                  <span className="font-label-caps text-label-caps text-primary">{count}</span>
                </div>
              ))}
            </div>

            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="16" stroke="#2a2a29" strokeWidth="2" />
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    stroke={segment.color}
                    strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                    strokeDashoffset={segment.offset}
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-label-caps text-on-surface-variant/60">TOTAL ATIVAS</span>
                <span className="text-xl font-bold text-on-surface">{active.length}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}