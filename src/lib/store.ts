import { useSyncExternalStore } from "react";
import p1 from "@/assets/paslon-1.jpeg";
import p2 from "@/assets/paslon-2.jpeg";
import p3 from "@/assets/paslon-3.jpeg";

export type ElectionStatus = "Draft" | "Berlangsung" | "Selesai";
export interface Candidate {
  id: string;
  number: number;
  ketua: string;
  wakil: string;
  photo: string;
  visi: string;
  misi: string[];
  program: string[];
}
export interface Student {
  nisn: string;
  name: string;
  kelas: string;
  votedFor: string | null;
  votedAt: string | null;
}
export interface HistoryItem {
  id: number;
  time: string;
  actor: string;
  action: "Memilih" | "Login Admin" | "Kandidat" | "Pemilih" | "Pengaturan";
  detail: string;
}
export interface AppState {
  election: { name: string; start: string; end: string; status: ElectionStatus };
  candidates: Candidate[];
  students: Student[];
  history: HistoryItem[];
  currentNisn: string | null;
  adminLoggedIn: boolean;
}

export const KELAS: string[] = ["7A", "7B", "8A", "8B", "9A", "9B"];

const s = (nisn: string, name: string, kelas: string, votedFor: string | null = null, votedAt: string | null = null): Student => ({ nisn, name, kelas, votedFor, votedAt });

