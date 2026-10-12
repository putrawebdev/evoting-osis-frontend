import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { FileUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, Pill, card, selectCls } from "@/components/shared";

export const Route = createFileRoute("/admin/pemilih")({
  component: PemilihPage,
});

function PemilihPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [kelas, setKelas] = useState("Semua");
  const [add, setAdd] = useState(false);
  const [imp, setImp] = useState(false);
  const [f, setF] = useState({ nis: "", nama: "", kelas: "" });
  const [file, setFile] = useState<File | null>(null);

  // Ambil data langsung dari MySQL
  const fetchPemilih = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/pemilih");
      const data = await response.json();
      if (data.status === 'success') {
        setStudents(data.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil data pemilih");
    }
  };

  useEffect(() => {
    fetchPemilih();
  }, []);

  // Membuat daftar kelas dinamis langsung dari database
  const kelasList = useMemo(() => {
    const list = students.map((s) => s.kelas).filter((k) => k && k.trim() !== "");
    return Array.from(new Set(list)).sort();
  }, [students]);

  const rows = students.filter((s) => 
    (kelas === "Semua" || s.kelas === kelas) && 
    (s.nama?.toLowerCase().includes(q.toLowerCase()) || s.nis?.toString().includes(q))
  );

  const save = async () => {
    if (!f.nis) { toast.error("NIS wajib diisi."); return; }
    if (!f.nama.trim()) { toast.error("Nama wajib diisi."); return; }
    
    try {
      const response = await fetch("http://localhost:8000/api/admin/pemilih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Pemilih berhasil ditambahkan");
        setF({ nis: "", nama: "", kelas: "" });
        setAdd(false);
        fetchPemilih(); // Otomatis refresh data
      } else {
        toast.error(data.message || "Gagal menambahkan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  const doImport = async () => {
    if (!file) { toast.error("Pilih file CSV terlebih dahulu."); return; }
    
    const id = toast.loading(`Mengimpor ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/admin/pemilih/import", {
        method: "POST",
        body: formData, // Ingat: Jangan set Content-Type manual saat pakai FormData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "Impor selesai", { id });
        setFile(null);
        setImp(false);
        fetchPemilih(); // Otomatis refresh tabel supaya data baru langsung muncul
      } else {
        toast.error(data.message || "Gagal mengimpor data", { id });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan", { id });
    }
  };

  return (
    <>
      <PageHeader title="Pemilih" desc={`${students.length} siswa terdaftar`} action={<>
        <Button variant="outline" size="lg" onClick={() => setImp(true)}><FileUp /> Impor</Button>
        <Button variant="hero" size="lg" onClick={() => setAdd(true)}><Plus /> Tambah</Button>
      </>} />
      
      <div className={card}>
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Cari nama atau NIS" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" /></div>
          <select aria-label="Filter kelas" className={selectCls} value={kelas} onChange={(e) => setKelas(e.target.value)}>
            <option>Semua</option>
            {kelasList.map((k) => <option key={k as string}>{k as string}</option>)}
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">NIS</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Kelas</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Waktu Memilih</th></tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.nis} className="border-t transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{s.nis}</td>
                  <td className="px-4 py-3 font-medium">{s.nama}</td>
                  <td className="px-4 py-3">{s.kelas || "-"}</td>
                  <td className="px-4 py-3">{s.sudah_memilih == 1 ? <Pill tone="success">Sudah memilih</Pill> : <Pill tone="danger">Belum</Pill>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.waktu_memilih ? new Date(s.waktu_memilih).toLocaleString("id-ID") : "—"}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Tidak ada data yang cocok.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={add} onOpenChange={setAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Tambah pemilih</DialogTitle><DialogDescription>Tambahkan siswa secara manual.</DialogDescription></DialogHeader>
          <label className="text-sm font-semibold">NIS<Input className="mt-1" inputMode="numeric" value={f.nis} onChange={(e) => setF({ ...f, nis: e.target.value.replace(/\D/g, "") })} /></label>
          <label className="text-sm font-semibold">Nama lengkap<Input className="mt-1" value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></label>
          <label className="text-sm font-semibold">Kelas<Input className="mt-1" placeholder="Contoh: XII PPLG 1" value={f.kelas} onChange={(e) => setF({ ...f, kelas: e.target.value })} /></label>
          <DialogFooter><Button variant="outline" onClick={() => setAdd(false)}>Batal</Button><Button variant="hero" onClick={save}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imp} onOpenChange={setImp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Impor pemilih</DialogTitle><DialogDescription>Fitur ini masih dalam tahap simulasi.</DialogDescription></DialogHeader>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary hover:bg-secondary">
            <FileUp className="h-8 w-8 text-primary" />
            <span className="text-sm font-semibold">{file ? file.name : "Klik untuk memilih file"}</span>
            <span className="text-xs text-muted-foreground">.csv, .xlsx, .xls</span>
            <input type="file" accept=".csv,.xlsx,.xls" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <DialogFooter><Button variant="outline" onClick={() => setImp(false)}>Batal</Button><Button variant="hero" onClick={doImport}>Impor</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}