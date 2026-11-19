# RESTEP untuk VPS

Demo portofolio satu produk dengan landing page statis dan widget pelanggan.
Katalog fiktif di `server/catalog.json` dipakai oleh build HTML dan API Fastify.
Jawaban memakai aturan kata kunci. Alur pemesanan adalah simulasi.

## Jalankan

Butuh Node.js 22 atau lebih baru.

1. Jalankan `npm ci`, `npm test`, dan `npm run build`.
2. Jalankan `npm start`. Fastify mendengarkan di `127.0.0.1:3000`.
3. Caddy menyajikan hasil build di `dist/` serta meneruskan `POST /api/chat`.
   Untuk mencoba Caddy secara lokal, ubah root di `deploy/Caddyfile` menjadi path absolut ke folder `dist` lokal, jalankan `caddy run --config deploy/Caddyfile`, dan buka `http://localhost:8080`.

## Pasang di VPS

Tempatkan proyek di `/srv/restep` dan jalankan langkah build. Siapkan akun sistem
`restep`, pastikan Caddy bisa membaca `/srv/restep/dist`, lalu sesuaikan path
`ExecStart` jika Node terpasang di lokasi berbeda. Pasang `deploy/restep.service` di
`/etc/systemd/system/` dan aktifkan dengan `systemctl enable --now restep`
(setelah `systemctl daemon-reload`).

Salin blok Caddy ke konfigurasi VPS, ganti `:8080` dengan hostname publik,
arahkan DNS ke VPS, dan buka port HTTP/HTTPS untuk Caddy. Jalankan
`caddy validate` untuk konfigurasi tersebut sebelum reload. Port 3000 tetap
lokal. Untuk katalog lain, daftarkan ID toko dan data di backend, lalu buat
blok Caddy terpisah dengan folder statis dan `X-Store-Id` yang sesuai. Caddy
menimpa header toko dengan nilai yang ditetapkan di konfigurasi.

Setelah mengubah katalog, build kembali halaman dan restart Fastify agar
HTML dan chatbot memuat data terbaru.

## Coba di Vercel

Impor repositori yang berisi folder proyek ini ke Vercel. Jika proyek berada
dalam subfolder repositori, set Root Directory ke folder yang berisi
`package.json`, `vercel.json`, dan `api/`. Konfigurasi menjalankan
`npm run build`, menyajikan halaman dari `dist/`, dan mengambil
`POST /api/chat` dari `api/chat.js`. Endpoint memakai katalog RESTEP
yang sama dengan Fastify dan tidak membutuhkan pengaturan variabel lingkungan.

Setelah deploy, buka URL Vercel dan coba kirim “Harga dan kondisi?” lewat
widget. Deploy proyek lengkap agar Vercel bisa membangun halaman dan fungsi.
