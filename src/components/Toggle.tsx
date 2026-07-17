interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${
        checked ? "bg-primary" : "bg-surface-variant"
      }`}
    >
      <div
        className={`w-4 h-4 bg-on-primary rounded-full absolute top-1 shadow-sm transition-all duration-300 ${
          checked ? "right-1" : "left-1"
        }`}
      />
    </div>
  );
}