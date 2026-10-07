# Haitham Tech — Overview Proyek & Kebutuhan VPS

> Dokumen ringkasan untuk keperluan keputusan pembelian VPS. Bukan spesifikasi teknis
> (itu `SPEC.md`) dan bukan aturan kerja (itu `CLAUDE.md`).
> Disusun 2026-09-24.
>
> **Status 2026-10-06 — sebagian sudah basi, baca ini dulu:**
> - VPS **sudah dibeli**: Hostinger, VPS yang sama yang menjalankan stack n8n. Bagian 2
>   (rekomendasi paket & biaya) kini hanya arsip pertimbangan.
> - Port 80/443 dipegang Traefik stack n8n. Situs berjalan di belakangnya (Caddy tanpa
>   port host, network `proxy`). Runbook terbaru: §10 (diperbarui 2026-10-07).
> - Domain `haithamtech.com` **belum dibeli** (per 2026-10-07) — Fase B §10 menunggu ini.
> - Pelacak progres resmi tetap SPEC §13; checklist §5 di bawah bukan pelacak.

---

## 1. Apa ini

Website marketing **Haitham Tech** — jasa *AI Customer Service Agent* (paket Basic &
Business) untuk bisnis Indonesia (UMKM, klinik, agensi, bisnis online).

- **Tujuan situs:** menjaring calon klien lewat SEO, lalu mengarahkannya ke **WhatsApp**
  dan **email**. Tidak ada form, tidak ada akun, tidak ada transaksi di situs.
- **Bahasa:** seluruhnya Bahasa Indonesia. Topik artikel dikunci di orbit AI customer service.
- **Domain:** `haithamtech.com` (canonical non-www).

## 2. Bentuk teknisnya

| Aspek | Pilihan |
|---|---|
| Framework | Astro 7 (SSG) + TypeScript strict |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (token di `global.css`, tanpa config file) |
| Konten artikel | Markdown + Astro Content Collections (`src/content/blog/`) |
| Runtime build | Node.js 22 LTS |
| Backend | **tidak ada** |
| Database | **tidak ada** |
| CMS | **tidak ada** |
| Analytics | Cloudflare Web Analytics (cloud, tanpa cookie) |
| Search Console | Google Search Console (verifikasi meta tag) |

Poin terpenting untuk keputusan VPS: **output-nya HTML/CSS statis murni.** VPS tidak
menjalankan Node, tidak menjalankan PHP, tidak menjalankan database. Ia cuma menyajikan file.

## 3. Alur deploy

```
git push / merge PR ke main
        |
        v
GitHub Actions (deploy.yml)   <- di sinilah semua kerja berat terjadi
  npm ci -> npm run build -> npm run linkcheck
        |
        v  rsync over SSH (--delete) ke DEPLOY_PATH
VPS: Caddy (Docker) menyajikan /srv/site
        |
        v  HTTPS otomatis (Let's Encrypt)
pengunjung
```

**Build tidak pernah jalan di VPS.** Ini menghapus kebutuhan RAM terbesar dari
persamaan — `npm ci && astro build` butuh ~1–2 GB RAM, tapi itu beban GitHub Actions,
gratis dan bukan urusan paket VPS.

## 4. Ukuran nyata hari ini

Diukur dari hasil `npm run build` di repo ini:

| Metrik | Angka |
|---|---|
| Ukuran `dist/` total | **±211 KB** |
| Jumlah halaman HTML | 8 (Beranda, Layanan, Artikel index, 2 artikel, Tentang, Kontak, 404) |
| Artikel Markdown | 2 (seed) |
| JavaScript sisi klien | nyaris nol (Astro zero-JS by default) |
| Aset berat | `og-image.png` + `favicon.svg` saja |

Proyeksi: 100 artikel dengan 1 gambar cover masing-masing ≈ **20–50 MB**. Bahkan 500
artikel masih di bawah 250 MB. Situs ini secara praktis tidak akan pernah menyentuh
batas disk paket VPS termurah sekalipun.

## 5. Status penyelesaian

