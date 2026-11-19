import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import catalog from './catalog.json' with { type: 'json' };

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');

await mkdir(output, { recursive: true });
const template = await readFile(new URL('public/index.html', root), 'utf8');
const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!Object.hasOwn(catalog, key)) throw new Error('Kolom katalog tidak ditemukan: ' + key);
  return escapeHtml(catalog[key]);
});
await writeFile(new URL('index.html', output), html);
for (const asset of ['court-low.webp', 'style.css', 'chat.js']) {
  await copyFile(new URL('public/' + asset, root), new URL(asset, output));
}
