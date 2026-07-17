export interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeHref: string;
}

export default function BottomNav({ items, activeHref }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 md:hidden bg-surface-container/90 backdrop-blur-2xl border-t border-outline-variant/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 rounded-t-xl">
      {items.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <a
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-primary-container/30 text-primary rounded-full p-3 transition-transform scale-95 active:scale-90"
                : "flex flex-col items-center justify-center text-on-surface-variant/60 p-3 hover:bg-surface-variant/20 transition-all duration-300"
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
          </a>
        );
      })}
    </nav>
  );
}