# SPEC — Website Marketing "Haitham Tech" (AI Customer Service)

> Dokumen ini adalah roadmap teknis yang mengikat. AI writer (Sonnet) **harus mengikuti spec ini** dan tidak berimprovisasi di luar yang ditentukan. Jika ada ambiguitas, pilih opsi paling sederhana yang sesuai prinsip di Bagian 2, dan tandai dengan komentar `TODO:` alih-alih menebak.

---

## 1. Ringkasan Proyek

- **Nama merek:** Haitham Tech
- **Tagline:** "AI Customer Service untuk Bisnis Indonesia"
- **Tujuan situs:** Marketing jasa **AI Customer Service Agent** (paket Basic & Business) + mesin konten SEO untuk menjaring calon klien.
- **Target audiens:** Pemilik bisnis Indonesia — UMKM, klinik, agensi, bisnis online.
- **Bahasa:** **Bahasa Indonesia** (seluruh situs). Atribut HTML `lang="id"`.
- **Model konversi:** Mengarahkan pengunjung ke **WhatsApp** dan **email** (tidak ada form backend di v1).
- **Domain produksi:** `haithamtech.com`
- **Tone:** Santai tapi kredibel (B2B). Ramah, jelas, tidak kaku, tidak lebay.

---

## 2. Prinsip & Batasan (WAJIB dipatuhi)

1. **Situs statis murni.** Output Astro adalah HTML/CSS statis. TIDAK ADA backend aplikasi, TIDAK ADA database untuk konten, TIDAK ADA CMS di v1.
2. **Minim JavaScript.** Pertahankan keunggulan Astro (zero-JS by default). Tambahkan JS di sisi klien hanya bila benar-benar perlu (mis. animasi chat preview), dan seringan mungkin.
3. **Semua konten Bahasa Indonesia.**
4. **Fokus topikal (topical authority).** Seluruh artikel harus berada di orbit **AI customer service** dan turunannya (otomatisasi CS, chatbot WhatsApp, efisiensi layanan pelanggan, dsb). Jangan membuat artikel di luar tema ini.
5. **JANGAN** menyebut, membuat, atau menyiapkan blog berbahasa Inggris / blog teknologi umum. Itu proyek terpisah dan di luar scope.
6. **Modular.** Beranda dan halaman lain disusun dari komponen section terpisah (satu file per section) agar penambahan konten di masa depan mudah dan aman.
7. **Kesederhanaan.** Hindari abstraksi prematur, dependency yang tidak perlu, dan over-engineering.
8. **Placeholder eksplisit.** Untuk data riil yang belum tersedia (nomor WA, email, IP VPS, angka statistik, detail pribadi), gunakan placeholder yang jelas dan mudah dicari (lihat Bagian 12), jangan mengarang data seolah fakta.

---

## 3. Tech Stack (versi dipatok)

| Komponen | Pilihan | Catatan |
|---|---|---|
| SSG / Framework | **Astro 7.x** (versi stabil terbaru saat setup) | Zero-JS by default, ideal untuk konten + SEO |
| Runtime | **Node.js 22 LTS** (22.12.0+) | Wajib untuk Astro 7 |
| Bahasa | **TypeScript** | Strict mode |
| Styling | **Tailwind CSS v4** via plugin **`@tailwindcss/vite`** | JANGAN pakai `@astrojs/tailwind` (deprecated sejak Astro 5.2). Di v4 TIDAK ADA `tailwind.config.js` — token didefinisikan di CSS via `@theme {}` (lihat §7) |
| Konten artikel | **Astro Content Collections** + **Markdown (`.md`) saja** | Skema frontmatter divalidasi dengan Zod. TIDAK pakai MDX di v1 |
| Sitemap | `@astrojs/sitemap` | Butuh `site` di-set (lihat §8). Generate `sitemap.xml` |
| Optimasi gambar | Bawaan Astro (`<Image />`, sharp) | WebP/AVIF, lazy load |
| Package manager | **npm** | Gunakan `npm ci` di CI |
| Config wajib | `site: 'https://haithamtech.com'` + `trailingSlash: 'never'` di `astro.config.mjs` | WAJIB (lihat §8). Tanpa `site`, sitemap & OG rusak senyap |
| Pencarian di situs | (opsional, di luar v1) Pagefind | Jangan pasang di v1 kecuali diminta |

