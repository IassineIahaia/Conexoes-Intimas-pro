import type { ReactNode } from "react";
import TopAppBar from "../components/TopAppBar";
import NavDrawer from "../components/NavDrawer";
import { useAuth } from "../lib/AuthContext";

const adminNavItems = [
  { icon: "dashboard", label: "Início", href: "/admin" },
  { icon: "quiz", label: "Explorar Perguntas", href: "/admin/perguntas" },
  { icon: "publish", label: "Bulk Import", href: "/admin/importar" },
  { icon: "verified_user", label: "Moderação", href: "/admin/moderacao" },
];

interface AdminLayoutProps {
  title: string;
  activeHref: string;
  children: ReactNode;
}

export default function AdminLayout({ title, activeHref, children }: AdminLayoutProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar
        title={title}
        rightSlot={
          <button
            onClick={logout}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
            title="Sair"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        }
      />
      <NavDrawer
        brandTitle="Conexões Íntimas"
        brandSubtitle="Admin Portal"
        brandIcon="auto_awesome"
        items={adminNavItems}
        activeHref={activeHref}
      />
      <main className="pt-24 pb-12 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto lg:pl-80">
        {children}
      </main>
    </div>
  );
}