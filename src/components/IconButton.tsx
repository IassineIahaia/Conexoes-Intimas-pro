import type { ButtonHTMLAttributes } from "react";

type IconButtonVariant = "default" | "danger" | "circular";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: IconButtonVariant;
  filled?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    "p-2 rounded-lg text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-colors",
  danger:
    "p-2 rounded-lg text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-colors",
  circular:
    "w-10 h-10 rounded-full flex items-center justify-center glass-panel text-primary hover:border-primary transition-all duration-500",
};

export default function IconButton({
  icon,
  variant = "default",
  filled = false,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button className={`${variantClasses[variant]} ${className}`} {...rest}>
      <span
        className="material-symbols-outlined text-[20px]"
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
    </button>
  );
}