import multer from "multer";
import path from "path";
import fs from "fs";

// اگر پوشه uploads/receipts وجود نداشت بساز
const uploadPath = "uploads/receipts";

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

    cb(
      null,
      `receipt-${Date.now()}${ext}`
    );

  },

});

// فقط عکس
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

    cb(
      new Error("فرمت فایل مجاز نیست."),
      false
    );

  }

};

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 5 * 1024 * 1024,

  },

});

export default upload;