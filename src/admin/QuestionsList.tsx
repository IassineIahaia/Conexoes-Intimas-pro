import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import IconButton from "../components/IconButton";
import {
  fetchAllQuestions,
  toggleQuestionStatus,
  createQuestion,
  deleteQuestion,
  type Question,
  type QuestionCategory,
  type QuestionIntensity,
} from "../lib/questions";

const PAGE_SIZE = 10;

const INTENSITY_DOT: Record<QuestionIntensity, string> = {
  suave: "bg-primary shadow-[0_0_8px_rgba(255,178,184,0.5)]",
  equilibrado: "bg-secondary shadow-[0_0_8px_rgba(246,185,158,0.5)]",
  provocante: "bg-on-tertiary-container shadow-[0_0_8px_rgba(255,150,117,0.5)]",
};

const INTENSITY_LABEL: Record<QuestionIntensity, string> = {
  suave: "Suave",
  equilibrado: "Equilibrado",
  provocante: "Provocante",
};

export default function QuestionsList() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | "todas">("todas");
  const [intensityFilter, setIntensityFilter] = useState<QuestionIntensity | "todas">("todas");
  const [statusFilter, setStatusFilter] = useState<"ativa" | "inativa" | "todas">("todas");
  const [page, setPage] = useState(1);

  function reload() {
    setLoading(true);
    fetchAllQuestions()
      .then(setQuestions)
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (categoryFilter !== "todas" && q.categoria !== categoryFilter) return false;
      if (intensityFilter !== "todas" && q.intensidade !== intensityFilter) return false;
      if (statusFilter !== "todas" && q.status !== statusFilter) return false;
      if (search.trim() && !q.texto.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [questions, categoryFilter, intensityFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleToggleStatus(q: Question) {
    await toggleQuestionStatus(q.id, q.status);
    reload();
  }

  async function handleDuplicate(q: Question) {
    await createQuestion({
      texto: q.texto,
      categoria: q.categoria,
      intensidade: q.intensidade,
      modos: q.modos,
      status: "inativa",
      tags: q.tags,
    });
    reload();
  }

  async function handleDelete(q: Question) {
    if (!confirm("Apagar esta pergunta definitivamente? Esta ação não pode ser desfeita.")) return;
    await deleteQuestion(q.id);
    reload();
  }

  return (
    <AdminLayout title="Perguntas" activeHref="/admin/perguntas">
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="grid grid-cols-2 md:flex gap-4 items-end flex-1">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-label-caps text-on-surface-variant text-[10px]">Categoria</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as QuestionCategory | "todas");
                setPage(1);
              }}
              className="bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 px-4 text-sm text-on-surface focus:border-primary transition-all"
            >
              <option value="todas">Todas</option>
              <option value="verdade">Verdade</option>
              <option value="desafio">Desafio</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-label-caps text-on-surface-variant text-[10px]">Intensidade</label>
            <select
              value={intensityFilter}
              onChange={(e) => {
                setIntensityFilter(e.target.value as QuestionIntensity | "todas");
                setPage(1);
              }}
              className="bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 px-4 text-sm text-on-surface focus:border-primary transition-all"
            >
              <option value="todas">Todas</option>
              <option value="suave">Suave</option>
              <option value="equilibrado">Equilibrado</option>
              <option value="provocante">Provocante</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1 hidden md:flex">
            <label className="font-label-caps text-on-surface-variant text-[10px]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "ativa" | "inativa" | "todas");
                setPage(1);
              }}
              className="bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 px-4 text-sm text-on-surface focus:border-primary transition-all"
            >
              <option value="todas">Todos</option>
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/perguntas/nova")}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-caps text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nova Questão
        </button>
      </section>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por conteúdo..."
          className="w-full max-w-sm bg-surface-container-low border-none rounded-full pl-4 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-high/50">
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant">
                  Questão / Desafio
                </th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant">
                  Categoria
                </th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant">
                  Intensidade
                </th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    A carregar...
                  </td>
                </tr>
              )}
              {!loading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    Nenhuma pergunta encontrada. Cria a primeira com "Nova Questão".
                  </td>
                </tr>
              )}
              {pageItems.map((q) => (
                <tr key={q.id} className="group hover:bg-surface-variant/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-body-md text-on-surface line-clamp-1 max-w-md">{q.texto}</p>
                    <span className="text-[10px] text-on-surface-variant/60">
                      ID: {q.id.slice(0, 6)} · sorteada {q.vezesSorteada}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-medium border ${
                        q.categoria === "verdade"
                          ? "bg-secondary-container/20 text-secondary border-secondary/10"
                          : "bg-primary-container/20 text-primary border-primary/10"
                      }`}
                    >
                      {q.categoria === "verdade" ? "Verdade" : "Desafio"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${INTENSITY_DOT[q.intensidade]}`} />
                      <span className="text-[11px] text-on-surface-variant">
                        {INTENSITY_LABEL[q.intensidade]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 ${
                        q.status === "ativa" ? "text-emerald-400" : "text-on-surface-variant/40"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {q.status === "ativa" ? "check_circle" : "draw"}
                      </span>
                      <span className="text-[11px] font-medium">
                        {q.status === "ativa" ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton
                        icon="edit"
                        title="Editar"
                        onClick={() => navigate(`/admin/perguntas/${q.id}/editar`)}
                      />
                      <IconButton
                        icon="content_copy"
                        title="Duplicar"
                        onClick={() => handleDuplicate(q)}
                      />
                      <IconButton
                        icon={q.status === "ativa" ? "block" : "check_circle"}
                        variant="danger"
                        title={q.status === "ativa" ? "Desativar" : "Ativar"}
                        onClick={() => handleToggleStatus(q)}
                      />
                      <IconButton
                        icon="delete"
                        variant="danger"
                        title="Apagar"
                        onClick={() => handleDelete(q)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container/30 flex items-center justify-between">
          <span className="text-[12px] text-on-surface-variant">
            Mostrando{" "}
            <span className="text-on-surface font-semibold">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            de <span className="text-on-surface font-semibold">{filtered.length}</span> questões
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/20 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-[12px] text-on-surface-variant px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/20 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}