import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type QuestionCategory = "verdade" | "desafio";
export type QuestionIntensity = "suave" | "equilibrado" | "provocante";
export type QuestionStatus = "ativa" | "inativa";
export type QuestionMode = "classic" | "couples" | "group";

export interface Question {
  id: string;
  texto: string;
  categoria: QuestionCategory;
  intensidade: QuestionIntensity;
  modos: QuestionMode[];
  status: QuestionStatus;
  tags: string[];
  criadoEm?: Timestamp;
  vezesSorteada: number;
}

export type QuestionInput = Omit<Question, "id" | "criadoEm" | "vezesSorteada">;

const questionsRef = collection(db, "questions");

export async function fetchAllQuestions(): Promise<Question[]> {
  const q = query(questionsRef, orderBy("criadoEm", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Question);
}

export async function fetchActiveQuestions(): Promise<Question[]> {
  const q = query(questionsRef, where("status", "==", "ativa"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Question);
}

export async function createQuestion(input: QuestionInput): Promise<string> {
  const docRef = await addDoc(questionsRef, {
    ...input,
    vezesSorteada: 0,
    criadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateQuestion(id: string, input: Partial<QuestionInput>): Promise<void> {
  await updateDoc(doc(db, "questions", id), input);
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, "questions", id));
}

export async function toggleQuestionStatus(id: string, current: QuestionStatus): Promise<void> {
  await updateDoc(doc(db, "questions", id), {
    status: current === "ativa" ? "inativa" : "ativa",
  });
}

export async function incrementDrawnCount(id: string): Promise<void> {
  await updateDoc(doc(db, "questions", id), {
    vezesSorteada: increment(1),
  });
}

export interface SessionDeck {
  truth: Question[];
  dare: Question[];
}

/**
 * Busca as perguntas ativas que correspondem exatamente ao modo e à
 * intensidade escolhidos no setup (filtro EXATO, não cumulativo — escolher
 * "provocante" traz só perguntas provocantes, não tudo até esse nível).
 *
 * Devolve dois baralhos já embaralhados, separados por categoria
 * (verdade/desafio), para o jogador poder escolher a cada rodada.
 */
export async function fetchSessionDeck(
  mode: QuestionMode,
  intensity: QuestionIntensity
): Promise<SessionDeck> {
  const active = await fetchActiveQuestions();
  const matching = active.filter(
    (q) => q.modos.includes(mode) && q.intensidade === intensity
  );

  const truth = matching
    .filter((q) => q.categoria === "verdade")
    .sort(() => Math.random() - 0.5);
  const dare = matching
    .filter((q) => q.categoria === "desafio")
    .sort(() => Math.random() - 0.5);

  return { truth, dare };
}