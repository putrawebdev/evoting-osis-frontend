import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader, card } from "@/components/shared";
import { API_URL } from "@/lib/api";

export const Route = createFileRoute("/admin/kandidat")({
  component: KandidatPage,
});

type Form = {
  ketua: string; wakil: string; visi: string; misi: string; program: string; photoPreview: string; photoFile: File | null;
};
const empty: Form = { ketua: "", wakil: "", visi: "", misi: "", program: "", photoPreview: "", photoFile: null };

function KandidatPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [edit, setEdit] = useState<any | "new" | null>(null);
  const [del, setDel] = useState<any | null>(null);
  const [f, setF] = useState<Form>(empty);

  const fetchKandidat = async () => {
    try {
      const res = await fetch("https://evoting-osis-backend.wasmer.app/api/admin/kandidat");
      const data = await res.json();
      setCandidates(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchKandidat(); }, []);

  const open = (c: any | "new") => {
    setEdit(c);
    setF(c === "new" ? { ...empty } : {
      ketua: c.nama_ketua, wakil: c.nama_wakil, visi: c.visi, 
      misi: c.misi, program: c.proggram, 
      photoPreview: c.foto ? `https://evoting-osis-backend.wasmer.app/api/kandidat/foto/${c.foto.replace('kandidat/', '')}` : "", photoFile: null
    });
  };

  const save = async () => {
    if (!f.ketua.trim() || !f.wakil.trim()) { toast.error("Nama ketua dan wakil wajib diisi."); return; }
    
    const formData = new FormData();
    formData.append('nama_ketua', f.ketua);
    formData.append('nama_wakil', f.wakil);
    formData.append('visi', f.visi);
    formData.append('misi', f.misi);
    formData.append('program', f.program);
    if (f.photoFile) formData.append('foto', f.photoFile);

    try {
      const url = edit === "new" 
        ? "https://evoting-osis-backend.wasmer.app/api/admin/kandidat" 
        : `https://evoting-osis-backend.wasmer.app/api/admin/kandidat/${edit.id}`;
        
      const res = await fetch(url, { method: "POST", body: formData });
      
      if (res.ok) {
        toast.success(edit === "new" ? "Kandidat ditambahkan" : "Kandidat diperbarui");
        setEdit(null);
        fetchKandidat(); // Refresh data
      } else {
        toast.error("Gagal menyimpan data");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  const remove = async () => {
    if (!del) return;
    try {
      const res = await fetch(`https://evoting-osis-backend.wasmer.app/api/admin/kandidat/${del.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Kandidat dihapus");
        setDel(null);
        fetchKandidat();
      }
    } catch (err) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <>
      <PageHeader title="Kandidat" desc="Kelola pasangan calon yang tampil di halaman pemilih." action={<Button variant="hero" size="lg" onClick={() => open("new")}><Plus /> Tambah Paslon</Button>} />
      
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {candidates.map((c) => (
          <div key={c.id} className={`${card} overflow-hidden`}>
            <div className="relative aspect-[4/3]">
              <img 
                src={c.foto ? `https://evoting-osis-backend.wasmer.app/api/kandidat/foto/${c.foto.replace('kandidat/', '')}` : ""} 
                alt={c.nama_ketua} 
                className="h-full w-full object-cover bg-muted" 
              />
              <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero font-extrabold text-primary-foreground">{c.no_paslon}</span>
            </div>
            <div className="p-5">
              <p className="font-bold">{c.nama_ketua} & {c.nama_wakil}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.visi}</p>
              <p className="mt-3 text-lg"><span className="font-bold text-primary" style={{ fontSize: "25px" }}>{c.jumlah_suara}</span> suara</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => open(c)}><Pencil /> Edit</Button>
                <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive-soft hover:text-destructive" onClick={() => setDel(c)}><Trash2 /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{edit === "new" ? "Tambah paslon" : "Edit paslon"}</DialogTitle><DialogDescription>Lengkapi data pasangan calon.</DialogDescription></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Ketua<Input className="mt-1" value={f.ketua} onChange={(e) => setF({ ...f, ketua: e.target.value })} /></label>
            <label className="text-sm font-semibold">Wakil<Input className="mt-1" value={f.wakil} onChange={(e) => setF({ ...f, wakil: e.target.value })} /></label>
          </div>
          <label className="block text-sm font-semibold">Visi<Textarea className="mt-1" value={f.visi} onChange={(e) => setF({ ...f, visi: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Misi<Textarea className="mt-1" rows={3} value={f.misi} onChange={(e) => setF({ ...f, misi: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Program kerja<Textarea className="mt-1" rows={3} value={f.program} onChange={(e) => setF({ ...f, program: e.target.value })} /></label>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Foto pasangan calon
              <Input type="file" accept="image/jpeg,image/png,image/webp" className="mt-2" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setF(prev => ({ ...prev, photoFile: file, photoPreview: URL.createObjectURL(file) }));
              }} />
            </label>
            {f.photoPreview && <img src={f.photoPreview} alt="Preview" className="mt-2 h-32 rounded-lg object-contain border" />}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setEdit(null)}>Batal</Button>
            <Button type="button" variant="hero" onClick={save}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Hapus paslon {del?.no_paslon}?</DialogTitle><DialogDescription>{del?.nama_ketua} & {del?.nama_wakil} akan dihapus.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDel(null)}>Batal</Button><Button variant="destructive" onClick={remove}>Hapus</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}