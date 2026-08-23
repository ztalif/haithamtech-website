/**
 * Konstanta situs Haitham Tech.
 * SEMUA data yang sering berubah tinggal di file ini (SPEC §4 & §12).
 *
 * Nilai bertanda TODO masih placeholder — diisi oleh user, JANGAN dikarang.
 */

export const SITE_NAME = 'Haitham Tech';
export const SITE_TAGLINE = 'AI Customer Service untuk Bisnis Indonesia';
export const SITE_DESCRIPTION =
  'Haitham Tech membangun AI Customer Service Agent untuk bisnis Indonesia — respons otomatis 24/7 di WhatsApp, paham produk Anda, dan bisa dialihkan ke CS manusia bila perlu.';
export const SITE_URL = 'https://haithamtech.com';
export const SITE_LANG = 'id';

/**
 * Data kontak. Dikosongkan dengan sengaja selama nilai aslinya belum ada.
 *
 * String kosong = "belum diisi". Komponen memakai flag HAS_* di bawah untuk
 * menyembunyikan elemen yang datanya belum ada, sehingga situs TIDAK PERNAH
 * menampilkan nomor/email/jam karangan seolah fakta (SPEC §2.8 & §12).
 * Isi nilainya di sini saja — seluruh situs & JSON-LD ikut hidup otomatis.
 */

/** TODO: isi nomor WhatsApp asli — format internasional tanpa '+', mis. '62812xxxxxxx'. */
export const WHATSAPP_NUMBER = '';

/** TODO: isi email kontak asli. */
export const CONTACT_EMAIL = '';

/** TODO: isi jam operasional / perkiraan waktu respons yang sebenarnya. */
export const OPERATING_HOURS = '';

/** TODO: isi jam operasional versi schema.org (mis. 'Mo-Fr 09:00-17:00'). Selaraskan dengan OPERATING_HOURS. */
export const OPENING_HOURS_SCHEMA = '';

export const HAS_WHATSAPP = WHATSAPP_NUMBER !== '';
export const HAS_EMAIL = CONTACT_EMAIL !== '';
export const HAS_OPERATING_HOURS = OPERATING_HOURS !== '';

/** TODO: isi IP VPS untuk A record DNS (dipakai saat setup, bukan di halaman). */
export const VPS_IP = 'TODO_VPS_IP';

/** TODO: isi kode verifikasi Google Search Console (meta tag). Kosongkan bila belum ada. */
export const GSC_VERIFICATION = '';

/** TODO: isi token Cloudflare Web Analytics. Kosongkan bila belum ada. */
export const CF_ANALYTICS_TOKEN = '';

/** Pesan pra-isi CTA WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE =
  'Halo Haitham Tech, saya tertarik dengan layanan AI Customer Service.';

/**
 * Bangun link wa.me dengan pesan pra-isi (SPEC §9).
 *
 * Selama WHATSAPP_NUMBER kosong, mengembalikan '/kontak' — tombol tetap
 * berfungsi (dan link internalnya ikut diperiksa `npm run linkcheck`) tanpa
 * pernah mengirim pengunjung ke nomor karangan.
 */
export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  if (!HAS_WHATSAPP) return '/kontak';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link mailto ke email kontak. Kosong bila CONTACT_EMAIL belum diisi. */
export const MAILTO_LINK = HAS_EMAIL ? `mailto:${CONTACT_EMAIL}` : '';

/**
 * Label tombol CTA. Selama nomor WA belum diisi, tombol mengarah ke /kontak,
 * jadi labelnya tidak boleh menjanjikan WhatsApp.
 */
export const WHATSAPP_CTA_LABEL = HAS_WHATSAPP
  ? 'Konsultasi Gratis via WhatsApp'
  : 'Hubungi Kami';

/** Navigasi utama (SPEC §5). Tanpa trailing slash — selaras `trailingSlash: 'never'`. */
export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Kontak', href: '/kontak' },
] as const;

/** OG image default; di-override per artikel lewat frontmatter `image`. */
export const DEFAULT_OG_IMAGE = '/og-image.png';

/** Cakupan layanan untuk JSON-LD ProfessionalService. */
export const AREA_SERVED = 'Indonesia';
