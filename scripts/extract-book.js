const fs = require('fs');
const path = require('path');

async function main() {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const pdfPath = path.join(__dirname, 'numerosbook.pdf');
  const buffer = fs.readFileSync(pdfPath);
  const uint8Array = new Uint8Array(buffer);

  const doc = await getDocument({ data: uint8Array }).promise;
  const numPages = doc.numPages;
  console.log(`Total pages: ${numPages}`);

  let fullText = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
    if (i % 10 === 0) process.stdout.write(`Processed ${i}/${numPages} pages...\r`);
  }

  const outPath = path.join(__dirname, 'book-raw.txt');
  fs.writeFileSync(outPath, fullText, 'utf-8');

  console.log(`\nCharacters: ${fullText.length}`);
  console.log(`Saved to: ${outPath}`);
  console.log('\n--- FIRST 3000 CHARS ---\n');
  console.log(fullText.slice(0, 3000));
}

main().catch(console.error);
