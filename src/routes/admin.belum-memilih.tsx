import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AlertTriangle, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Pill, card } from "@/components/shared";

// Hapus import useStore yang lama

export const Route = createFileRoute("/admin/belum-memilih")({
  component: BelumPage,
});

function BelumPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data langsung dari MySQL (hanya siswa yang belum memilih)
  const fetchBelumMemilih = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/belum-memilih");
      const data = await response.json();
      if (data.status === 'success') {
        setRows(data.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil data siswa yang belum memilih.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBelumMemilih();
    // Opsional: Buat auto-refresh tiap 10 detik agar daftarnya berkurang otomatis
    const interval = setInterval(fetchBelumMemilih, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageHeader title="Belum Memilih" desc="Daftar siswa yang belum menggunakan hak pilih." />
      
      {!loading && rows.length > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-destructive-soft p-4 text-sm text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p><b>{rows.length} siswa</b> belum memberikan suara.</p>
        </div>
      )}
      
      <div className={card}>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <p>Memuat daftar pemilih...</p>
          </div>
        ) : rows.length ? (
          <ul>
            {rows.map((s) => (
              <li key={s.nis} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-0">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive-soft font-bold text-destructive uppercase">
                  {s.nama ? s.nama[0] : "?"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{s.nama}</p>
                  <p className="text-xs text-muted-foreground">{s.nis} · {s.kelas || "Kelas tidak diketahui"}</p>
                </div>
                <Pill tone="danger"><AlertTriangle className="h-3 w-3" /> Belum</Pill>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <PartyPopper className="h-10 w-10 text-success" />
            <p className="font-semibold text-lg">Luar Biasa!</p>
            <p className="text-sm text-muted-foreground">Semua siswa di database sudah memberikan suara.</p>
          </div>
        )}
      </div>
    </>
  );
}