Seluruh kode v1 sudah selesai dan ter-merge (SPEC §13 tercentang penuh kecuali satu
poin). Yang tersisa bukan pekerjaan kode:

- [ ] Isi placeholder data user: `FOUNDER_NAME`, `FOUNDER_STORY`, `WHATSAPP_NUMBER`,
      `CONTACT_EMAIL`, `OPERATING_HOURS`, `OPENING_HOURS_SCHEMA`, `CF_ANALYTICS_TOKEN`,
      `GSC_VERIFICATION`
- [ ] Beli & siapkan VPS ← **dokumen ini**
- [ ] Arahkan DNS, jalankan Caddy, isi GitHub Secrets, deploy pertama

---

# Bagian 2 — VPS seperti apa yang dibutuhkan

## 6. Beban kerja sebenarnya di VPS

Yang berjalan di VPS hanya **satu container: Caddy 2**. Tugasnya:

1. Menyajikan file statis dari disk (`file_server`).
2. Kompresi gzip/zstd.
3. Menerbitkan & memperpanjang sertifikat TLS Let's Encrypt otomatis.
4. Redirect `www` → non-www, dan `handle_errors` → `404.html`.

Konsumsi Caddy idle: **±15–30 MB RAM**, CPU praktis 0%. Di bawah beban ribuan request
per menit untuk file statis kecil, ia masih di bawah 100 MB RAM. Docker daemon sendiri
justru pemakai RAM terbesar kedua (±80–120 MB), dan Ubuntu 24.04 minimal butuh
±200–300 MB untuk sistemnya.

**Total realistis saat berjalan: ±400–500 MB RAM.**

## 7. Rekomendasi paket

### Rekomendasi utama — beli ini

| Spesifikasi | Nilai |
|---|---|
| **RAM** | **2 GB** |
| **vCPU** | 1 (2 kalau selisih harganya tipis) |
| **Disk** | 20–25 GB SSD/NVMe |
| **Bandwidth** | 1 TB/bulan (paket termurah mana pun sudah cukup) |
| **OS** | Ubuntu 24.04 LTS |
| **Lokasi** | **Singapura** atau Jakarta |

**Kenapa 2 GB dan bukan 1 GB, padahal 500 MB saja cukup?**
Bukan karena situsnya butuh. Karena hal-hal di luar situs:

- `apt upgrade`, `docker pull`, dan build ulang image sesekali melonjak melewati 1 GB.
- Kalau kelak Anda menaruh layanan lain di VPS yang sama (dan untuk bisnis AI CS,
  kemungkinan itu nyata — misal worker bot WhatsApp), 1 GB langsung sesak.
- Selisih harga 1 GB vs 2 GB biasanya hanya ±Rp 20–40 ribu/bulan. Itu premi asuransi
  paling murah di seluruh proyek ini.
- Upgrade RAM belakangan = downtime + migrasi. Kelebihan RAM sejak awal = tidak terasa.

**Kenapa lokasi Singapura/Jakarta?**
Situs ini dijual ke bisnis Indonesia, dan SEO adalah tujuan utamanya. TTFB dari
Singapura ke Indonesia ±20–40 ms; dari Eropa/AS ±180–300 ms. Core Web Vitals adalah
sinyal peringkat, dan latensi server masuk langsung ke LCP. Jakarta sedikit lebih cepat
tapi pilihan provider lebih sempit dan sering lebih mahal — **Singapura adalah titik
optimal harga/latensi**, dan itu yang saya sarankan.

### Batas bawah yang masih jujur

**1 GB RAM / 1 vCPU / 10 GB disk** memang **cukup** untuk menjalankan situs ini hari
ini, dan akan berjalan stabil. Pilih ini hanya kalau anggaran benar-benar ketat dan
Anda yakin VPS ini selamanya hanya untuk satu situs statis. Risikonya bukan situs
lambat, melainkan operasi rutin (update, pull image) yang sesekali kehabisan RAM.

### Jangan beli ini