export function createSeed(): AppState {
  const students: Student[] = [
    s("0081234501", "Aditya Ramadhan", "7A", "c1", "2026-10-09T07:12:00"),
    s("0081234502", "Bunga Lestari", "7B"),
    s("0081234503", "Cahya Nugraha", "8A", "c2", "2026-10-09T07:20:00"),
    s("0081234504", "Dewi Anggraini", "8B", "c1", "2026-10-09T07:31:00"),
    s("1234567890", "Eko Saputra", "9A")
  
  ];
  let id = 1;
  const history: HistoryItem[] = ([
    { id: id++, time: "2026-10-09T06:45:00", actor: "admin", action: "Login Admin" as const, detail: "Admin masuk ke panel" },
    { id: id++, time: "2026-10-09T06:50:00", actor: "admin", action: "Pengaturan" as const, detail: "Status pemilihan diubah ke Berlangsung" },
    ...students
      .filter((x) => x.votedAt)
      .map((x) => ({ id: id++, time: x.votedAt!, actor: x.name, action: "Memilih" as const, detail: `${x.kelas} memberikan suara` })),
  ] as HistoryItem[]).reverse();
  return {
    election: { name: "Pemilihan Ketua OSIS 2026/2027", start: "2026-10-09T07:00", end: "2026-10-09T14:00", status: "Berlangsung" },
    
candidates: [
  {
    id: "c1",
    number: 1,
    ketua: "Naufal Vianza Ziggy Puta",
    wakil: "Esti Anamarie Simanjuntak",
    photo: p1,
    visi: "Mewujudkan OSIS SMPN 1 Cibitung menjadi organisasi yang aktif dalam lingkungan sekolah maupun media sosial, informatif, dan mampu mewadahi potensi siswa/siswi khususnya dalam bidang non akademik demi mencapai siswa/siswi yang kreatif, berprestasi, berkepribadian baik, serta memiliki kepedulian terhadap lingkungan sekitar.",
    misi: [
      "Membangun hubungan dan komunikasi yang baik antara OSIS dengan warga sekolah maupun dengan organisasi atau ekstrakurikuler yang ada di SMPN 1 Cibitung.",
      "Menyelenggarakan kegiatan yang dapat mengembangkan potensi dan bakat siswa.",
      "Meningkatkan kesadaran siswa/i tentang pentingnya berpakaian rapi, serta berperilaku dan bertata krama baik demi terciptanya lingkungan sekolah yang harmonis dan tentram.",
      "Meningkatkan kesadaran siswa/i akan pentingnya menjaga lingkungan sekitar dan mengurangi sampah yang ada di lingkungan sekolah.",
      "Mengevaluasi kegiatan osis periode sebelumnya, serta melanjutkan dan membaharui program kerja yang telah dilakukan oleh osis periode sebelumnya."
    ],
    program: [
      "Bank Sampah: Program ini bertujuan untuk menanggulangi krisis sampah plastik di sekolah. Mengumpulkan gelas plastik, botol plastik, dan galon tekonan daur ulang, serta mengurangi volume sampah plastik dan meningkatkan kepedulian lingkungan.",
      "Time Sapa: Menyelenggarakan kegiatan setiap ekstrakurikuler dengan cara tiket sapa untuk mendukung kedisiplinan serta meningkatkan kesadaran etika, seperti berpakaian rapi sesuai aturan atau kegiatan khusus dan kedisiplinan melalui senyum sapa. Tujuannya adalah untuk mengaktifkan sanksi sosial OSIS dan membangun hubungan kekeluargaan yang baik dengan seluruh ekstrakurikuler.",
      "Prokif (Papan Kreasi Informatif): Papan Kreasi Informatif adalah papan mading yang diisi dengan berbagai informasi penting seperti pemberitahuan, pengetahuan, dan juga info-info lomba yang sering diselenggarakan maupun luar sekolah. Bertujuan bahwa informasi terkait informasi terjadwal bagi seluruh siswa di SMPN 1 Cibitung, serta mempermudah akses informasi secara menyeluruh.",
      "Notsari (Nonton Bareng Kreativitas Seni): Mengadakan show perfomance untuk menyalurkan bakat siswa-siswi. Wadah bagi siswa-siswi dalam menampilkan karya serta mengeksplorasi minat dan mengekspresikan bakat yang dimiliki oleh siswa."
    ]
  },
  {
    id: "c2",
    number: 2,
    ketua: "Ranida Orfa Dhani",
    wakil: "Jihan SSahfara Nisa Salsabila",
    photo: p2,
    visi: "Menjadikan OSIS SMPN 1 Cibitung sebagai organisasi yang menonjolkan sikap keagamaan, peningkatan kualitas siswa melalui ekstrakurikuler akademik maupun non akademik, penggunaan media sosial dengan bijak, meningkatkan komunikasi kepada siswa, serta kepedulian terhadap lingkungan. Dan menjadi organisasi yang unggul, mampu bertanggung jawab, mandiri, dan meningkatkan kegiatan olahraga sebagai wadah untuk meningkatkan kesehatan dan kebugaran siswa.",
    misi: [
      "Mengutamakan nilai keimanan yang maha Esa sebagai landasan dalam menjalankan kegiatan, guna meningkatkan ketakwaan dan ketaqwaan siswa.",
      "Mengoptimalkan ekstrakurikuler yang ada di SMP Negeri 1 Cibitung, sehingga dapat meningkatkan minat dan bakat siswa.",
      "Mengoptimalkan peran media sosial untuk menunjang kegiatan sekolah.",
      "Membangun komunikasi yang efektif antara siswa dengan pengurus OSIS untuk menerima masukan ide dan saran.",
      "Mengutamakan kebersihan lingkungan agar terciptanya lingkungan yang bersih, indah dan sehat."
    ],
    program: [
      "Melanjutkan dan mengembangkan program kerja sebelumnya: seperti maulid nabi, classmeeting, lomba perayaan hari kemerdekaan Indonesia, dll.",
      "Mengembangkan media sosial: guna menunjang seluruh kegiatan sekolah, organisasi dan dapat menginspirasi siswa.",
      "Betak (Kotak Aspirasi Siswa): wadah menampung aspirasi siswa dalam sebelum melaksanakan kegiatan maupun setelah melaksanakan kegiatan.",
      "Penghijauan lingkungan bias: guru menginisiasi penanaman pohon atau tanaman dan perawatan tanaman.",
      "Melaksanakan kegiatan olahraga rutin maupun pada Hari Olahraga Nasional atau pun classmeeting."
    ]
  },
  {
    id: "c3",
    number: 3,
    ketua: "Oonita Aqila Hananisa",
    wakil: "Safira Putri",
    photo: p3,
    visi: "Mewujudkan OSIS SMPN 1 Cibitung yang menginspirasi, aktif, dan aspiratif serta memiliki komunikasi efektif antar anggota agar terwujudnya siswa/i yang berbudi luhur dan disiplin serta mampu mengembangkan minat, bakat, dan kreativitas siswa/i.",
    misi: [
      "Mendengarkan dan memperjuangkan segala bentuk aspirasi siswa/i baik dalam kelas maupun diluar kelas.",
      "Membangun komunikasi yang efektif antara siswa, guru, dan pihak sekolah.",
      "Menciptakan suasana organisasi yang tanggung jawab terhadap tugas yang diemban.",
      "Menumbuhkan kesadaran siswa/i untuk menerapkan nilai-nilai Pancasila, sopan santun, dan disiplin dalam kehidupan sehari-hari di sekolah.",
      "Mengadakan iven yang menarik serta berguna untuk mengasah minat dan bakat siswa/i."
    ],
    program: [
      "FOSAST (Forum Suara Siswa): Program kerja ini diisi dengan menyalurkan suara aspirasi seperti Kotak Kosong yang akan diisi dengan aspirasi-aspirasi siswa/i. Tujuannya: Agar siswa/i dapat menyampaikan aspirasinya.",
      "Menyediakan Mading Mading: Program kerja ini, kami akan berkolaborasi dengan Tim Literasi. Tujuannya: Untuk menarik, mendorong kreativitas siswa/i melalui mading serta mengembangkan minat dan bakat siswa/i di bidang seni.",
      "Mengadakan Tika Pancasila di Hari Besar Nasional: Program ini akan dilanjutkan di setiap ada hari besar nasional. Tujuannya: Menumbuhkan kesadaran nilai-nilai Pancasila bukan kehidupan sehari-hari, menumbuhkan rasa cinta tanah air, serta memperingati kebersamaan."
    ]
  }
],
    students,
    history,
    currentNisn: null,
    adminLoggedIn: false,
  };
}