Jangan menambah framework UI (React/Vue/Svelte) kecuali ada kebutuhan interaktif yang tidak bisa diselesaikan dengan `.astro` + sedikit vanilla JS.

---

## 4. Struktur Folder Proyek

```
haithamtech-web/
├── src/
│   ├── components/          # Komponen kecil reusable (Button, Card, WhatsAppCTA, dll.)
│   ├── layouts/             # BaseLayout.astro (head, meta, SEO), ArticleLayout.astro
│   ├── sections/            # Section modular Beranda & halaman (Hero, Features, SocialProof, dll.)
│   ├── pages/
│   │   ├── index.astro          # Beranda
│   │   ├── layanan.astro        # Halaman Layanan (2 seksi paket)
│   │   ├── tentang.astro        # Tentang
│   │   ├── kontak.astro         # Kontak
│   │   ├── 404.astro            # Halaman 404 (dengan jalur balik ke Beranda/CTA)
│   │   └── artikel/
│   │       ├── index.astro      # Daftar artikel
│   │       └── [slug].astro     # Halaman artikel dinamis dari content collection
│   ├── content.config.ts        # Definisi & skema collection 'blog' (loader glob) — DI SINI, bukan src/content/
│   ├── content/
│   │   └── blog/                # File artikel .md
│   ├── styles/
│   │   └── global.css           # @import "tailwindcss" + blok @theme {} (token warna/tipografi)
│   └── consts.ts                # Konstanta situs: nama, tagline, URL, kontak, nav
├── public/                      # Aset statis (favicon, og-image, robots.txt, logo)
├── astro.config.mjs             # site, trailingSlash, integrasi sitemap, plugin @tailwindcss/vite
├── tsconfig.json
├── package.json
├── Caddyfile                    # Lihat Bagian 10
├── docker-compose.yml           # Untuk VPS (Caddy saja — analytics via cloud, lihat §11)
├── .github/workflows/deploy.yml # CI/CD
├── SPEC.md · CLAUDE.md · decisions.md
```

Simpan seluruh data yang sering diubah (nama, tagline, nomor WA, email, URL sosial, item navigasi) terpusat di `src/consts.ts` agar mudah diedit tanpa menyentuh banyak file.

---

## 5. Struktur Halaman & Konten

Navigasi utama (header): **Beranda · Layanan · Artikel · Tentang · Kontak**.
Setiap halaman memakai `BaseLayout` dan wajib memenuhi persyaratan SEO Bagian 8.

### 5.1 Beranda (`index.astro`)
Disusun dari section modular berikut (urut atas ke bawah):
1. **Hero** — headline value proposition singkat + subheadline + CTA utama "Konsultasi Gratis" (link WhatsApp) + **chat preview**.
   - Chat preview dibuat dari **HTML/CSS** menyerupai tampilan WhatsApp (gelembung pesan, opsional animasi "sedang mengetik"). Statis, tanpa backend. Boleh sedikit JS untuk animasi.
2. **Social proof** — karena belum ada klien, JANGAN menampilkan angka yang menyerupai hasil/testimoni klien nyata (risiko kredibilitas & menyesatkan). Sebagai gantinya:
   - Tampilkan **statistik riset industri** tentang adopsi/manfaat AI CS, dibingkai eksplisit sebagai kutipan riset dengan **sumber** (mis. "Menurut [sumber], X% bisnis…"). Tandai `TODO:` bila sumber/angka belum diverifikasi — jangan mengarang.
   - Boleh sertakan blok **ilustrasi** (mis. "Ilustrasi alur bila memakai AI CS") yang jelas berlabel ilustrasi, bukan klaim hasil.
   - Sediakan **slot logo klien / testimoni yang kosong** untuk diisi nanti — ini lebih jujur daripada angka simulasi.
3. **Fitur / kapabilitas utama** — grid 3–4 kolom (mis. Respon 24/7, Pengetahuan Produk, Memori Percakapan, Eskalasi ke Manusia).
4. **Ringkasan cara kerja** (versi umum & singkat) — detail lengkap ada di halaman Layanan.
5. **CTA penutup** — ajakan konsultasi + tombol WhatsApp.
6. **Footer** — link ke Layanan, Artikel, Kontak, Tentang + info kontak singkat.

