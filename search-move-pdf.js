import fs from "fs";
import fse from "fs-extra";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import Tesseract from "tesseract.js";
import { convert } from "pdf-poppler";

const sourceDir = "D:/Test-project/pdf-search-ocr/pdfs/source";
const destDir = "D:/Test-project/pdf-search-ocr/pdfs/found";
const keyword = "หรรษธร";

// OCR PDF: แปลงทุกหน้าเป็น PNG แล้ว OCR
async function ocrPdf(filePath) {
    const tempDir = path.join(path.dirname(filePath), "temp_images");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const opts = {
        format: "png",
        out_dir: tempDir,
        out_prefix: path.basename(filePath, path.extname(filePath)),
        page: null // แปลงทุกหน้า
    };

    console.log("กำลังแปลงเป็นรูปภาพ...");
    await convert(filePath, opts);

    // OCR ทุกไฟล์รูปใน tempDir
    const images = fs.readdirSync(tempDir).filter(f => f.endsWith(".png"));
    let textAll = "";
    for (const img of images) {
        const imgPath = path.join(tempDir, img);
        console.log("OCR:", img);
        const { data: { text } } = await Tesseract.recognize(imgPath, "tha+eng");
        textAll += text + "\n";
        fs.unlinkSync(imgPath); // ลบไฟล์รูปหลัง OCR เพื่อลดขยะ
    }
    fs.rmdirSync(tempDir);
    return textAll;
}

// อ่าน pdf ปกติ
async function parsePdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        return data.text; // มีทุกหน้าแล้ว
    } catch (err) {
        console.error("อ่าน PDF ไม่ได้:", filePath, err);
        return "";
    }
}

async function main() {
    console.log("กำลังค้นหาไฟล์ PDF ที่มีคำว่า:", keyword);

    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith(".pdf"));

    for (const file of files) {
        const filePath = path.join(sourceDir, file);

        let text = await parsePdf(filePath);

        if (!text.trim()) {
            console.log("ใช้ OCR กับไฟล์:", file);
            text = await ocrPdf(filePath);
        }

        if (text.includes(keyword)) {
            console.log(`✅ เจอ "${keyword}" ในไฟล์:`, file);
            const destPath = path.join(destDir, file);
            await fse.move(filePath, destPath, { overwrite: true });
            console.log("➡️ ย้ายไฟล์ไป:", destPath);
        } else {
            console.log(`- ไม่พบคำในไฟล์: ${file}`);
        }
    }
}

main().catch(err => console.error(err));
