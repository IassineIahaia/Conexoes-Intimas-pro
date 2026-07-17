interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-12 w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          Progresso da Sessão
        </span>
        <span className="font-label-caps text-label-caps text-secondary">
          PASSO {currentStep} DE {totalSteps}
        </span>
      </div>
      <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary shadow-[0_0_8px_rgba(246,185,158,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}