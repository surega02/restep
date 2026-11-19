export function replyTo(message, product) {
  const query = message.toLowerCase();
  const requestedSizes = [...query.matchAll(/\b([345][0-9])\b/g)].map(match => match[1]);
  const sizes = requestedSizes.filter(size => size !== product.size);
  const availability = 'Stok demo ' + product.stock + ', EU ' + product.size + ' dengan insole ' + product.insole + '.';
  const price = 'Harga demo ' + product.product + ' ' + product.price + '.';
  const answers = [
    [/\b(ori|asli|original|autentik|keaslian)\b/, product.product + ' adalah produk fiktif dalam demo ini.'],
    [/\b(harga|diskon|nego)\b/, price],
    [/\b(ukuran|size|stok|ready|tersedia|insole|eu|[345][0-9])\b/,
      (sizes.length ? 'Ukuran EU ' + sizes.join(', ') + ' tidak tersedia. ' : '') + availability],
    [/\b(kondisi|bekas|preloved|minus|cacat|mulus|outsole)\b/, 'Kondisi demo ' + product.condition + '. ' + product.wear],
    [/\b(box|dus|kelengkapan|tali)\b/, product.package],
    [/\b(pesan|pesanannya|pemesanan|beli|order|checkout|bayar|admin|whatsapp|wa)\b/,
      'Simulasi pemesanan. Ringkasan untuk admin: “Saya mau ' + product.product + ', EU ' + product.size + ', ' + product.price + '.” Demo ini tidak menerima pesanan atau pembayaran.'],
    [/\b(ongkir|kirim|pengiriman|cod|alamat)\b/, 'Dalam demo ini, ongkir dan opsi pengiriman belum tersedia.']
  ];
  const matches = answers.filter(([pattern]) => pattern.test(query)).map(([, answer]) => answer);
  if (matches.length) return matches.join('\n\n');
  if (/\bberapa\b/.test(query)) return price;
  if (/\b(halo|hai|hi)\b/.test(query)) return 'Halo! Mau cek harga, ukuran, kondisi, atau cara pesan?';
  return 'Aku belum punya informasi itu. Coba tanya soal harga, ukuran, kondisi, kelengkapan, atau cara pesan.';
}
