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

## 2026-08-23 — Alur kerja mobile: branch per sesi + PR, dengan CI sebagai gerbang
**Keputusan:** Pekerjaan dari perangkat mobile dikerjakan di branch pendek (satu branch per unit kerja/sesi SPEC), lalu masuk `main` lewat Pull Request. Ditambah workflow `ci.yml` yang menjalankan `npm run build` + `npm run linkcheck` pada setiap PR ke `main`, tanpa akses secret dan tanpa deploy.
**Ditolak:** (a) Commit langsung ke `main` dari mobile — cara paling cepat, tapi membuat aturan "selesai = `npm run build` exit 0" tidak bisa ditegakkan sama sekali; (b) Branch `dev` permanen sebagai penampung — lapisan tetap yang harus di-sync manual dari HP, biaya perawatan tanpa manfaat untuk solo dev.
**Alasan:** Gerbang "selesai" di proyek ini adalah build lokal, dan dari HP gerbang itu tidak bisa dijalankan. Tanpa penggantinya, `main` bisa berisi commit yang belum pernah terbukti bisa di-build — yang rusak bukan produksi (di `deploy.yml`, build & linkcheck jalan sebelum rsync, jadi build gagal = deploy batal dan situs lama tetap tayang), melainkan `main` sebagai sumber kebenaran. CI di PR memindahkan gerbang itu ke tempat yang bisa dilihat & diverifikasi dari HP: centang hijau = boleh merge. Branch pendek dipilih karena sudah selaras dengan aturan "satu bagian SPEC per sesi" — branch mati setelah merge, tidak ada yang dirawat. `deploy.yml` tidak diubah: merge PR = push ke `main` = deploy otomatis.
**Catatan:** Branch protection di `main` (wajib PR + wajib CI hijau) disarankan dan diatur manual oleh user di setelan GitHub — itu yang mengubah aturan ini dari niat baik jadi tidak bisa dilanggar, termasuk oleh agent.

## 2026-08-23 — `linkcheck` hanya memeriksa link internal
**Keputusan:** `npm run linkcheck` memakai `--skip "^https?://"`, jadi hanya link internal di `dist/` yang diperiksa.
**Ditolak:** Membiarkan linkinator ikut memeriksa URL absolut eksternal.
**Alasan:** Ditemukan saat memasang gerbang CI: script lama gagal (exit 1) karena ikut mem-fetch `https://haithamtech.com/` dan `og-image.png` dari tag canonical/OG — domain produksi belum tayang, dan itu memang bukan yang ingin kita jaga. Gerbang yang selalu merah karena sebab di luar kendali repo akan cepat diabaikan, dan gerbang yang diabaikan sama saja tidak ada. SPEC §8 memang menyebut sasarannya "link internal mati". Konsekuensinya: link internal WAJIB ditulis relatif, kalau ditulis absolut ke domain sendiri ia ikut ter-skip dan lolos dari gerbang (dicatat di CLAUDE.md).

## 2026-08-23 — Koreksi: pola `--skip` linkcheck sempat membuat gerbang mandul
**Keputusan:** Pola skip diperbaiki jadi `--skip "^https?://(?!localhost)"`.
**Ditolak:** Pola sebelumnya `^https?://` (dipasang beberapa jam lebih awal di hari yang sama).
**Alasan:** linkinator menyajikan `dist/` lewat server lokal, jadi URL akarnya sendiri adalah `http://localhost:PORT/` — ikut cocok dengan `^https?://` dan ter-skip. Akibatnya crawl berhenti sebelum mulai: "scanned 0 links", exit 0, hijau sempurna tanpa memeriksa apa pun. Gerbang yang selalu hijau sama tidak bergunanya dengan gerbang yang selalu merah, dan lebih berbahaya karena terlihat seperti bukti. Ketahuan saat Header/Footer memasang tautan ke halaman yang belum ada: gerbang tetap hijau padahal ada 4 link mati. Dengan lookahead, 8 link terperiksa dan 4 link mati itu langsung ketangkap.
**Pelajaran:** angka yang dilaporkan gerbang ("scanned N links") harus ikut dibaca, bukan cuma exit code-nya.

