import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import GameCard from "../components/GameCard";
import Button from "../components/Button";
import {
  createQuestion,
  updateQuestion,
  fetchAllQuestions,
  type QuestionCategory,
  type QuestionIntensity,
  type QuestionMode,
} from "../lib/questions";

const MODE_OPTIONS: { value: QuestionMode; label: string }[] = [
  { value: "classic", label: "Clássico" },
  { value: "couples", label: "Casais" },
  { value: "group", label: "Grupo" },
];

const INTENSITY_OPTIONS: { value: QuestionIntensity; label: string }[] = [
  { value: "suave", label: "Suave" },
  { value: "equilibrado", label: "Equilibrado" },
  { value: "provocante", label: "Provocante" },
];

export default function QuestionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<QuestionCategory>("verdade");
  const [intensidade, setIntensidade] = useState<QuestionIntensity>("equilibrado");
  const [modos, setModos] = useState<QuestionMode[]>(["classic"]);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAllQuestions().then((all) => {
      const found = all.find((q) => q.id === id);
      if (found) {
        setTexto(found.texto);
        setCategoria(found.categoria);
        setIntensidade(found.intensidade);
        setModos(found.modos);
        setTags(found.tags.join(", "));
      }
      setLoading(false);
    });
  }, [id]);

  function toggleModo(modo: QuestionMode) {
    setModos((current) =>
      current.includes(modo) ? current.filter((m) => m !== modo) : [...current, modo]
    );
  }

  async function handleSubmit(e: FormEvent, status: "ativa" | "inativa") {
    e.preventDefault();
    setSaving(true);
    const payload = {
      texto: texto.trim(),
      categoria,
      intensidade,
      modos,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing && id) {
        await updateQuestion(id, payload);
      } else {
        await createQuestion(payload);
      }
      navigate("/admin/perguntas");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Editor" activeHref="/admin/perguntas">
        <p className="text-on-surface-variant">A carregar pergunta...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Editor" activeHref="/admin/perguntas">
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Editor</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
            {isEditing ? "Editar Questão" : "Nova Questão"}
          </span>
        </nav>
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Refinar Intimidade
        </h2>
        <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mt-2">
          Crie momentos de vulnerabilidade e conexão através de provocações cuidadosamente
          elaboradas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        <section className="xl:col-span-7 space-y-8">
          <form className="glass-card p-8 rounded-3xl space-y-10">
            <div className="space-y-4">
              <label className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                Texto da Pergunta
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                maxLength={200}
                placeholder="Ex: Qual foi o momento em que você se sentiu mais conectado(a) comigo esta semana?"
                className="w-full bg-surface-container-low border-x-0 border-t-0 border-b border-outline-variant text-body-lg font-body-lg p-4 resize-none transition-all duration-300 focus:outline-none focus:border-primary"
              />
              <div className="flex justify-between items-center text-on-surface-variant/50 text-xs font-label-caps">
                <span>RECOMENDADO: 50-150 CARACTERES</span>
                <span className={texto.length > 180 ? "text-error" : undefined}>
                  {texto.length}/200
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                  Categoria
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCategoria("verdade")}
                    className={`flex-1 py-3 border rounded-xl font-label-caps text-label-caps transition-all ${
                      categoria === "verdade"
                        ? "bg-primary-container/40 text-primary border-primary"
                        : "border-outline-variant hover:bg-primary-container/20"
                    }`}
                  >
                    VERDADE
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoria("desafio")}
                    className={`flex-1 py-3 border rounded-xl font-label-caps text-label-caps transition-all ${
                      categoria === "desafio"
                        ? "bg-primary-container/40 text-primary border-primary"
                        : "border-outline-variant hover:bg-primary-container/20"
                    }`}
                  >
                    DESAFIO
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                  Intensidade
                </label>
                <select
                  value={intensidade}
                  onChange={(e) => setIntensidade(e.target.value as QuestionIntensity)}
                  className="w-full bg-surface-container-low border-x-0 border-t-0 border-b border-outline-variant text-body-md font-body-md p-3 transition-all focus:outline-none focus:border-primary"
                >
                  {INTENSITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                Modos de Jogo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MODE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 glass-panel p-4 rounded-xl cursor-pointer hover:bg-surface-variant/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={modos.includes(opt.value)}
                      onChange={() => toggleModo(opt.value)}
                      className="rounded text-primary focus:ring-primary bg-surface-container"
                    />
                    <span className="font-label-caps text-label-caps">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                Tags (separadas por vírgula)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="romance, primeira-vez, aniversário"
                className="w-full bg-surface-container-low border-x-0 border-t-0 border-b border-outline-variant text-body-md font-body-md p-3 transition-all focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button
                variant="primary"
                disabled={saving || texto.trim().length === 0}
                onClick={(e) => handleSubmit(e, "ativa")}
              >
                {saving ? "A publicar..." : "PUBLICAR AGORA"}
              </Button>
              <Button
                variant="secondary"
                disabled={saving || texto.trim().length === 0}
                onClick={(e) => handleSubmit(e, "inativa")}
              >
                SALVAR RASCUNHO
              </Button>
            </div>
          </form>
        </section>

        <aside className="xl:col-span-5 flex flex-col items-center">
          <div className="sticky top-28 w-full max-w-[340px]">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                PREVIEW AO VIVO
              </span>
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary font-bold">MOBILE APP</span>
              </div>
            </div>
            <GameCard
              playerName="Pré-visualização"
              mode={categoria === "verdade" ? "Verdade" : "Desafio"}
              prompt={texto || "Insira sua pergunta para visualizar..."}
              intensity={INTENSITY_OPTIONS.find((o) => o.value === intensidade)?.label ?? ""}
            />
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}