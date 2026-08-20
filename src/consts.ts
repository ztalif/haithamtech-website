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

/** TODO: isi nomor WhatsApp asli — format internasional tanpa '+', mis. '62812xxxxxxx'. */
export const WHATSAPP_NUMBER = '62800000000000';

/** TODO: isi email kontak asli. */
export const CONTACT_EMAIL = 'halo@haithamtech.com';

/** TODO: isi jam operasional / perkiraan waktu respons yang sebenarnya. */
export const OPERATING_HOURS = 'Senin–Jumat, 09.00–17.00 WIB';

/** Dipakai di JSON-LD `openingHours` (format schema.org). Selaraskan dengan OPERATING_HOURS. */
export const OPENING_HOURS_SCHEMA = 'Mo-Fr 09:00-17:00';

/** TODO: isi IP VPS untuk A record DNS (dipakai saat setup, bukan di halaman). */
export const VPS_IP = 'TODO_VPS_IP';

/** TODO: isi kode verifikasi Google Search Console (meta tag). Kosongkan bila belum ada. */
export const GSC_VERIFICATION = '';

/** TODO: isi token Cloudflare Web Analytics. Kosongkan bila belum ada. */
export const CF_ANALYTICS_TOKEN = '';

/** Pesan pra-isi CTA WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE =
  'Halo Haitham Tech, saya tertarik dengan layanan AI Customer Service.';

/** Bangun link wa.me dengan pesan pra-isi (SPEC §9). */
export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link mailto ke email kontak. */
export const MAILTO_LINK = `mailto:${CONTACT_EMAIL}`;

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