## 2026-08-23 — Format output tetap `directory`; trailing slash diurus Caddy, bukan Astro
**Keputusan:** `astro.config.mjs` tetap memakai format output bawaan (`directory` — `dist/artikel/index.html`). Ketidakcocokan dengan `trailingSlash: 'never'` diselesaikan di Caddyfile nanti dengan `try_files {path} {path}/index.html` sebelum `file_server`.
**Ditolak:** `build: { format: 'file' }` (emit `artikel.html`) — sempat dicoba di sesi ini lalu dibatalkan.
**Alasan:** Masalahnya nyata: dengan `file_server` polos, permintaan ke `/artikel` (bentuk yang dipakai seluruh canonical & link internal) akan dijawab Caddy dengan redirect 301 ke `/artikel/` — setiap klik navigasi kena hop tak perlu, dan URL yang tayang berbeda dari yang dideklarasikan canonical. Tapi `format: 'file'` menyembuhkan produksi sambil melumpuhkan gerbang: server statis linkinator tidak me-resolve `/artikel` ke `artikel.html`, sehingga `npm run linkcheck` melaporkan 4 link mati palsu. Gerbang yang merah karena sebab di luar kendali repo akan cepat diabaikan (pelajaran yang sama dengan blok `--skip` di atas). Karena `try_files` di Caddy menyelesaikan hal yang sama tanpa menyentuh gerbang, perbaikan ditempatkan di sana.
**Konsekuensi:** Sesi yang menulis Caddyfile WAJIB memakai `try_files {path} {path}/index.html` — `file_server` polos akan diam-diam menghidupkan kembali redirect ini.

## 2026-08-25 — `linkcheck` butuh `--recurse`, kalau tidak halaman artikel tak pernah diperiksa
**Keputusan:** `npm run linkcheck` memakai `--recurse`.
**Ditolak:** Bentuk sebelumnya tanpa `--recurse`.
**Alasan:** Ketahuan saat memasang sistem artikel. Tanpa `--recurse`, linkinator hanya memeriksa tautan yang ditemukan di halaman akar — ia tidak pernah membuka `/artikel`, apalagi halaman artikelnya. Selama ini gerbang terlihat bekerja (dan memang menangkap 4 link mati Header/Footer di sesi lalu) semata karena semua tautan itu memang ada di halaman akar. Dibuktikan dengan menyuntikkan link mati `/layanan-palsu` ke dalam body artikel di `dist/`: tanpa `--recurse` hasilnya "scanned 8 links", exit 0, hijau; dengan `--recurse` langsung "Detected 1 broken links", exit 1. Karena CTA di setiap artikel wajib menautkan ke Layanan/Kontak (SPEC §5.3), justru tautan di dalam artikel itulah yang paling perlu dijaga.
**Pelajaran (lagi):** ini kejadian ketiga di proyek ini di mana gerbang tampak hijau tanpa memeriksa apa yang kita kira diperiksa. Angka "scanned N links" harus dicocokkan dengan jumlah halaman yang sebenarnya ada, bukan sekadar dibaca sekilas.

## 2026-08-25 — Alur branch + PR disamaratakan untuk semua sesi (bukan hanya mobile)
**Keputusan:** Branch → PR → CI hijau → merge berlaku untuk sesi dari laptop juga, bukan cuma dari HP. CLAUDE.md diubah dari "Alur mobile (tanpa akses laptop)" jadi "Alur baku SEMUA sesi". Gerbang lokal `npm run build` TIDAK dihapus — dari laptop ia tetap wajib jalan lebih dulu, CI jadi lapis kedua yang tercatat.
**Ditolak:** Alur bersyarat — push langsung dari laptop, PR hanya dari HP.
**Alasan:** Ditemukan lewat eval user. Dokumennya sendiri sudah benar (bagian itu memang berjudul "alur mobile"), tapi kenyataannya sejak 2026-08-23 branch protection dengan `enforce_admins: true` membuat push langsung ke `main` ditolak dari perangkat mana pun. Dokumen dan kenyataan berbeda — sesi berikutnya yang membaca CLAUDE.md akan menyimpulkan hal yang salah. Dua pilihan: samakan dokumen dengan kenyataan, atau samakan kenyataan dengan dokumen. Dipilih yang pertama karena: (a) aturan bersyarat per-perangkat penegakannya cuma ingatan, dan aturan begitu selalu bocor; (b) `ci.yml` hanya jalan di PR, tidak di push ke `main` — jadi push langsung dari laptop tidak meninggalkan jejak verifikasi apa pun di GitHub, hanya klaim agent, persis yang CLAUDE.md dirancang untuk cegah; (c) ongkosnya kini kecil karena `gh` sudah terpasang.

