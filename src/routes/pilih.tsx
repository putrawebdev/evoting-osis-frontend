import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, LogOut, MousePointerClick, RotateCcw, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Logo } from "@/components/shared";
import { castVote, setState, useStore, type Candidate } from "@/lib/store";

export const Route = createFileRoute("/pilih")({
  head: () => ({
    meta: [
      { title: "Pilih Paslon — Pemilihan OSIS" },
      { name: "description", content: "Lihat visi, misi, dan program kerja pasangan calon lalu berikan suaramu." },
      { property: "og:title", content: "Pilih Paslon — Pemilihan OSIS" },
      { property: "og:description", content: "Kenali pasangan calon Ketua OSIS dan berikan suaramu." },
    ],
  }),
  component: PilihPage,
});

function PilihPage() {
  // Ambil data student langsung dari localStorage yang dikirim saat login
  const [student, setStudent] = useState<{nisn: string, name: string, kelas?: string} | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const electionName = "Pemilihan Ketua OSIS SMK Metland";
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [flippedCandidateIds, setFlippedCandidateIds] = useState<Set<string>>(() => new Set());
  const [confirm, setConfirm] = useState<Candidate | null>(null);

  useEffect(() => {
    // Ambil data student dari localStorage
    const rawStudent = localStorage.getItem("current_student");
    if (!rawStudent) {
      // Jika belum login/tidak ada data, tendang ke login
      navigate({ to: "/login" });
      return;
    }
    
    const parsedStudent = JSON.parse(rawStudent);
    setStudent(parsedStudent);

    const fetchKandidat = async () => {
      try {
        const response = await fetch("https://evoting-osis-backend-production.up.railway.app/api/kandidat");
        const data = await response.json();
        
        const formattedCandidates = data.data.map((c: any) => ({
            id: String(c.id),
            number: c.no_paslon,
            ketua: c.nama_ketua,
            wakil: c.nama_wakil,
            photo: `https://evoting-osis-backend-production.up.railway.app/storage/${c.foto}`,
            visi: c.visi,
            misi: typeof c.misi === 'string' ? c.misi.split('\n').filter(Boolean) : c.misi,
            program: typeof c.proggram === 'string' ? c.proggram.split('\n').filter(Boolean) : c.proggram
        }));

        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Gagal mengambil data kandidat", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKandidat();
  }, [navigate]);
  const toggleCandidate = (candidateId: string) => {
      setFlippedCandidateIds((current) => {
        const next = new Set(current);
        if (next.has(candidateId)) next.delete(candidateId);
        else next.add(candidateId);
        return next;
      });
    };
  if (!student) return null;

  const vote = async () => {
    if (!confirm || !student) return;
    
    try {
      // PASTIKAN URL INI MENGGUNAKAN IP KAMU, BUKAN LOCALHOST
      const response = await fetch("https://evoting-osis-backend-production.up.railway.app/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          nis: student.nisn,
          id_kandidat: confirm.id
        }),
      });

      if(response.ok) {
        //  setState((s) => ({ ...s, currentNisn: null }));
        //  localStorage.removeItem("current_student");
         navigate({ to: "/terima-kasih" });
      } else {
         const errorData = await response.json();
         alert("Gagal memberikan suara: " + (errorData.message || "Kesalahan sistem"));
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat mengirim suara.");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{student.name}</p>
              <p className="text-xs text-muted-foreground">{student.kelas} · {student.nisn}</p>
            </div>
            <Button variant="outline" size="icon" aria-label="Keluar" onClick={() => setState((s) => ({ ...s, currentNisn: null }))}><LogOut /></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-sm font-semibold text-accent">Halo, {student.name.split(" ")[0]} 👋</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">{electionName}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Pilih salah satu pasangan calon. Pilihan tidak dapat diubah.</p>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {candidates.map((c, i) => (
            <motion.article key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              role="group" aria-label={`Paslon ${c.number}: ${c.ketua} dan ${c.wakil}`} tabIndex={0}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("button")) return;
                toggleCandidate(c.id);
              }}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleCandidate(c.id);
                }
              }}
              className="group h-full cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-card transition-shadow hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [perspective:1200px]">
              <motion.div className="grid h-full" animate={{ rotateY: flippedCandidateIds.has(c.id) ? 180 : 0 }} transition={{ duration: 0.65, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }}>
                <div className="flex h-[26rem] flex-col [grid-area:1/1] [backface-visibility:hidden] sm:h-[calc(32rem_+_2px)]">
                  <div className="relative aspect-[4/4] overflow-hidden bg-muted">
                    <img src={c.photo} alt={`${c.ketua} dan ${c.wakil}`} width={816} height={1000} loading="lazy" className="h-full w-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-md bg-card/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-card">Paslon {String(c.number).padStart(2, "0")}</span>
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-card/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-card">
                      <MousePointerClick className="h-3.5 w-3.5" /> Lihat detail
                    </span>
                  </div>
                    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
                    <div>
                      <p className="text-xs font-semibold text-accent">KANDIDAT KETUA & WAKIL</p>
                      <h2 className="mt-2 text-xl font-bold leading-snug">{c.ketua}</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">&nbsp;{c.wakil}</p>
                    </div>
                    <div className="mt-4 border-l-2 border-accent pl-3">
                    </div>
                    <Button className="mt-auto w-full" variant="hero" size="xl" onClick={() => setConfirm(c)}><Vote /> Pilih</Button>
                  </div>
                </div>
                <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex h-[26rem] flex-col p-4 sm:h-[calc(32rem_+_2px)] sm:p-5">
                    <div className="border-b pb-4">
                      <p className="text-xs font-semibold text-accent">VISI, MISI & PROGRAM</p>
                      <h2 className="mt-2 text-lg font-bold leading-snug">{c.ketua} & {c.wakil}</h2>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><RotateCcw className="h-3.5 w-3.5" /> Klik kartu untuk kembali</p>
                    </div>
                    <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-2" onClick={(event) => event.stopPropagation()}>
                      <section>
                        <h3 className="mb-1 font-semibold text-primary">Visi</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{c.visi}</p>
                      </section>
                      <section className="border-t pt-4">
                        <h3 className="mb-2 font-semibold text-primary">Misi</h3>
                        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed marker:font-semibold marker:text-primary">{c.misi.map((m) => <li key={m}>{m}</li>)}</ol>
                      </section>
                      <section className="border-t pt-4">
                        <h3 className="mb-2 font-semibold text-primary">Program Kerja</h3>
                        <ul className="space-y-2 text-sm leading-relaxed">{c.program.map((program) => <li key={program} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{program}</li>)}</ul>
                      </section>
                    </div>
                    <Button className="mt-4 w-full" variant="hero" size="xl" onClick={() => setConfirm(c)}><Vote /> Pilih</Button>
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </main>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          {confirm && (<>
            <DialogHeader>
              <DialogTitle>Konfirmasi pilihan</DialogTitle>
              <DialogDescription>Pilihan bersifat final dan tidak dapat diubah.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 rounded-2xl bg-secondary p-4">
              <img src={confirm.photo} alt="" width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0"><p className="text-xs text-muted-foreground">Paslon {confirm.number}</p><p className="font-bold">{confirm.ketua} & {confirm.wakil}</p></div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="xl" onClick={() => setConfirm(null)}>Batal</Button>
              <Button variant="success" size="xl" onClick={vote}><CheckCircle2 /> Ya, saya yakin</Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