| Jangan | Alasan |
|---|---|
| 4 GB+ RAM | Uang terbuang. Beban aktualnya ±30 MB. Naikkan nanti kalau benar-benar ada layanan baru. |
| Shared hosting / cPanel | Tidak ada Docker & SSH bebas; `rsync --delete` dari Actions jadi rumit. |
| VPS Windows | Tidak relevan, jauh lebih mahal. |
| Paket "unlimited bandwidth" premium | Situs 211 KB. Bandwidth tidak akan pernah jadi batasnya. |
| Managed Kubernetes / PaaS mahal | Over-engineering untuk satu container Caddy. |

## 8. Perkiraan biaya

| Provider | Paket setara | Perkiraan/bulan |
|---|---|---|
| Hetzner (lokasi Singapura) | CPX11 — 2 vCPU / 2 GB / 40 GB | ~€4–5 (±Rp 70–90 rb) |
| DigitalOcean (Singapore) | Basic — 1 vCPU / 2 GB / 50 GB | ~$12 (±Rp 190 rb) |
| Vultr (Singapore) | Regular — 1 vCPU / 2 GB / 55 GB | ~$10 (±Rp 160 rb) |
| Linode/Akamai (Singapore) | Nanode / 2 GB | ~$12 (±Rp 190 rb) |
| Biznet / IDCloudHost (Jakarta) | 2 GB | ±Rp 100–200 rb |
| Contabo (Singapura) | VPS S — lebih besar, lebih murah | ±Rp 100 rb, tapi reputasi performa fluktuatif |

Harga bergerak; verifikasi saat membeli. Secara nilai, **Hetzner** unggul jauh bila
lokasi Singapura tersedia untuk akun Anda.

## 9. Kenapa VPS sama sekali? (pertimbangan jujur)

Situs statis ini sebenarnya bisa di-host **gratis** di Cloudflare Pages, Netlify, atau
GitHub Pages — dengan CDN global yang lebih cepat dari VPS mana pun dan nol perawatan.
Ini perlu dikatakan terbuka supaya keputusannya sadar, bukan default.

Alasan proyek ini tetap memilih VPS (lihat `decisions.md`):

- Kontrol penuh dan tidak terikat vendor.
- Alur deploy `rsync` sudah dirancang, ditulis, dan berpagar di `deploy.yml`.
- VPS yang sama bisa menampung kebutuhan bisnis AI CS di masa depan (bot, worker,
  webhook) — dan itu **tidak** bisa dilakukan hosting statis gratis.

Poin terakhir itulah pembenaran terkuatnya, dan itu juga alasan tambahan memilih 2 GB
ketimbang 1 GB.

## 10. Runbook setup VPS (VPS bersama stack n8n)

> Diperbarui 2026-10-07 — menggantikan checklist lama yang mengasumsikan Caddy
> memegang port 80/443 sendiri. Alasan: `decisions.md` 2026-10-07.
> Fakta VPS (survei read-only 2026-10-07): Traefik v2.9 di stack n8n
> (`/root/n8n-stack-vps/docker-compose.yml`), hanya entrypoint `web` :80, provider
> docker, n8n memakai rule ``PathPrefix(`/`)``. `/srv` kosong. ufw inactive.

Gambaran: Traefik = pintu depan bersama. Request ber-Host `haithamtech.com` →
container Caddy situs (network `proxy`, tanpa port host); selain itu tetap → n8n.

### Fase A — bisa sekarang, tanpa domain

Semua perintah di VPS sebagai root. **Satu-satunya langkah yang menyentuh n8n
adalah A2** (restart Traefik, n8n putus beberapa detik).

**A1. Network bersama**
```sh
docker network create proxy
```

**A2. Ubah service `traefik` di `/root/n8n-stack-vps/docker-compose.yml`**
Backup dulu: `cp docker-compose.yml docker-compose.yml.bak-$(date +%F)`. Lalu:
- `command:` tambahkan (yang lama tetap):
  ```yaml
  - "--entrypoints.websecure.address=:443"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  - "--certificatesresolvers.letsencrypt.acme.email=<EMAIL_BISNIS>"
  - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
  ```
