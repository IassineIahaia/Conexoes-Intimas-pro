import type { ReactNode } from "react";
import type { NavItem } from "./BottomNav";

interface NavDrawerProps {
  brandTitle: string;
  brandSubtitle: string;
  brandIcon?: string;
  items: NavItem[];
  activeHref: string;
  footerSlot?: ReactNode;
}

export default function NavDrawer({
  brandTitle,
  brandSubtitle,
  brandIcon = "person",
  items,
  activeHref,
  footerSlot,
}: NavDrawerProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-80 z-40 flex-col py-24 px-8 bg-surface border-r border-outline-variant/20 shadow-2xl">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">{brandIcon}</span>
          </div>
          <div>
            <p className="font-body-md text-body-md text-primary font-bold">{brandTitle}</p>
            <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
              {brandSubtitle}
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-4">
        {items.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-4 py-3 px-4 bg-secondary-container text-on-secondary-container rounded-r-full font-bold transition-all duration-300 pl-6"
                  : "flex items-center gap-4 py-3 px-4 text-on-surface-variant hover:bg-surface-variant/10 rounded-r-full transition-all duration-300 hover:pl-6 group"
              }
            >
              <span className="material-symbols-outlined group-hover:text-primary">
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {footerSlot && (
        <div className="mt-auto pt-8 border-t border-outline-variant/10">{footerSlot}</div>
      )}
    </aside>
  );
}