## 2026-08-25 — Required status check `verify` dinyalakan; sebelumnya proteksi hanya separuh
**Keputusan:** Branch protection `main` mewajibkan status check `verify` (nama job di `ci.yml`), bukan sekadar mewajibkan PR.
**Ditolak:** Membiarkan `required_status_checks.contexts` kosong seperti sebelumnya.
**Alasan:** Pemeriksaan setelan GitHub lewat `gh api` menunjukkan `required_pull_request_reviews` aktif dan `enforce_admins: true`, tapi `required_status_checks.contexts` **kosong**. Artinya PR memang wajib, tapi PR dengan CI merah tetap bisa di-merge. Seluruh premis "selesai = check PR hijau" (keputusan 2026-08-23) bertumpu pada setelan yang tidak pernah dinyalakan — jadi selama ini ongkos alur PR dibayar penuh tanpa manfaat utamanya. CI-nya sendiri tidak rusak: ia jalan dan melaporkan hasil dengan benar; yang hilang adalah penegakannya. Bedanya penting — lampu indikator butuh seseorang melihat dan patuh, pintu terkunci tidak.
**Pelajaran (keempat kalinya):** ini pola yang sama dengan tiga blok gerbang sebelumnya di dokumen ini — sesuatu yang tampak menjaga padahal tidak. Setiap gerbang baru harus diuji dengan sengaja membuatnya gagal, bukan diasumsikan bekerja karena terlihat hijau.
**Diuji, bukan diasumsikan (2026-08-25):** untuk pertama kalinya di proyek ini sebuah gerbang dibuktikan dengan sengaja dibuat gagal. Branch buangan berisi satu link internal mati dibuka sebagai PR #6: `verify` merah, `mergeStateStatus: BLOCKED`, `gh pr merge` ditolak ("the base branch policy prohibits the merge"), dan `gh pr merge --admin` juga ditolak ("Required status check \"verify\" is failing") — jadi `enforce_admins: true` benar-benar menutup jalur bypass owner. `main` tidak bergerak. PR #6 ditutup dan branch-nya dihapus setelahnya.

## 2026-08-25 — `VPS_IP` dikeluarkan dari `consts.ts`; data diklasifikasikan karena repo publik
**Keputusan:** `VPS_IP` dihapus dari `src/consts.ts`. Nilainya hidup di GitHub Secrets (`SSH_HOST`) dan panel DNS saja; SPEC §10/§12 mencatatnya sebagai langkah setup, bukan sebagai konstanta kode. CLAUDE.md kini membedakan tiga kategori data: yang memang untuk publik, yang tidak boleh masuk repo, dan yang harus ditanyakan.
**Ditolak:** Membiarkan `VPS_IP` sebagai placeholder di `consts.ts` seperti placeholder lain.
**Alasan:** Ketahuan saat user menyadari repo ini publik, bukan privat. Aturan lama hanya berbunyi "jangan mengarang data riil — pakai placeholder", yang mengatur *jangan mengarang*, bukan *jangan meng-commit yang asli*. Untuk sebagian besar placeholder itu memang benar: nomor WA, email, jam operasional, token Cloudflare, dan kode verifikasi GSC semuanya toh tayang di HTML publik — tidak ada yang perlu disembunyikan. Tapi `VPS_IP` beda: ia **tidak dipakai satu baris pun** oleh situs (dicek dengan grep di `src/` dan `.github/`), murni catatan setup. Membiarkannya di `consts.ts` berarti sesi mendatang akan mengisinya dengan IP asli dan mempublikasikannya permanen — menambah permukaan serangan tanpa satu pun manfaat teknis. Kategori "boleh publik" dan "tidak boleh" perlu ditulis eksplisit, karena tanpa itu keputusannya bergantung pada penilaian tiap sesi.
**Catatan terkait:** email commit user dipindah ke alamat `noreply` GitHub di hari yang sama. 13 commit lama tetap memuat Gmail asli — sengaja tidak di-rewrite: manfaatnya semu (sudah terekspos sebulan di repo publik) sementara ongkosnya nyata (SHA berubah, rujukan di dokumen & memori jadi menunjuk ke commit yang tidak ada).
