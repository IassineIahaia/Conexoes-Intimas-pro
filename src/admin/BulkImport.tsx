import { useState } from "react";
import Papa from "papaparse";
import AdminLayout from "./AdminLayout";
import Button from "../components/Button";
import {
  createQuestion,
  type QuestionCategory,
  type QuestionIntensity,
  type QuestionMode,
} from "../lib/questions";

interface CsvRow {
  texto: string;
  categoria: string;
  intensidade: string;
  modos: string;
  tags: string;
}

interface ParsedQuestion {
  texto: string;
  categoria: QuestionCategory;
  intensidade: QuestionIntensity;
  modos: QuestionMode[];
  tags: string[];
  error?: string;
}

const VALID_CATEGORIAS: QuestionCategory[] = ["verdade", "desafio"];
const VALID_INTENSIDADES: QuestionIntensity[] = ["suave", "equilibrado", "provocante"];
const VALID_MODOS: QuestionMode[] = ["classic", "couples", "group"];

function parseRow(row: CsvRow): ParsedQuestion {
  const texto = row.texto?.trim() ?? "";
  const categoria = row.categoria?.trim().toLowerCase() as QuestionCategory;
  const intensidade = row.intensidade?.trim().toLowerCase() as QuestionIntensity;
  const modos = (row.modos ?? "")
    .split(/[|;]/)
    .map((m) => m.trim().toLowerCase())
    .filter(Boolean) as QuestionMode[];
  const tags = (row.tags ?? "")
    .split(/[|;]/)
    .map((t) => t.trim())
    .filter(Boolean);

  let error: string | undefined;
  if (!texto) error = "Texto vazio";
  else if (!VALID_CATEGORIAS.includes(categoria)) error = `Categoria inválida: "${row.categoria}"`;
  else if (!VALID_INTENSIDADES.includes(intensidade))
    error = `Intensidade inválida: "${row.intensidade}"`;
  else if (modos.length === 0 || modos.some((m) => !VALID_MODOS.includes(m)))
    error = `Modos inválidos: "${row.modos}"`;

  return { texto, categoria, intensidade, modos, tags, error };
}

export default function BulkImport() {
  const [rows, setRows] = useState<ParsedQuestion[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  function handleFile(file: File) {
    setDone(false);
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data.map(parseRow));
      },
    });
  }

  const validRows = rows.filter((r) => !r.error);
  const invalidRows = rows.filter((r) => r.error);

  async function handleImport() {
    setImporting(true);
    for (const row of validRows) {
      await createQuestion({
        texto: row.texto,
        categoria: row.categoria,
        intensidade: row.intensidade,
        modos: row.modos,
        status: "ativa",
        tags: row.tags,
      });
    }
    setImporting(false);
    setDone(true);
    setRows([]);
  }

  return (
    <AdminLayout title="Importação em Massa" activeHref="/admin/importar">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
          Importar Perguntas via CSV
        </h2>
        <p className="text-on-surface-variant font-body-md">
          O ficheiro deve ter as colunas: <code className="text-primary">texto</code>,{" "}
          <code className="text-primary">categoria</code> (verdade/desafio),{" "}
          <code className="text-primary">intensidade</code> (suave/equilibrado/provocante),{" "}
          <code className="text-primary">modos</code> (classic/couples/group, separados por{" "}
          <code className="text-primary">|</code>), e{" "}
          <code className="text-primary">tags</code> (opcional, separadas por{" "}
          <code className="text-primary">|</code>).
        </p>
      </div>

      <div className="glass-card p-8 rounded-2xl max-w-2xl mb-8">
        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant/40 rounded-xl p-10 cursor-pointer hover:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-primary text-4xl">upload_file</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Clica para escolher um ficheiro .csv
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>

      {done && (
        <div className="max-w-2xl mb-8 p-5 rounded-xl border border-emerald-400/30 bg-emerald-400/5 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <p className="text-on-surface">Importação concluída com sucesso.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="max-w-2xl space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <p className="font-label-caps text-label-caps text-on-surface mb-2">
              {validRows.length} pergunta(s) válida(s), {invalidRows.length} com erro
            </p>
            {invalidRows.length > 0 && (
              <ul className="text-sm text-error space-y-1 mt-3 max-h-40 overflow-y-auto">
                {invalidRows.map((row, i) => (
                  <li key={i}>
                    "{row.texto.slice(0, 40) || "(vazio)"}..." — {row.error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            variant="primary"
            disabled={importing || validRows.length === 0}
            onClick={handleImport}
          >
            {importing
              ? `A importar...`
              : `Importar ${validRows.length} pergunta(s) válida(s)`}
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}