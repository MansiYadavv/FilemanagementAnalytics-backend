
const sharp = require('sharp');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class FileUtils {
  static async extractImageMetadata(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      throw new Error(`Failed to extract image metadata: ${error.message}`);
    }
  }

  static async extractPdfMetadata(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return {
        pageCount: data.numpages
      };
    } catch (error) {
      throw new Error(`Failed to extract PDF metadata: ${error.message}`);
    }
  }

  static getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get file size: ${error.message}`);
    }
  }

  static determineFileType(mimetype) {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype === 'application/pdf') {
      return 'pdf';
    }
    throw new Error('Unsupported file type');
  }

  static generateFileUrl(filename) {
    return `/uploads/${filename}`;
  }
}

module.exports = FileUtils;