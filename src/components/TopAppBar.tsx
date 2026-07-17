import type { ReactNode } from "react";

interface TopAppBarProps {
  title: string;
  onMenuClick?: () => void;
  rightSlot?: ReactNode;
}

export default function TopAppBar({ title, onMenuClick, rightSlot }: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-gutter-mobile md:px-gutter-desktop h-16 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-4">
          <span
            className="material-symbols-outlined text-primary cursor-pointer lg:hidden"
            onClick={onMenuClick}
          >
            menu
          </span>
          <h1 className="font-headline-sm text-headline-sm tracking-tight text-primary">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-6">{rightSlot}</div>
      </div>
    </header>
  );
}