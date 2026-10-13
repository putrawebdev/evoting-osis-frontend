import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setState, startCountdown } from "@/lib/store";

export const Route = createFileRoute("/terima-kasih")({
  head: () => ({
    meta: [
      { title: "Terima Kasih — PILKAOS" },
      { name: "description", content: "Suaramu telah tercatat. Terima kasih telah berpartisipasi." },
      { property: "og:title", content: "Terima Kasih — PILKAOS" },
      { property: "og:description", content: "Suaramu telah tercatat." },
    ],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  const [n, setN] = useState(5);
  const navigate = useNavigate();
  useEffect(() => { 
    setState((s) => ({ ...s, currentNisn: null })); 
    localStorage.removeItem("current_student"); // Menghapus data siswa dari browser
  }, []);
  useEffect(() => startCountdown(5, setN, () => navigate({ to: "/login" })), [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-elegant sm:p-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success text-success-foreground">
          <motion.div initial={{ pathLength: 0, opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}><Check className="h-12 w-12" strokeWidth={3} /></motion.div>
        </motion.div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Terima kasih!</h1>
        <p className="mt-2 text-muted-foreground">Suaramu telah tercatat dengan aman.</p>
        <p className="mt-6 text-sm text-muted-foreground">Kembali ke halaman masuk dalam <span className="font-bold text-primary" aria-live="polite">{n}</span> detik</p>
        <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full bg-success" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 5, ease: "linear" }} />
        </div>
        <Button variant="outline" size="xl" className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>Kembali sekarang</Button>
      </motion.div>
    </div>
  );
}
