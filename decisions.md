# Decisions — Haitham Tech Website

> ADR-lite. Append-only. Menjawab **kenapa**, bukan **apa** (aturan ada di CLAUDE.md, spesifikasi di SPEC.md).
> Format per blok: tanggal · keputusan · alternatif yang ditolak · alasan.

---

## 2026-07-24 — Situs statis, bukan aplikasi dinamis
**Keputusan:** Website dibangun sebagai situs statis murni, tanpa backend aplikasi.
**Ditolak:** Situs dinamis dengan backend + database.
**Alasan:** Konten (halaman marketing + artikel) sama untuk semua pengunjung dan jarang berubah. Tidak ada login, form, atau data pengguna. Statis memberi kecepatan, keamanan, dan Core Web Vitals terbaik — yang langsung mendukung tujuan utama situs, yaitu SEO. Backend akan jadi kompleksitas tanpa manfaat.

## 2026-07-24 — Astro sebagai SSG
**Keputusan:** Astro 7.x + TypeScript + Tailwind v4.
**Ditolak:** Next.js (terlalu berat, kekuatannya di rendering hibrida & fitur aplikasi yang tidak kita butuhkan); Hugo (kurva belajar templating Go, di luar ekosistem JS/TS yang dikuasai).
**Alasan:** Astro dirancang untuk situs berbasis konten, zero-JS by default (ideal untuk SEO), punya Content Collections bawaan untuk artikel Markdown, dan tetap di ekosistem JS/TS.

## 2026-07-24 — Update konten via Git push, bukan CMS
**Keputusan:** Artikel ditulis sebagai file `.md` di repo; publish lewat `git push` → GitHub Actions → rsync ke VPS.
**Ditolak:** (a) Deploy manual via SSH di VPS — repetitif dan rawan lupa langkah; (b) CMS/panel admin — satu komponen lagi yang harus dipasang & dirawat.
**Alasan:** Setelah setup sekali, biaya publikasi mendekati nol. Bonusnya besar: GitHub jadi sumber kebenaran + backup + riwayat versi otomatis. CMS bisa ditambahkan belakangan bila kebutuhan menulis benar-benar terasa berat.

## 2026-07-24 — Blog tech berbahasa Inggris dipisah dari proyek ini
**Keputusan:** Situs ini murni Bahasa Indonesia dan hanya memuat artikel di orbit AI customer service.
**Ditolak:** Menyatukan blog tech/AI berbahasa Inggris (target pembaca barat) di domain yang sama.
**Alasan:** Dua audiens berbeda bahasa, pasar, dan maksud pencarian. Mencampurnya mengaburkan sinyal topikal situs dan melemahkan peringkat keduanya. Fokus satu tema membangun *topical authority*.

## 2026-07-24 — Konversi lewat link WhatsApp & email, tanpa form
**Keputusan:** CTA mengarah ke `wa.me` dan `mailto:`.
**Ditolak:** Form kontak dengan pemrosesan backend / layanan email.
**Alasan:** Volume calon klien di awal diperkirakan rendah, jadi form belum sepadan. Menghindari form juga yang membuat situs bisa tetap 100% statis — keputusan ini dan keputusan "situs statis" saling menopang.

## 2026-07-24 — Caddy untuk penyajian & HTTPS
**Keputusan:** Caddy di Docker sebagai web server.
**Ditolak:** nginx.
**Alasan:** Caddy mengurus sertifikat HTTPS secara otomatis (terbit & perpanjang sendiri). nginx butuh konfigurasi SSL manual — beban perawatan tanpa manfaat tambahan untuk kasus ini.

