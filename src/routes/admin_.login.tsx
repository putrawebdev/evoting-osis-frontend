import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared";
import { addHistory, setState } from "@/lib/store";
import loginBackground from "@/assets/mc.jpg";
import { API_URL } from "@/lib/api";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — Pemilihan OSIS" },
      { name: "description", content: "Masuk ke panel admin untuk mengelola pemilihan OSIS." },
      { property: "og:title", content: "Login Admin — Pemilihan OSIS" },
      { property: "og:description", content: "Panel admin pemilihan OSIS." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!u || !p) { toast.error("Username dan password wajib diisi."); return; }
    
    setLoading(true);
    try {
      const response = await fetch("https://evoting-osis-backend.wasmer.app/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await response.json();

      if (response.ok) {
        setState((s) => addHistory({ ...s, adminLoggedIn: true }, "admin", "Login Admin", "Admin masuk ke panel"));
        localStorage.setItem("admin_session", "true");
        toast.success("Berhasil masuk ke panel admin");
        navigate({ to: "/admin/dashboard" });
      } else {
        toast.error(data.message || "Gagal masuk.");
      }
    } catch (error) {
      toast.error("Tidak dapat terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loginBackground})` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-emerald-200/80 bg-white/96 shadow-[0_22px_60px_rgba(0,168,150,0.18)] backdrop-blur-md">
        <div className="h-1.5 bg-gradient-hero" />
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-primary ring-1 ring-emerald-200"><ShieldCheck className="h-5 w-5" /></span>
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Area Administrator</p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Masuk ke panel</h1>
            <p className="mt-1 text-sm text-slate-600">Kelola pemilihan Ketua OSIS.</p>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-800">Username</span>
              <div className="relative"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input id="admin-username" value={u} onChange={(e) => setU(e.target.value)} className="h-12 rounded-xl border-emerald-200 bg-emerald-50/40 pl-11 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2" /></div></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-800">Password</span>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input id="admin-password" type="password" value={p} onChange={(e) => setP(e.target.value)} className="h-12 rounded-xl border-emerald-200 bg-emerald-50/40 pl-11 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2" /></div></label>
            <Button type="submit" variant="hero" size="xl" className="mt-2 w-full justify-between px-5" disabled={loading}><span>{loading ? "Memproses..." : "Masuk ke dashboard"}</span><ArrowRight /></Button>
          </div>
          <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" /> Halaman pemilih</Link>
        </div>
      </motion.form>
    </div>
  );
}
