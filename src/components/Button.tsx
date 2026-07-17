import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-on-primary-container shadow-lg hover:scale-[1.02] active:scale-95 disabled:bg-primary-container/60 disabled:text-on-primary-container/60 disabled:cursor-not-allowed disabled:hover:scale-100",
  secondary:
    "border border-primary/40 text-primary hover:bg-primary/10 disabled:border-outline-variant/20 disabled:text-on-surface-variant/40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`w-full py-4 rounded-full font-label-caps text-label-caps tracking-widest transition-all duration-300 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}