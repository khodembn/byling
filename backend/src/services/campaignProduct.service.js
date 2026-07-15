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




export const getCampaignProducts = async (campaignId, user) => {
  const campaign = await prisma.campaign.findUnique({
    where: { campaignId },
  });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد");
  }


  if (campaign.buildingId !== user.buildingId) {
    throw new Error("دسترسی ندارید");
  }

  const products = await prisma.campaignProduct.findMany({
    where: { campaignId },
    include: {
      product: true,
    },
  });

  return products.map((p) => ({
    campaignProductId: p.campaignProductId,
    productId: p.product.productId,
    productName: p.product.productName,
    imageUrl: p.product.imageUrl,

    marketPrice: Number(p.marketPriceSnapshot),
    bulkPrice: Number(p.bulkPrice),
    shippingCost: Number(p.shippingCost ?? 0),

    saving:
      Number(p.marketPriceSnapshot) -
      Number(p.bulkPrice),

    savingPercent:
      ((Number(p.marketPriceSnapshot) -
        Number(p.bulkPrice)) /
        Number(p.marketPriceSnapshot)) *
      100,

    thresholdQuantity: p.thresholdQuantity,
    currentQuantity: p.currentQuantity,
    status: p.status,
  }));
};


export const updateCampaignProduct = async (
  campaignId,
  campaignProductId,
  user,
  data
) => {

  const campaign = await prisma.campaign.findUnique({
    where: {
      campaignId: Number(campaignId),
    },
  });


  if (!campaign) {
    throw new Error("کمپین پیدا نشد");
  }



  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error("دسترسی ندارید");
  }



  // فقط در این وضعیت‌ها اجازه ویرایش داریم
  if (
    !["DRAFT", "ACTIVE"].includes(campaign.status)
  ) {
    throw new Error(
      "در وضعیت فعلی کمپین امکان ویرایش محصول وجود ندارد."
    );
  }



  const campaignProduct =
    await prisma.campaignProduct.findUnique({
      where: {
        campaignProductId: Number(campaignProductId),
      },
    });



  if (!campaignProduct) {
    throw new Error(
      "محصول کمپین پیدا نشد"
    );
  }



  if (
    campaignProduct.campaignId !== Number(campaignId)
  ) {
    throw new Error(
      "این محصول متعلق به این کمپین نیست."
    );
  }



  // بعد از شروع سفارش‌گیری نباید قیمت تغییر کند
  if (
    campaignProduct.status !== "OPEN"
  ) {
    throw new Error(
      "این محصول دیگر قابل ویرایش نیست."
    );
  }



  const marketPrice =
    data.marketPriceSnapshot ??
    campaignProduct.marketPriceSnapshot;


  const bulkPrice =
    data.bulkPrice ??
    campaignProduct.bulkPrice;


  const thresholdQuantity =
    data.thresholdQuantity ??
    campaignProduct.thresholdQuantity;


  const shippingCost =
    data.shippingCost ??
    campaignProduct.shippingCost;



  if (
    Number(marketPrice) <= 0 ||
    Number(bulkPrice) <= 0
  ) {
    throw new Error(
      "قیمت‌ها باید بیشتر از صفر باشند."
    );
  }



  if (
    Number(bulkPrice) > Number(marketPrice)
  ) {
    throw new Error(
      "قیمت عمده نمی‌تواند بیشتر از قیمت فروشگاه باشد."
    );
  }



  if (
    Number(thresholdQuantity) <= 0
  ) {
    throw new Error(
      "حد نصاب باید بیشتر از صفر باشد."
    );
  }



  if (
    Number(shippingCost) < 0
  ) {
    throw new Error(
      "هزینه ارسال نمی‌تواند منفی باشد."
    );
  }




  const updated =
    await prisma.campaignProduct.update({

      where: {
        campaignProductId:
          Number(campaignProductId),
      },


      data: {

        marketPriceSnapshot:
          marketPrice,


        bulkPrice:
          bulkPrice,


        thresholdQuantity:
          Number(thresholdQuantity),


        shippingCost:
          shippingCost,

      },

    });



  return {
    success: true,

    campaignProduct: {

      ...updated,

      marketPriceSnapshot:
        Number(updated.marketPriceSnapshot),

      bulkPrice:
        Number(updated.bulkPrice),

      shippingCost:
        Number(updated.shippingCost ?? 0),

    },

  };

};


export const deleteCampaignProduct = async (
  campaignId,
  campaignProductId,
  user
) => {

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

    });


  if (!campaign) {
    throw new Error(
      "کمپین پیدا نشد"
    );
  }



  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error(
      "دسترسی ندارید"
    );
  }



  if (
    !["DRAFT", "ACTIVE"].includes(
      campaign.status
    )
  ) {
    throw new Error(
      "در وضعیت فعلی امکان حذف محصول وجود ندارد."
    );
  }



  const campaignProduct =
    await prisma.campaignProduct.findUnique({

      where: {
        campaignProductId:
          Number(campaignProductId),
      },

    });



  if (!campaignProduct) {
    throw new Error(
      "محصول کمپین پیدا نشد"
    );
  }



  if (
    campaignProduct.campaignId !==
    Number(campaignId)
  ) {
    throw new Error(
      "این محصول متعلق به این کمپین نیست."
    );
  }



  if (
    campaignProduct.status !== "OPEN"
  ) {
    throw new Error(
      "این محصول دیگر قابل حذف نیست."
    );
  }



  // بررسی اینکه کسی سفارش داده یا نه
  const orderItems =
    await prisma.orderItem.count({

      where: {
        campaignProductId:
          Number(campaignProductId),
      },

    });



  if (orderItems > 0) {
    throw new Error(
      "برای این محصول سفارش ثبت شده و قابل حذف نیست."
    );
  }



  await prisma.campaignProduct.delete({

    where: {
      campaignProductId:
        Number(campaignProductId),
    },

  });



  return {

    success: true,

    message:
      "محصول از کمپین حذف شد."

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
