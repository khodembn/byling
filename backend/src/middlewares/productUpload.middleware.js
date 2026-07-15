import multer from "multer";
import path from "path";
import fs from "fs";

// اگر پوشه uploads/products وجود نداشت بساز
const uploadPath = "uploads/products";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// محل ذخیره فایل
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname);

        cb(null, `product-${Date.now()}${ext}`);
    },
});

// فقط فایل‌های تصویری
const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("فقط فایل تصویری مجاز است."), false);
    }
};

const productUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default productUpload;