## 2026-07-24 — Analytics via cloud (Cloudflare Web Analytics), BUKAN self-host
**Keputusan:** Cloudflare Web Analytics (cloud, gratis, ramah privasi, tanpa cookie).
**Ditolak:** (a) Google Analytics — berat & butuh banner cookie; (b) **Umami self-host + Postgres di VPS** — sempat direncanakan, lalu dibatalkan.
**Alasan:** Rencana awal (Umami self-host) mengcontradiksi premis inti proyek ini. Keputusan "abaikan fondasi backup/keamanan" (lihat blok di bawah) dibangun di atas klaim "tidak ada database, blast radius = situs mati sementara" — tapi Umami+Postgres justru database stateful dengan data yang bisa hilang dan permukaan serangan. Untuk pemula solo, itu beban ops terbesar di seluruh proyek. Analytics cloud memberi privasi & keringanan yang sama tanpa database, sehingga premis "tidak ada state di VPS" jadi benar-benar konsisten. (Ditemukan lewat review sesi bersih.) Google Search Console tetap dipakai — fungsinya beda (data pencarian) dan wajib untuk SEO.

## 2026-07-24 — Halaman Layanan digabung, bukan dipisah per paket
**Keputusan:** Satu halaman Layanan dengan dua seksi (`#basic`, `#business`).
**Ditolak:** Halaman terpisah per paket.
**Alasan:** Lebih ramping untuk v1 dan memudahkan pengunjung membandingkan paket dalam satu tampilan. Mudah dipecah nanti bila konten tiap paket tumbuh besar.

## 2026-07-24 — Test suite ditunda untuk v1
**Keputusan:** Tidak menulis test otomatis. Gerbang "selesai" cukup `npm run build` (sudah termasuk `astro check`).
**Ditolak:** Menerapkan test-sebagai-kontrak (TDD) sesuai OS manual bagian C.2.
**Alasan:** Tidak ada business logic untuk diuji — hanya halaman statis dan konten. Typecheck + build sudah menangkap kelas kesalahan yang nyata di sini. Menulis test untuk situs marketing statis adalah upacara tanpa manfaat, dan melanggar prinsip "jangan bangun sistem sebelum ada bukti perlu".

## 2026-07-24 — Sebagian besar OS manual Bagian D tidak diterapkan
**Keputusan:** Trust boundary database, staging environment, backup terjadwal, dan error tracking tidak dipasang untuk v1.
**Ditolak:** Menerapkan seluruh fondasi keamanan/ops dari manual.
**Alasan:** Manual itu ditujukan untuk proyek dengan sistem yang bisa rusak permanen (database, data pengguna, kredensial produksi). Proyek ini tidak punya satu pun — blast radius maksimalnya adalah situs mati sementara, dan GitHub menyimpan seluruh aset. Backup sudah terpenuhi otomatis lewat Git; staging diganti `npm run preview` lokal.
**Pengecualian yang tetap berlaku:** kredensial SSH VPS dan sifat destruktif `rsync --delete` — ini satu-satunya kelas "tidak bisa di-reset" di proyek ini, dan diatur di CLAUDE.md.
**Catatan pasca-review:** premis "tidak ada database di VPS" kini benar-benar utuh karena analytics dipindah ke cloud (lihat keputusan analytics di atas). Sebelumnya premis ini bocor oleh rencana Umami self-host.

## 2026-07-24 — Koreksi detail versi hasil review sesi bersih
**Keputusan:** SPEC diperbaiki agar sesuai API Astro 5+/7 dan Tailwind v4: `@tailwindcss/vite` (bukan `@astrojs/tailwind`), token via `@theme{}` di CSS (tanpa `tailwind.config.js`), Content Collections di `src/content.config.ts` dengan glob loader + `z.coerce.date()`, `site` di-set untuk sitemap/OG absolut, `trailingSlash: 'never'`, redirect www→non-www, halaman 404, dan link-checker (`linkinator`) sebagai pengganti test.
**Ditolak:** Menulis dengan pola versi lama (Tailwind v3, Content Collections pra-Astro-5).
**Alasan:** Draf SPEC awal memakai pola versi lama yang akan memaksa agen coding menebak API benar — persis kelas kesalahan yang SPEC dirancang untuk dicegah. Beberapa (spt `site` hilang) gagal senyap: build sukses tapi SEO rusak. Ditemukan lewat review model bersih; arsitektur & filosofi proyek sendiri lolos tanpa perubahan.