### 5.2 Layanan (`layanan.astro`)
Satu halaman dengan **dua seksi paket** yang jelas terpisah (beri anchor `#basic` dan `#business`). Konten diambil dari dokumen jasa:

- **Paket Basic** — ideal untuk usaha rintisan/UMKM. Fitur: Respon Otomatis 24/7, Pengetahuan Produk & Jasa, Memori Percakapan Dasar, Pelatihan Dasar sesuai SOP. Sertakan sub-bagian **"Cara Kerja Paket Basic"** (alur singkat).
- **Paket Business** — semua fitur Basic + Kategorisasi Pelanggan Otomatis, Database Pelanggan Terstruktur (Google Sheets), Analitik Dasar, Eskalasi Cerdas (hand-off ke CS manusia via email). Sertakan sub-bagian **"Cara Kerja Paket Business"** (alur yang lebih lengkap, karena beda level/tipe).
- Setiap seksi paket diakhiri **CTA WhatsApp** ("Tanya Paket Ini").

### 5.3 Artikel (`artikel/index.astro` + `artikel/[slug].astro`)
- `index.astro`: daftar artikel (kartu: judul, deskripsi, tanggal, tag) urut terbaru.
- `[slug].astro`: render artikel dari content collection memakai `ArticleLayout`.
- **Setiap halaman artikel WAJIB** menampilkan CTA di akhir konten: ajakan ke halaman Layanan **atau** chat langsung (WhatsApp/email). Sediakan komponen `ArticleCTA` yang dipakai ulang.

### 5.4 Tentang (`tentang.astro`)
Ringkas & personal (3–4 paragraf): siapa di balik layanan (nama; slot foto opsional), misi singkat (bantu bisnis Indonesia otomatisasi CS), dan apa yang membuat berbeda/tepercaya. Tujuan: kredibilitas, bukan biografi panjang.

### 5.5 Kontak (`kontak.astro`)
Fokus aksi: tombol WhatsApp besar (CTA utama), email, jam operasional / perkiraan waktu respon, dan 2–3 FAQ singkat (mis. "Berapa lama setup?", "Apakah bisa custom sesuai SOP?"). FAQ ditandai dengan JSON-LD `FAQPage` (Bagian 8).

### 5.6 Halaman 404 (`404.astro`)
Halaman "tidak ditemukan" yang tetap on-brand: pesan ramah + link balik ke Beranda dan CTA WhatsApp, agar pengunjung yang tersesat tetap punya jalur konversi. Caddy dikonfigurasi menyajikan file ini (lihat §10).

---

## 6. Sistem Artikel (Content Collections)

Definisikan collection `blog` di **`src/content.config.ts`** (Astro 5+; BUKAN `src/content/config.ts` yang sudah deprecated) memakai **glob loader**. Bentuk yang WAJIB dipakai:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),                        // untuk <title> & H1
    description: z.string(),                   // meta description & kartu
    publishDate: z.coerce.date(),             // WAJIB coerce — frontmatter = string
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),    // tetap di orbit AI customer service
    image: z.string().optional(),             // cover untuk OG & kartu
    draft: z.boolean().default(false),        // draft tidak ikut ter-build produksi
    author: z.string().default('Haitham Tech'),
  }),
});

export const collections = { blog };
```

Catatan penting:
- Gunakan `z.coerce.date()`, BUKAN `z.date()` — tanggal di frontmatter adalah string; `z.date()` akan menggagalkan build.
- Jalankan `npx astro sync` setiap kali skema diubah agar tipe ter-generate.
- Render artikel via `render()` dari `astro:content` + `getCollection('blog')` (API Astro 5).

Aturan konten artikel:
- Semua Bahasa Indonesia, tema di orbit AI customer service.
- Contoh judul awal (boleh dibuat sebagai artikel benih): "Cara Otomatisasi Customer Service WhatsApp untuk UMKM", "Apa Itu AI Customer Service Agent dan Manfaatnya", "Berapa Biaya Chatbot AI untuk Bisnis di Indonesia", "5 Tanda Bisnis Anda Butuh CS Otomatis 24/7".
- Nama file = slug (mis. `cara-otomatisasi-cs-whatsapp-umkm.md`).

---

## 7. Desain & Branding

- **Arah visual:** bersih, ramah, terang, warna lembut. Banyak ruang putih. Sudut membulat lembut.
- **Palet (acuan, boleh disesuaikan halus):**
  - Primary: biru muda / teal lembut (mis. `#3BB4A8` atau sekitar itu) untuk aksen & tombol.
  - Aksen hangat sekunder (mis. amber lembut) untuk highlight kecil.
  - Netral: latar putih/off-white, teks abu gelap (bukan hitam pekat) untuk kesan lembut.
  - **Definisikan token di `src/styles/global.css`** memakai Tailwind v4:
    ```css
    @import "tailwindcss";
    @theme {
      --color-primary: #3BB4A8;
      --color-accent:  #F5B454;
      /* dst. — token otomatis jadi utility: bg-primary, text-primary, dll. */
    }
    ```
    JANGAN membuat `tailwind.config.js` (tidak dipakai di v4).