- `ports:` tambah `"443:443"`.
- `volumes:` tambah `traefik_letsencrypt:/letsencrypt` (+ deklarasi di `volumes:` top-level).
- `networks:` service traefik tambah `proxy`; di `networks:` top-level tambah
  `proxy: { external: true }`.

Validasi lalu terapkan **hanya** ke traefik:
```sh
docker compose config -q && docker compose up -d traefik
```
Verifikasi n8n masih hidup: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost/`
harus sama dengan sebelum perubahan. Gagal → kembalikan backup, `docker compose up -d traefik`.
Resolver ACME belum dipakai router mana pun, jadi belum ada permintaan sertifikat.

**A3. User deploy + folder situs**
```sh
apt-get install -y rsync
adduser --disabled-password --gecos "" deploy
mkdir -p /srv/haithamtech/site
chown deploy:deploy /srv/haithamtech/site
```
`/srv/haithamtech` tetap milik root: user `deploy` hanya bisa menulis ke `site/`.

**A4. Container situs**
```sh
cd /srv/haithamtech
curl -fsSLO https://raw.githubusercontent.com/ztalif/haithamtech-website/main/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/ztalif/haithamtech-website/main/Caddyfile
docker compose up -d
```

**A5. Kunci SSH khusus GitHub Actions** (di laptop, bukan di VPS)
```sh
ssh-keygen -t ed25519 -N "" -C "gha-haithamtech-deploy" -f ~/.ssh/haithamtech_deploy
```
Public key → `/home/deploy/.ssh/authorized_keys` di VPS dengan awalan `restrict `
(mematikan forwarding/pty; rsync tetap jalan). Folder `.ssh` 700, file 600,
milik `deploy`. Private key **tidak pernah ditampilkan** — langsung ke Secrets:
```sh
gh secret set SSH_PRIVATE_KEY < ~/.ssh/haithamtech_deploy
gh secret set SSH_HOST      # ketik IP VPS saat diminta
gh secret set SSH_USER --body deploy
gh secret set DEPLOY_PATH --body /srv/haithamtech/site
```
(`SSH_PORT` tidak perlu — port 22.)

**A6. Dry-run dulu, baru deploy** (dari clone repo di laptop)
```sh
npm ci && npm run build
rsync -avz --delete --dry-run -e "ssh -i ~/.ssh/haithamtech_deploy" dist/ deploy@<VPS_IP>:/srv/haithamtech/site/
```
Pastikan daftar file = isi `dist/` dan target = `/srv/haithamtech/site/`. Lalu
`gh workflow run deploy.yml` dan pastikan run-nya hijau.

**A7. Verifikasi di VPS (tanpa domain)**
```sh
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: haithamtech.com" http://localhost/          # 200
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: haithamtech.com" http://localhost/artikel   # 200, bukan 301
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: haithamtech.com" http://localhost/xyz       # 404
curl -s -o /dev/null -w "%{http_code}\n" http://localhost/                                    # n8n, sama seperti sebelumnya
```

### Fase B — setelah domain `haithamtech.com` dibeli

1. A record `haithamtech.com` dan `www` → IP VPS. Cloudflare: **DNS-only (grey
   cloud)** dulu. Verifikasi `dig +short haithamtech.com`.
2. PR di repo ini: label router `websecure` + `tls.certresolver=letsencrypt` dan
   redirect `web` → https untuk router situs (lihat komentar Fase B di
   `docker-compose.yml`). Stack n8n **tidak** disentuh lagi.
3. Di VPS: ambil ulang `docker-compose.yml`, `docker compose up -d`. Verifikasi
   `curl -I https://haithamtech.com` → 200 dengan sertifikat valid, dan
   `http://` + `www` → 301 ke `https://haithamtech.com`.

> **Ingat:** IP VPS dan email ACME tidak boleh masuk repo — repo ini publik.
> IP hanya di GitHub Secrets & panel DNS; email hanya di compose stack n8n di VPS.
