import prisma from "../prisma/prisma.js";

export const addProductToCampaign = async (campaignId, data) => {
  const {
    productId,
    marketPriceSnapshot,
    bulkPrice,
    thresholdQuantity,
    shippingCost,
  } = data;

  
  const campaign = await prisma.campaign.findUnique({
    where: { campaignId: Number(campaignId) },
  });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد");
  }
  
  const product = await prisma.product.findUnique({
    where: { productId },
  });

  if (!product) {
    throw new Error("محصول پیدا نشد");
  }

  
  const existing = await prisma.campaignProduct.findFirst({
    where: {
      campaignId: Number(campaignId),
      productId,
    },
  });

  if (existing) {
    throw new Error("این محصول قبلاً به کمپین اضافه شده");
  }

  
  const campaignProduct = await prisma.campaignProduct.create({
    data: {
      campaignId: Number(campaignId),
      productId,

      marketPriceSnapshot,
      bulkPrice,
      thresholdQuantity,
      shippingCost,

      status: "OPEN",
    },
  });

  await prisma.campaign.update({
  where: {
    campaignId: Number(campaignId),
  },
  data: {
    status: "ACTIVE",
  },
});

  return {
    success: true,
    campaignProduct,
  };
};


/*export const updateShippingCost = async (

  campaignProductId,
  shippingCost,
  user
) => {
  const campaignProduct =
    await prisma.campaignProduct.findUnique({
      where: {
        campaignProductId,
      },
      include: {
        campaign: true,
      },
    });

  if (!campaignProduct) {
    throw new Error("محصول پیدا نشد");
  }

  if (
    campaignProduct.campaign.managerUserId !==
    user.userId
  ) {
    throw new Error("دسترسی ندارید");
  }

  return await prisma.campaignProduct.update({
    where: {
      campaignProductId,
    },
    data: {
      shippingCost,
    },
  });
};*/
