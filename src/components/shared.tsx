import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElectionStatus } from "@/lib/store";
import metlandLogo from "@/assets/logo-metland-transparent.png";

export function StatusBadge({ status }: { status: ElectionStatus }) {
  const styles: Record<ElectionStatus, string> = {
    Draft: "bg-muted text-muted-foreground",
    Berlangsung: "bg-success-soft text-success",
    Selesai: "bg-secondary text-secondary-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", styles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status === "Berlangsung" && "animate-pulse")} />
      {status}
    </span>
  );
}

export function Pill({ tone, children }: { tone: "success" | "danger" | "muted" | "accent"; children: ReactNode }) {
  const t = {
    success: "bg-success-soft text-success",
    danger: "bg-destructive-soft text-destructive",
    muted: "bg-muted text-muted-foreground",
    accent: "bg-accent-soft text-accent",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", t)}>{children}</span>;
}

export function MetricCard({ icon: Icon, label, value, hint, tone = "primary" }: { icon: LucideIcon; label: string; value: ReactNode; hint?: string; tone?: "primary" | "accent" | "success" | "danger" }) {
  const t = { primary: "bg-secondary text-primary", accent: "bg-accent-soft text-accent", success: "bg-success-soft text-success", danger: "bg-destructive-soft text-destructive" }[tone];
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", t)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={metlandLogo} alt="Logo Metland School" width={40} height={40} className="h-10 w-10 shrink-0 object-contain drop-shadow-sm" />
      <div className="min-w-0 leading-tight">
        <p className={cn("font-extrabold", light ? "text-sidebar-accent-foreground" : "text-foreground")}>E-Voting OSIS</p>
        <p className={cn("text-xs", light ? "text-sidebar-foreground/70" : "text-muted-foreground")}> SMK Metland Cibitung</p>
      </div>
    </div>
  );
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-muted-foreground">{desc}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export const card = "rounded-2xl border bg-card shadow-card";
export const selectCls = "h-10 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
