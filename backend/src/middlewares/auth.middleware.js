import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "توکن ارسال نشده است",
      });
    }

    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "فرمت توکن اشتباه است",
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ذخیره اطلاعات کاربر در request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "توکن نامعتبر است",
    });
  }
};