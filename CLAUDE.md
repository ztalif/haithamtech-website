# Haitham Tech — Website Marketing AI Customer Service

## Tech stack & arsitektur
- Situs **statis (SSG)**: **Astro 7.x** + **TypeScript**, styling **Tailwind CSS v4**. Runtime **Node.js 22 LTS**.
- Artikel blog = Markdown via **Astro Content Collections** (`src/content/blog/`).
- **TANPA** backend/CMS/database untuk konten. Konversi lewat link **WhatsApp & email**.
- Deploy: build di **GitHub Actions** → rsync ke **VPS (Ubuntu 24.04 + Docker)** → disajikan **Caddy** (HTTPS otomatis). Analytics: **Cloudflare Web Analytics** (cloud, TANPA database di VPS).
- Semua konten **Bahasa Indonesia**; topik artikel selalu di orbit **AI customer service**.
- Domain: `haithamtech.com`. Data situs terpusat di `src/consts.ts`.

## Commands
- `npm run dev` — server pengembangan lokal
- `npm run build` — typecheck + build produksi ke `dist/` (ini **gerbang** utama)
- `npm run preview` — pratinjau hasil build (pengganti staging)
- `npm run check` — `astro check` saja

## Code style (HANYA yang beda dari default)
- ES modules, bukan CommonJS.
- Halaman & section pakai komponen `.astro`; JANGAN tambah framework UI (React dll.) kecuali sangat perlu.
- Zero/minimal client-side JS — jaga keunggulan statis Astro.
- Pendekatan paling sederhana; hindari abstraksi & dependency prematur.
- Section modular: satu file per section di `src/sections/`.

## Workflow

### Loop per unit kerja (Explore → Plan → Code → Verify → Commit)
1. **Explore** — baca dulu, jangan menulis. Pahami file yang akan tersentuh.
2. **Plan** — ajukan plan, tunggu persetujuan user sebelum menulis kode.
3. **Code** — implementasi sesuai plan yang disetujui saja.
4. **Verify** — `npm run build` harus sukses. Ini yang menentukan "selesai", bukan klaim agent.
5. **Commit** — kecil dan sering. Centang poin SPEC §13 yang baru selesai dalam commit yang sama.

### Aturan non-negotiable
- Sesi dimulai dari working directory bersih (commit/stash dulu).
- Sebelum menyusun daftar "apa yang bisa dikerjakan": cek checklist SPEC §13 **dan baca isi file** yang relevan. Nama file yang ada ≠ pekerjaannya sudah selesai.
- Kerjakan **satu bagian SPEC per sesi**. Task tak terkait → sesi baru.
- **"Selesai" = `npm run build` exit 0**, bukan pernyataan agent.
- Baca `git diff` sebelum commit — cek tidak ada yang tersentuh di luar niat.
- Jangan menyentuh file di luar scope task yang sedang dikerjakan.
- Jangan menambah dependency tanpa persetujuan eksplisit.
- Jangan mengarang data riil — pakai placeholder di `src/consts.ts` (SPEC §12).
- JANGAN menyebut/menambah blog berbahasa Inggris di proyek ini.

### Gotcha versi (JANGAN pakai pola lama — lihat SPEC §3/§6/§8)
- Tailwind v4 lewat `@tailwindcss/vite`; token di `global.css` via `@theme{}`. TANPA `@astrojs/tailwind` & TANPA `tailwind.config.js`.
- Content Collections di `src/content.config.ts` (glob loader) + `z.coerce.date()`. Jalankan `npx astro sync` setelah ubah skema.
- WAJIB set `site` + `trailingSlash: 'never'`; canonical & OG harus URL absolut dari `Astro.site`.

### Persyaratan konten
- Setiap halaman: title unik, meta description, canonical absolut, Open Graph, JSON-LD `ProfessionalService` (SPEC §8).
- Setiap artikel WAJIB punya CTA ke Layanan atau WhatsApp.
- Setelah build, jalankan `npx linkinator ./dist` — tidak boleh ada link internal mati.

### Keamanan (satu-satunya aset tak-bisa-di-reset di proyek ini)
- **Tidak pernah ada secret di repo.** `.env` masuk `.gitignore`.
- Kredensial VPS (`SSH_PRIVATE_KEY` dkk.) hanya hidup di GitHub Secrets.
- `deploy.yml` memakai `rsync --delete` — perintah destruktif. Jangan ubah `DEPLOY_PATH` tanpa verifikasi manual.

### Kapan berhenti dan lapor ke user
- Sudah 3x percobaan tanpa konvergen → berhenti, jangan iterasi lagi.
- Plan tidak bisa dirumuskan dengan jernih → berhenti, minta klarifikasi.
- Muncul kebutuhan di luar scope SPEC → tanya dulu, jangan putuskan sendiri.

## Referensi on-demand
- @SPEC.md — spesifikasi teknis lengkap
- @decisions.md — alasan di balik keputusan arsitektur
- @package.json
