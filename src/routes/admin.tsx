import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { History, LayoutDashboard, LogOut, Menu, Settings, UserX, Users, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo, StatusBadge } from "@/components/shared";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/kandidat", label: "Kandidat", icon: UsersRound },
  { to: "/admin/pemilih", label: "Pemilih", icon: Users },
  { to: "/admin/belum-memilih", label: "Belum Memilih", icon: UserX },
  { to: "/admin/riwayat", label: "Riwayat", icon: History },
  { to: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

function NavList({ onNav }: { onNav?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} onClick={onNav}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground [&>svg]:text-sidebar-primary" }}>
          <Icon className="h-5 w-5" />{label}
        </Link>
      ))}
    </nav>
  );
}

function AdminLayout() {
  const loggedIn = useStore((s) => s.adminLoggedIn);
  const status = useStore((s) => s.election.status);
  const name = useStore((s) => s.election.name);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!loggedIn) navigate({ to: "/admin/login" }); }, [loggedIn, navigate]);
  if (!loggedIn) return null;
  const logout = () => setState((s) => ({ ...s, adminLoggedIn: false }));

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar p-5 lg:flex">
        <Logo light />
        <div className="mt-8 flex-1"><NavList /></div>
        <Button variant="ghost" className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={logout}><LogOut /> Keluar</Button>
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo light />
          <div className="mt-8"><NavList onNav={() => setOpen(false)} /></div>
          <Button variant="ghost" className="mt-4 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={logout}><LogOut /> Keluar</Button>
        </SheetContent>
      </Sheet>
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-8">
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Buka menu" onClick={() => setOpen(true)}><Menu /></Button>
          <p className="truncate text-sm font-semibold">{name}</p>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <div className="hidden h-9 w-9 place-items-center rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground sm:grid">A</div>
          </div>
        </div>
      </header>
      <main className="px-4 py-6 sm:px-8 sm:py-8"><Outlet /></main>
    </div>
  );
}