- **Tipografi:** sans-serif bersih & mudah dibaca (mis. Inter / Plus Jakarta Sans). Hierarki jelas, ukuran nyaman dibaca.
- **Logo:** wordmark teks "Haitham Tech" dengan tipografi rapi + aksen warna primary. Mudah diganti dengan logo grafis nanti.
- **Komponen CTA konsisten:** tombol WhatsApp memakai warna primary yang menonjol dan muncul di titik-titik strategis.
- Ikuti panduan desain lingkungan bila membuat komponen UI (lihat skill `frontend-design`).

---

## 8. Persyaratan SEO (prioritas tinggi — ini tujuan utama situs)

**Fondasi wajib (BLOCKER kalau hilang):**
- Set `site: 'https://haithamtech.com'` di `astro.config.mjs`. Tanpa ini, sitemap & URL absolut rusak — dan build tetap "sukses" sehingga kegagalan tak terlihat.
- Semua **canonical, `og:url`, dan `og:image` harus URL ABSOLUT**, dibangun dari `Astro.site` (mis. `new URL(Astro.url.pathname, Astro.site)`). OG image relatif tidak ter-scrape saat dibagikan.
- Set `trailingSlash: 'never'` di config, dan seluruh link internal + canonical konsisten tanpa trailing slash.
- Pilih **non-www sebagai canonical host**; www dialihkan ke non-www di Caddy (lihat §10).

Setiap halaman **wajib**:
- `<title>` unik & deskriptif dan `<meta name="description">` unik.
- URL canonical absolut (`<link rel="canonical">`).
- Tag **Open Graph** (`og:title`, `og:description`, `og:image` absolut, `og:type`, `og:url`) + **Twitter Card**.
- HTML semantik, satu `<h1>` per halaman, hierarki heading benar.
- `lang="id"`.
- Semua `<img>` punya `alt` deskriptif.

Structured data (JSON-LD):
- **`ProfessionalService`** (subtipe `LocalBusiness`) untuk Haitham Tech — di semua halaman via layout. Sertakan `name`, `description`, `url`, `areaServed` (Indonesia), `availableLanguage` (id), dan `openingHours`/jam operasional dari `OPERATING_HOURS`. Ini lebih relevan untuk kueri bisnis Indonesia daripada `Organization` generik.
- **Service** — di halaman Layanan (untuk tiap paket Basic & Business).
- **BlogPosting** — di tiap halaman artikel.
- **BreadcrumbList** — di artikel & halaman dalam.
- **FAQPage** — di FAQ halaman Kontak.

Teknis SEO:
- `@astrojs/sitemap` menghasilkan `sitemap.xml` (butuh `site` di atas).
- `robots.txt` di `public/` mengizinkan crawl + menunjuk ke sitemap absolut.
- Internal linking: artikel menautkan ke Layanan & Kontak; navigasi & footer konsisten.
- **Verifikasi link (pengganti test, proporsional):** setelah `npm run build`, jalankan link-checker atas `dist/` (mis. `npx linkinator ./dist --silent`) untuk menangkap link internal mati — kelas bug yang tidak tertangkap `astro check`/`build` tapi merusak SEO. Jalankan lokal dan sebagai langkah CI.
- Performa: manfaatkan output statis Astro untuk Core Web Vitals yang baik (gambar dioptimasi, CSS minimal).
- Sediakan `og-image` default di `public/` + kemampuan override per artikel via frontmatter `image`.

---

## 9. Konversi / CTA

