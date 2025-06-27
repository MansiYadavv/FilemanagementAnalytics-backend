const FileUpload = require('../models/fileModel');
const FileUtils = require('../utils/fileUtils');
const path = require('path');

class FileService {
  static async processAndSaveFiles(files, submissionId) {
    const fileIds = [];

    for (const file of files) {
      try {
        const fileType = FileUtils.determineFileType(file.mimetype);
        const fileSize = FileUtils.getFileSize(file.path);
        const fileUrl = FileUtils.generateFileUrl(file.filename);

        let fileMeta = { size: fileSize };

        // Extract metadata based on file type
        if (fileType === 'image') {
          const dimensions = await FileUtils.extractImageMetadata(file.path);
          fileMeta.dimensions = dimensions;
        } else if (fileType === 'pdf') {
          const pdfMeta = await FileUtils.extractPdfMetadata(file.path);
          fileMeta.pageCount = pdfMeta.pageCount;
        }

        const fileUpload = new FileUpload({
          submissionId,
          fileType,
          originalName: file.originalname,
          fileUrl,
          fileMeta
        });

        await fileUpload.save();
        fileIds.push(fileUpload._id);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        throw new Error(`Failed to process file: ${file.originalname}`);
      }
    }

    return fileIds;
  }

  static async getFilesBySubmissionId(submissionId) {
    try {
      return await FileUpload.find({ submissionId });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FileService;