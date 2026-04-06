const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const bookPath = process.argv[2];
if (!bookPath) {
  console.error('Укажи путь к PDF: node scripts/parse-book.js /path/to/book.pdf');
  process.exit(1);
}

const dataBuffer = fs.readFileSync(bookPath);
const parser = new PDFParse();

parser.parse(dataBuffer).then((data) => {
  const outputPath = path.join(__dirname, '../src/data/book-raw.txt');
  fs.writeFileSync(outputPath, data.text, 'utf8');
  console.log(`✅ Извлечено ${data.numpages} страниц`);
  console.log(`📄 Сохранено в src/data/book-raw.txt`);
  console.log(`📊 Символов: ${data.text.length}`);
}).catch((err) => {
  console.error('Ошибка парсинга PDF:', err.message);
});
