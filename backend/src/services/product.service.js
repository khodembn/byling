import prisma from "../prisma/prisma.js";



const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
};

;

export const createProduct = async (req) => {
  const data = req.body;

  const name = data.productName.trim();

  const slug = generateSlug(name);

  const existing = await prisma.product.findFirst({
    where: {
      slug,
    },
  });

  if (existing) {
    throw new Error("این محصول قبلاً ثبت شده است");
  }

  const imageUrl = req.file
    ? `/uploads/products/${req.file.filename}`
    : null;

  const product = await prisma.product.create({
    data: {
      productName: name,
      slug,
      unit: data.unit,
      weightPerUnit: Number(data.weightPerUnit),
      description: data.description,
      imageUrl: req.file
        ? `/uploads/products/${req.file.filename}`
        : null,
    },
  });

  return {
    success: true,
    message: "محصول با موفقیت ایجاد شد.",
    product,
  };
};

// همه محصولات
export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });

  return {
    success: true,
    products,
  };
};

// یک محصول
export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { productId: Number(id) },
  });

  if (!product) {
    throw new Error("محصول پیدا نشد");
  }

  return {
    success: true,
    product,
  };
};