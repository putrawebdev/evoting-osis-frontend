# Aplikasi PILKAOS

Aplikasi pemilihan Ketua dan Wakil Ketua OSIS berbasis React, TypeScript, TanStack Router, dan Tailwind CSS.

## Menjalankan project

Pastikan Node.js sudah terpasang. Project ini menggunakan pnpm.

```bash
pnpm install
pnpm dev
```

Buka alamat lokal yang ditampilkan di terminal.

## Pemeriksaan project

```bash
pnpm lint
pnpm test
pnpm build
```

## Catatan fitur

- Data demo disimpan di `localStorage` browser.
- Data `localStorage` hanya tersedia pada browser/perangkat yang sama; aplikasi ini belum menggunakan database/server bersama.
- Fitur ekspor PDF dan Excel pada halaman Pengaturan saat ini masih simulasi dan belum menghasilkan file unduhan.
- Login admin saat ini perlu ditinjau sebelum aplikasi digunakan sungguhan; jangan gunakan untuk data pemilu nyata tanpa autentikasi dan penyimpanan server yang aman.
