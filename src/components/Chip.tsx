interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={
        selected
          ? "px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-label-caps text-[11px] border border-primary/20"
          : "px-5 py-2 rounded-full bg-surface-variant/40 text-on-surface-variant font-label-caps text-[11px] border border-white/5 hover:bg-surface-variant transition-colors"
      }
    >
      {label}
    </button>
  );
}