- **WhatsApp:** link format `https://wa.me/<NOMOR>?text=<pesan_terenkode>`.
  - `<NOMOR>` = placeholder `WHATSAPP_NUMBER` (format internasional tanpa `+`, mis. `62812xxxxxxx`).
  - Pesan pra-isi contoh: "Halo Haitham Tech, saya tertarik dengan layanan AI Customer Service." (URL-encoded).
- **Email:** `mailto:CONTACT_EMAIL` (placeholder).
- **Label CTA utama:** "Konsultasi Gratis" (boleh variasi "Book Demo"/"Tanya Sekarang" di konteks tertentu).
- Semua data kontak dibaca dari `src/consts.ts`.

---

## 10. Deployment

**Infrastruktur:** VPS **Ubuntu 24.04 + Docker**. Penyajian oleh **Caddy** (HTTPS/SSL otomatis via Let's Encrypt). Auto-deploy via **GitHub Actions**.

**Alur deploy (git push → tayang):**
1. Developer `git push` ke branch `main` di GitHub.
2. GitHub Actions: checkout → setup Node 22 → `npm ci` → `npm run build` (hasil di `dist/`).
3. Actions mengirim isi `dist/` ke VPS via **rsync over SSH** ke direktori yang disajikan Caddy (mis. `/srv/haithamtech/site`).
4. Caddy langsung menyajikan versi baru. Tanpa rebuild image untuk update konten.

**Caddyfile (inti) — canonical non-www + redirect www + 404:**
```
# Redirect www → non-www (canonical tunggal, hindari duplicate content)
www.haithamtech.com {
    redir https://haithamtech.com{uri} permanent
}

haithamtech.com {
    root * /srv/site
    encode gzip zstd
    file_server
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

**docker-compose.yml di VPS (garis besar):**
- **Hanya service `caddy`** — image resmi Caddy, mount `Caddyfile`, bind-mount direktori situs, port 80 & 443, **named volume** untuk data & sertifikat.
- TIDAK ADA container analytics. Analytics memakai layanan cloud (Cloudflare Web Analytics, lihat §11) — tidak ada Postgres/database yang di-host sendiri.

**PAGAR PENTING untuk `rsync --delete` (mencegah kerusakan senyap):**
- `DEPLOY_PATH` WAJIB menunjuk **direktori situs (leaf)**, mis. `/srv/haithamtech/site` — BUKAN parent `/srv/haithamtech/`.
- Data/sertifikat Caddy memakai **named volume Docker**, jangan bind-mount di dalam `DEPLOY_PATH`. Apa pun di dalam `DEPLOY_PATH` bisa terhapus oleh `--delete`.
- Saat setup pertama, jalankan rsync dengan `--dry-run` sekali untuk memastikan target benar.

**Urutan setup VPS pertama (WAJIB berurutan — cegah gagal sertifikat senyap):**
1. Pastikan A record `haithamtech.com` (+ `www`) sudah **resolve** ke `VPS_IP` (cek `dig`/`nslookup`), tunggu propagasi.
2. Buka firewall: `ufw allow 80,443/tcp`.
3. Jika pakai Cloudflare DNS, set mode **DNS-only (grey cloud)** saat penerbitan sertifikat pertama — bukan proxied (orange).
4. Baru jalankan Caddy. Verifikasi HTTPS terbit benar sebelum lanjut.

**DNS (dicatat, dilakukan user):**
- A record `haithamtech.com` → `VPS_IP`.
- A record (atau CNAME) `www` → domain/`VPS_IP`.

`VPS_IP` di atas adalah nilai yang **user isi langsung di panel DNS**, bukan di repo. Repo ini publik, dan situs statis tidak pernah membaca IP VPS — jadi tidak ada alasan teknis untuk menuliskannya di kode. Untuk deploy, IP-nya masuk GitHub Secrets sebagai `SSH_HOST`.

**Secrets GitHub Actions (dicatat):** `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`, `SSH_PORT` (bila ≠22).

**Backup:** GitHub adalah sumber kebenaran (kode + artikel). Karena analytics kini di cloud dan tidak ada database di VPS, **tidak ada state berharga di VPS yang perlu di-backup** — blast radius maksimal benar-benar hanya "situs mati sementara". Sarankan developer tetap menyimpan `git clone` lokal sebagai cadangan tambahan.

---

## 11. Analytics & SEO Tools

- **Google Search Console** (wajib, setup manual oleh user): verifikasi domain, submit `sitemap.xml`. Sediakan mekanisme verifikasi (meta tag atau file di `public/`) — placeholder `GSC_VERIFICATION`.
- **Cloudflare Web Analytics** (cloud, gratis, ramah privasi, tanpa cookie/banner): sisipkan snippet beacon di `BaseLayout`, token dibaca dari `src/consts.ts` — placeholder `CF_ANALYTICS_TOKEN`. TIDAK ada database/analytics yang di-host sendiri (keputusan sadar; lihat `decisions.md`). Ini menjaga premis proyek: tidak ada state di VPS, blast radius = situs statis.

---

## 12. Placeholder yang Harus Diisi User

Kumpulkan semua di `src/consts.ts` (dan env untuk infra). AI writer memakai placeholder ini, JANGAN mengarang nilainya:

| Placeholder | Keterangan |
|---|---|
| `WHATSAPP_NUMBER` | Nomor WA format internasional tanpa `+` |
| `CONTACT_EMAIL` | Email kontak |
| `OPERATING_HOURS` | Jam operasional / waktu respon |
| `VPS_IP` | IP VPS untuk DNS. **TIDAK disimpan di `consts.ts`** — repo publik; nilainya hanya di GitHub Secrets (`SSH_HOST`) & catatan setup §10 |
| `GSC_VERIFICATION` | Kode verifikasi Google Search Console |
| `CF_ANALYTICS_TOKEN` | Token Cloudflare Web Analytics |
| Statistik riset industri | Angka + **sumber** untuk social proof (tandai `TODO:` bila belum diverifikasi; jangan sajikan seolah hasil klien) |
| Detail "Tentang" | Nama, foto, cerita pribadi |

---

## 13. Definition of Done (v1)

> **Ini juga pelacak progres.** Centang saat kerjaannya benar-benar selesai (`npm run build` exit 0), sebagai bagian dari langkah Commit. Poin yang belum tercentang = belum dikerjakan; jangan simpulkan status dari keberadaan nama file.

- [x] Proyek Astro 7 + TS + Tailwind v4 (via `@tailwindcss/vite`, token di `global.css`) berjalan (`npm run dev`, `npm run build` sukses tanpa error).
- [x] `astro.config.mjs` menyetel `site: 'https://haithamtech.com'` + `trailingSlash: 'never'`.
- [ ] Semua halaman ada: Beranda, Layanan (2 seksi paket + cara kerja per paket), Artikel (index + template), Tentang, Kontak, **404**.
- [x] Content collection `blog` di `src/content.config.ts` (glob loader, `z.coerce.date()`) berfungsi + minimal 1–2 artikel benih `.md`.
- [x] Setiap artikel punya `ArticleCTA`.
- [ ] Semua persyaratan SEO Bagian 8 terpenuhi: canonical/OG **absolut**, JSON-LD `ProfessionalService`, sitemap, robots.txt.
- [x] `npm run linkcheck` lolos tanpa link internal mati (dijaga otomatis di CI tiap PR).
- [x] CTA WhatsApp & email berfungsi dari `consts.ts` (Header, Footer, dan tiap halaman).
- [ ] Desain sesuai arah Bagian 7 (bersih, ramah, terang, lembut) & responsif (mobile-first).
- [x] Workflow `deploy.yml` tersedia (build → linkcheck → rsync, dengan pagar `DEPLOY_PATH` kosong).
- [ ] `Caddyfile` tersedia (redirect www→non-www, handle 404, `try_files {path} {path}/index.html`).
- [ ] `docker-compose.yml` tersedia (Caddy saja, named volume untuk sertifikat).
- [ ] `robots.txt`, favicon, og-image default ada.
- [x] Social proof dibingkai sebagai riset (bersumber) / ilustrasi — tidak ada angka yang menyerupai hasil klien.
- [ ] Semua placeholder terdaftar & mudah dicari; tidak ada data karangan yang menyamar sebagai fakta.

---

## 14. Di Luar Scope v1 (JANGAN dikerjakan kecuali diminta)

- Form kontak dengan backend / penyimpanan data.
- CMS / panel admin.
- Blog berbahasa Inggris / konten teknologi umum (proyek terpisah).
- Toko online, login/akun user, dashboard.
- Multi-bahasa (i18n).
- Fitur pencarian di situs (Pagefind) — dipertimbangkan setelah artikel banyak.
