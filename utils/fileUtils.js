const sharp = require('sharp');
const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractMetadata(file) {
  try {
    if (file.mimetype.startsWith('image/')) {
      const metadata = await sharp(file.path).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: file.size,
      };
    } else if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      return {
        pageCount: pdfData.numpages,
        size: file.size,
        textSnippet: pdfData.text ? pdfData.text.slice(0, 200) : '',
      };
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error('Metadata extraction error:', err);
    return {};
  }
}

module.exports = { extractMetadata };

// const sharp = require('sharp');
// const fs = require('fs');
// const pdfParse = require('pdf-parse');

// async function extractMetadata(file) {
//   try {
//     if (file.mimetype.startsWith('image/')) {
//       const metadata = await sharp(file.path).metadata();
//       return {
//         width: metadata.width,
//         height: metadata.height,
//         format: metadata.format,
//       };
//     } else if (file.mimetype === 'application/pdf') {
//       const dataBuffer = fs.readFileSync(file.path);
//       const pdfData = await pdfParse(dataBuffer);
//       return {
//         text: pdfData.text, 
//       };
//     } else {
//       throw new Error('Unsupported file type');
//     }
//   } catch (err) {
//     console.error('Metadata extraction error:', err);
//     return {};
//   }
// }

// module.exports = { extractMetadata };
