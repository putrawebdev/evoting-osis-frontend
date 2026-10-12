import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileSpreadsheet, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, StatusBadge, card } from "@/components/shared";
import { addHistory, getState, setState, type ElectionStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/pengaturan")({
  component: PengaturanPage,
});

const STATUSES: ElectionStatus[] = ["Draft", "Berlangsung", "Selesai"];

function PengaturanPage() {
  const [f, setF] = useState(() => getState().election);
  
  const save = () => {
    if (!f.name.trim()) { toast.error("Nama pemilihan wajib diisi."); return; }
    if (f.end <= f.start) { toast.error("Waktu selesai harus setelah waktu mulai."); return; }
    
    // Menyimpan pengaturan UI ke sistem React (Store lokal)
    setState((s) => addHistory({ ...s, election: f }, "admin", "Pengaturan", `Status diubah ke: ${f.status}`));
    toast.success("Pengaturan aplikasi berhasil disimpan");
  };

  // Fungsi untuk menarik file asli dari Laravel
  const exportExcel = () => {
    const id = toast.loading("Menghasilkan laporan Excel dari database...");
    
    // Mengarahkan browser untuk men-download file CSV dari Laravel
    window.location.href = "https://evoting-osis-backend-production.up.railway.app/api/admin/export/excel";
    
    setTimeout(() => {
      toast.success("File Excel berhasil diunduh!", { id });
    }, 1500);
  };

  const exportPDF = () => {
    const id = toast.loading("Menyiapkan dokumen PDF...");
    window.location.href = "https://evoting-osis-backend-production.up.railway.app/api/admin/export/pdf";
    setTimeout(() => toast.success("File PDF berhasil diunduh!", { id }), 1500);
  };

  return (
    <>
      <PageHeader title="Pengaturan & Laporan" desc="Konfigurasi status pemilihan dan unduh laporan resmi." />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${card} space-y-4 p-6 lg:col-span-2`}>
          <label className="block text-sm font-semibold">Nama Acara Pemilihan<Input className="mt-1.5 h-11" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Waktu Mulai<Input type="datetime-local" className="mt-1.5 h-11" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></label>
            <label className="block text-sm font-semibold">Waktu Selesai<Input type="datetime-local" className="mt-1.5 h-11" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} /></label>
          </div>
          
          <div>
            <p className="mb-2 text-sm font-semibold">Status Sistem</p>
            <div role="radiogroup" className="grid grid-cols-3 gap-2">
              {STATUSES.map((st) => (
                <button key={st} role="radio" aria-checked={f.status === st} onClick={() => setF({ ...f, status: st })}
                  className={cn("rounded-xl border-2 p-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", f.status === st ? "border-primary bg-secondary" : "border-border hover:border-primary/40")}>
                  <StatusBadge status={st} />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">*Gunakan status <b>Berlangsung</b> agar pemilih bisa login.</p>
          </div>
          
          <Button variant="hero" size="xl" onClick={save}><Save /> Simpan pengaturan</Button>
        </div>
        
        <div className={`${card} p-6`}>
          <p className="font-semibold text-lg">Ekspor Hasil Pilihan</p>
          <p className="mt-1 text-sm text-muted-foreground mb-4">Unduh rekap data asli dari database MySQL sebagai laporan bukti.</p>
          
          <div className="mt-4 space-y-3">
            {/* Tombol Ekspor Excel */}
            <Button variant="outline" size="xl" className="w-full justify-start border-success text-success hover:bg-success hover:text-white transition-all" onClick={exportExcel}>
              <FileSpreadsheet className="mr-2 h-5 w-5" /> Cetak Excel (CSV)
            </Button>
            
            {/* Tombol PDF Dialihkan Informasinya */}
            <Button variant="outline" size="xl" className="w-full justify-start text-destructive" onClick={exportPDF}>
              <FileText className="mr-2 h-5 w-5" /> Cetak PDF
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}