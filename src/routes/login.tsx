import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, ArrowRight, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo, StatusBadge } from "@/components/shared";
import { useStore, fmtTime } from "@/lib/store";
import loginBackground from "@/assets/mc.jpg";
import welcomeImage from "@/assets/popup-smk-metland.png";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const election = useStore((s) => s.election);
  const [nisn, setNisn] = useState("");
  const [error, setError] = useState<{ msg: string; voted: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("https://evoting-osis-backend-production.up.railway.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ nisn: nisn }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ 
          msg: data.message || "Gagal masuk, periksa kembali NISN Anda.", 
          voted: data.reason === "voted" 
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("current_student", JSON.stringify(data.student));
      toast.success(`Selamat datang, ${data.student.name}`);
      navigate({ to: "/pilih" });

    } catch (err) {
      setError({ msg: "Tidak dapat terhubung ke server backend.", voted: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-3 sm:p-6">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${loginBackground})` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black/60" aria-hidden="false" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] border border-emerald-200/80 bg-white/96 p-4 shadow-[0_22px_60px_rgba(0,168,150,0.18)] backdrop-blur-sm sm:rounded-[28px] sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-hero" aria-hidden="true" />
        <header className="-mx-5 -mt-5 mb-5 border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-5 pb-4 pt-6 sm:-mx-7 sm:-mt-7 sm:px-7 sm:pb-5 sm:pt-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Logo />
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Suara siswa, perubahan nyata</p>
              <h1 className="mt-1 text-2xl font-extrabold leading-tight text-slate-900">{election.name}</h1>
              <p className="mt-1 text-sm text-slate-600">Suara Anda Menentukan Arah Organisasi</p>
            </div>
            <StatusBadge status={election.status} />
          </div>
          <p className="mt-4 flex items-center gap-2 border-t border-emerald-200/70 pt-3 text-xs text-slate-600"><CalendarClock className="h-3.5 w-3.5 text-primary" />{fmtTime(election.start)} – {fmtTime(election.end)}</p>
        </header>

        <section className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
          <h2 className="text-sm font-bold text-slate-800">Cara memulai pemilihan</h2>
          <ol className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
            <li className="flex items-start gap-2 rounded-xl bg-white p-2.5 shadow-sm"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary font-bold text-white">1</span><span><strong className="block text-slate-800">Masukkan NISN</strong><span className="text-slate-600">Gunakan NISN yang terdaftar.</span></span></li>
            <li className="flex items-start gap-2 rounded-xl bg-white p-2.5 shadow-sm"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary font-bold text-white">2</span><span><strong className="block text-slate-800">Mulai memilih</strong><span className="text-slate-600">Tekan lanjut untuk masuk bilik suara.</span></span></li>
          </ol>
        </section>

        <form onSubmit={submit} className="mt-5 space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div>
            <label htmlFor="nisn" className="mb-2 block text-sm font-semibold text-slate-800">NISN</label>
            <Input id="nisn" inputMode="numeric" maxLength={10} value={nisn} placeholder="Masukkan NISN 10 digit"
              onChange={(e) => { setNisn(e.target.value.replace(/\D/g, "")); setError(null); }}
              className="h-12 rounded-xl border-emerald-200 bg-emerald-50/40 text-base text-slate-800 placeholder:text-slate-400" aria-invalid={!!error} />
          </div>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="flex gap-3 rounded-lg bg-destructive-soft p-3 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div><p className="font-semibold">{error.voted ? "Akses ditolak" : "Tidak dapat masuk"}</p><p>{error.msg}</p></div>
            </motion.div>
          )}
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
            {loading ? "Memeriksa..." : <>Lanjut memilih <ArrowRight /></>}
          </Button>
        </form>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Link to="/admin/login" className="font-semibold text-primary hover:text-primary/80 hover:underline">Masuk sebagai admin</Link>
        </p>
      </motion.div>

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-3 sm:max-w-4xl sm:p-5">
          <DialogHeader>
            <DialogTitle>SMK Metland Cibitung</DialogTitle>
            <DialogDescription>Informasi Penerimaan Murid Baru Tahun Pelajaran 2026–2027.</DialogDescription>
          </DialogHeader>
          <img src={welcomeImage} alt="Informasi PMB" className="max-h-[68vh] w-full rounded-md bg-white object-contain" />
          <DialogFooter>
            <Button variant="hero" size="xl" className="w-full" onClick={() => setShowWelcome(false)}>Lanjut ke Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}