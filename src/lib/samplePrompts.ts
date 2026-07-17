export interface Prompt {
  player: string;
  category: "Verdade" | "Desafio";
  text: string;
  intensity: string;
}

export const samplePrompts: Prompt[] = [
  {
    player: "Ricardo",
    category: "Verdade",
    text: "Qual foi o momento exato em que você sentiu que nossa conexão se tornou algo profundo e sensorial?",
    intensity: "Suave",
  },
  {
    player: "Juliana",
    category: "Desafio",
    text: "Feche os olhos e descreva, apenas pelo toque, qual parte da minha mão você mais aprecia.",
    intensity: "Equilibrado",
  },
  {
    player: "Ricardo",
    category: "Verdade",
    text: "Existe um segredo que você só contaria se estivéssemos sob a luz de velas em uma noite de chuva?",
    intensity: "Provocante",
  },
];