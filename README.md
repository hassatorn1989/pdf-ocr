# PDF Search OCR

This project provides tools for searching and moving PDF files using OCR (Optical Character Recognition). It is designed to help organize and process PDF documents, including those in Thai and English, with support for Tesseract trained data files.

# PDF Search OCR

# หรรษธรทำโว้ยยยยยย!

This project provides tools for searching and moving PDF files using OCR (Optical Character Recognition). It is designed to help organize and process PDF documents, including those in Thai and English, with support for Tesseract trained data files.

## Features
- Search PDF files for text using OCR
- Move or organize PDF files based on search results
- Support for Thai (`tha.traineddata`) and English (`eng.traineddata`) languages

## Folder Structure
- `pdfs/` - Main folder containing PDF files
  - `found/` - PDFs that have been found or processed
  - `source/` - Source PDFs for processing
- `search-move-pdf.js` - Main script for searching and moving PDFs
- `eng.traineddata`, `tha.traineddata` - Tesseract OCR language data files

## Requirements
- Node.js
- Tesseract OCR

## Usage
1. Install dependencies:
   ```cmd
   npm install
   ```
2. Run the main script:
   ```cmd
   node search-move-pdf.js
   ```
3. Place your PDF files in the `pdfs/source/` directory for processing.

## License
MIT
