import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextInput({ label, className = "", ...rest }: TextInputProps) {
  return (
    <div className="relative">
      <label className="block font-label-caps text-[10px] text-primary mb-2 uppercase tracking-widest">
        {label}
      </label>
    <input
  className={`w-full bg-transparent border-x-0 border-t-0 border-b border-outline-variant py-4 text-headline-sm font-headline-sm focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-on-surface-variant/30 ${className}`}
  {...rest}
/>
    </div>
  );
}