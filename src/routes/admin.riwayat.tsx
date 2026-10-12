import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Pill, card, selectCls } from "@/components/shared";
import { API_URL } from "@/lib/api";
export const Route = createFileRoute("/admin/riwayat")({
  component: RiwayatPage,
});

const ACTIONS = ["Semua", "Memilih", "Login Admin", "Kandidat", "Pemilih", "Pengaturan"];
const PER = 8; // Jumlah data per halaman

function RiwayatPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [a, setA] = useState("Semua");
  const [page, setPage] = useState(1);

  // Mengambil data riwayat dari MySQL
  const fetchRiwayat = async () => {
    try {
      const response = await fetch("${API_URL}/api/admin/riwayat");
      const data = await response.json();
      if (data.status === 'success') {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat", error);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // Filter pencarian dan kategori
  const rows = history.filter((h) => 
    (a === "Semua" || h.aksi === a) && 
    `${h.aktor} ${h.detail}`.toLowerCase().includes(q.toLowerCase())
  );
  
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const cur = Math.min(page, pages);
  const view = rows.slice((cur - 1) * PER, cur * PER);

  // Format tanggal menjadi format lokal Indonesia
  const fmtTimeLocal = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <PageHeader title="Riwayat Aktivitas" desc="Jejak audit seluruh aktivitas sistem." />
      
      <div className={card}>
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari aktivitas..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="h-10 pl-9" />
          </div>
          <select aria-label="Filter aksi" className={selectCls} value={a} onChange={(e) => { setA(e.target.value); setPage(1); }}>
            {ACTIONS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        
        <ul>
          {view.map((h) => (
            <li key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{h.aktor}</p>
                <p className="truncate text-sm text-muted-foreground">{h.detail}</p>
              </div>
              <div className="text-right">
                <Pill tone={h.aksi === "Memilih" ? "success" : "accent"}>{h.aksi}</Pill>
                <p className="mt-1 text-xs text-muted-foreground">{fmtTimeLocal(h.created_at)}</p>
              </div>
            </li>
          ))}
          {!view.length && <li className="px-4 py-10 text-center text-muted-foreground">Belum ada aktivitas.</li>}
        </ul>
        
        <div className="flex items-center justify-between border-t p-4 text-sm">
          <span className="text-muted-foreground">Halaman {cur} dari {pages} · {rows.length} entri</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Sebelumnya" disabled={cur <= 1} onClick={() => setPage(cur - 1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="Berikutnya" disabled={cur >= pages} onClick={() => setPage(cur + 1)}><ChevronRight /></Button>
          </div>
        </div>
      </div>
    </>
  );
}