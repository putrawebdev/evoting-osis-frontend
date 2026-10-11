import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { CheckCircle2, UserX, Users, UsersRound } from "lucide-react";
import { MetricCard, PageHeader, card } from "@/components/shared";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function Dashboard() {
  const [active, setActive] = useState<number | null>(null);
  
  // State untuk menyimpan data dari Laravel
  const [stats, setStats] = useState({
    partisipasi: { total: 0, sudah: 0, belum: 0, persentase: 0 },
    kandidat: [] as any[],
    kelas: [] as any[] // Menampung data partisipasi per kelas
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://192.168.10.103:8000/api/admin/dashboard-stats");
        const data = await response.json();
        if (data.status === 'success') {
          setStats(data);
        }
      } catch (error) {
        console.error("Gagal mengambil live count", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Auto-refresh tiap 3 detik
    return () => clearInterval(interval);
  }, []);

  const data = stats.kandidat.map((c: any) => ({ 
    name: `Paslon ${c.nomor}`, 
    full: `${c.ketua} & ${c.wakil}`, 
    value: c.suara 
  }));

  const voted = stats.partisipasi.sudah;
  const pct = stats.partisipasi.persentase;

  return (
    <>
      <PageHeader title="Dashboard" desc="Pantau hasil dan partisipasi secara langsung." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Total Pemilih" value={stats.partisipasi.total} hint="Siswa terdaftar" />
        <MetricCard icon={CheckCircle2} label="Sudah Memilih" value={voted} tone="success" hint={`${pct}% partisipasi`} />
        <MetricCard icon={UserX} label="Belum Memilih" value={stats.partisipasi.belum} tone="danger" hint="Belum berpartisipasi" />
        <MetricCard icon={UsersRound} label="Pasangan Calon" value={stats.kandidat.length} tone="accent" hint="Terdaftar" />
      </div>

      <div className={`${card} mt-6 p-5`}>
        <div className="flex items-center justify-between"><p className="font-semibold">Progress partisipasi</p><p className="text-2xl font-extrabold text-primary">{pct}%</p></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-hero transition-all duration-700" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-6">
        
        {/* BAGIAN KIRI: BAR CHART KANDIDAT (BALOK) */}
        <div className={`${card} p-5 lg:col-span-4`}>
          <p className="font-semibold mb-4">Perolehan suara</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", backgroundColor: "var(--background)" }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Keterangan detail nama paslon di bawah chart */}
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2 rounded-lg p-2 bg-muted/50 text-xs">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
                <span className="font-semibold">{d.name}:</span>
                <span className="truncate text-muted-foreground">{d.full}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BAGIAN KANAN: PARTISIPASI PER KELAS */}
        <div className={`${card} p-5 lg:col-span-2`}>
          <p className="font-semibold">Partisipasi per kelas</p>
          <ul className="mt-4 max-h-[320px] space-y-4 overflow-y-auto pr-2">
            {stats.kelas.map((k, idx) => {
              const p = k.total_siswa > 0 ? Math.round((k.sudah_memilih / k.total_siswa) * 100) : 0;
              return (
                <li key={idx}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{k.kelas}</span>
                    <span className="text-muted-foreground">{k.sudah_memilih}/{k.total_siswa} · {p}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${p}%` }} />
                  </div>
                </li>
              );
            })}
            {!stats.kelas.length && (
              <li className="text-center text-sm text-muted-foreground py-4">Belum ada data kelas.</li>
            )}
          </ul>
        </div>

      </div>
    </>
  );
}