type G = { __evote?: { state: AppState | null; listeners: Set<() => void> } };
const g = globalThis as G;
const box = (g.__evote ??= { state: null, listeners: new Set() });
const listeners = box.listeners;

const KEY = "evote-state";

const get = (): AppState => {
  if (!box.state) {
    let saved: AppState | null = null;

    if (typeof window !== "undefined") {
      try {
        // Utamakan data bersama antar-tab
        const shared = localStorage.getItem(KEY);

        if (shared) {
          saved = JSON.parse(shared);
        } else {
          // Migrasikan data lama dari sessionStorage
          const old = sessionStorage.getItem(KEY);

          if (old) {
            saved = JSON.parse(old);
            localStorage.setItem(KEY, JSON.stringify(saved));
          }
        }
      } catch (error) {
        console.error("Gagal membaca data pemilu:", error);
      }
    }

    box.state = saved ?? createSeed();
  }

  return box.state;
};

const emit = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(box.state));
    } catch (error) {
      console.error("Gagal menyimpan data pemilu:", error);
    }
  }

  listeners.forEach((listener) => listener());
};

// Perbarui tampilan ketika data berubah dari tab lain
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY || !event.newValue) return;

    try {
      box.state = JSON.parse(event.newValue) as AppState;
      listeners.forEach((listener) => listener());
    } catch (error) {
      console.error("Gagal menyinkronkan data pemilu:", error);
    }
  });
}


export function setState(fn: (s: AppState) => AppState) {
  box.state = fn(get());
  emit();
}
export function resetStore() {
  box.state = createSeed();
  emit();
}
export function getState() {
  return get();
}
export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => sel(get()),
    () => sel(get()),
  );
}

export function addHistory(st: AppState, actor: string, action: HistoryItem["action"], detail: string): AppState {
  const id = Math.max(0, ...st.history.map((h) => h.id)) + 1;
  return { ...st, history: [{ id, time: new Date().toISOString(), actor, action, detail }, ...st.history] };
}

export type NisnResult =
  | { ok: true; student: Student }
  | { ok: false; reason: "empty" | "format" | "notfound" | "voted" | "closed"; message: string };

export function checkNisn(st: AppState, raw: string): NisnResult {
  const nisn = raw.trim();
  if (!nisn) return { ok: false, reason: "empty", message: "NISN wajib diisi." };
  if (!/^\d{10}$/.test(nisn)) return { ok: false, reason: "format", message: "NISN harus 10 digit angka." };
  if (st.election.status !== "Berlangsung") return { ok: false, reason: "closed", message: "Pemilihan sedang tidak berlangsung." };
  const student = st.students.find((x) => x.nisn === nisn);
  if (!student) return { ok: false, reason: "notfound", message: "NISN tidak terdaftar sebagai pemilih." };
  if (student.votedFor) return { ok: false, reason: "voted", message: "NISN ini sudah memberikan suara. Terima kasih!" };
  return { ok: true, student };
}

export function castVote(nisn: string, candidateId: string) {
  setState((st) => {
    const student = st.students.find((x) => x.nisn === nisn);
    if (!student || student.votedFor) return st;
    const now = new Date().toISOString();
    const next = { ...st, students: st.students.map((x) => (x.nisn === nisn ? { ...x, votedFor: candidateId, votedAt: now } : x)) };
    return addHistory(next, student.name, "Memilih", `${student.kelas} memberikan suara`);
  });
}

export function startCountdown(seconds: number, onTick: (n: number) => void, onDone: () => void) {
  let n = seconds;
  onTick(n);
  const t = setInterval(() => {
    n -= 1;
    onTick(n);
    if (n <= 0) {
      clearInterval(t);
      onDone();
    }
  }, 1000);
  return () => clearInterval(t);
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
