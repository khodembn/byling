import prisma from "../prisma/prisma.js";
import { createNotification } from "./notification.service.js";
export const createCampaign = async (
  user,
  data
) => {
  const {
    title,
    paymentDeadline,
  } = data;

  const campaign =
    await prisma.campaign.create({
      data: {
        title,

        status: "DRAFT",

        paymentDeadline: paymentDeadline
          ? new Date(paymentDeadline)
          : null,

        buildingId: user.buildingId,

        managerUserId: user.userId,
      },
    });

  return {
    success: true,
    message: "کمپین ایجاد شد",
    campaign,
  };
};

export const updateCampaign = async (
  user,
  campaignId,
  data
) => {


  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId)
      }

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
    ![
      "DRAFT",
      "ACTIVE"
    ].includes(
      campaign.status
    )
  ) {

    throw new Error(
      "در این وضعیت امکان ویرایش کمپین وجود ندارد."
    );

  }





  const updatedCampaign =
    await prisma.campaign.update({

      where: {
        campaignId: Number(campaignId)
      },


      data: {


        title:
          data.title,


        paymentDeadline:
          data.paymentDeadline
            ?
            new Date(data.paymentDeadline)
            :
            undefined,


      }

    });



  return updatedCampaign;


};


export const deleteCampaign = async (
  user,
  campaignId
) => {


  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId)
      },


      include: {

        campaignProducts: true

      }

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
    campaign.status !== "DRAFT"
  ) {

    throw new Error(
      "فقط کمپین پیش‌نویس قابل حذف است."
    );

  }





  const orders =
    await prisma.userOrder.count({

      where: {
        campaignId:
          Number(campaignId)
      }

    });




  if (orders > 0) {

    throw new Error(
      "کمپین دارای سفارش است و قابل حذف نیست."
    );

  }





  await prisma.$transaction(
    async (tx) => {


      await tx.campaignProduct.deleteMany({

        where: {
          campaignId:
            Number(campaignId)
        }

      });



      await tx.campaign.delete({

        where: {
          campaignId:
            Number(campaignId)
        }

      });


    }
  );





  return {

    message:
      "کمپین حذف شد."

  };


};


export const getResidentCampaigns = async (userId) => {
  // پیدا کردن ساختمان ساکن
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      buildingId: true,
    },
  });

  if (!user) {
    throw new Error("کاربر پیدا نشد.");
  }

  // دریافت کمپین‌های ساختمان
  const campaigns = await prisma.campaign.findMany({
    where: {
      buildingId: user.buildingId,
      status: {
        in: [
          "ACTIVE",
          "AWAITING_PAYMENT",
          "PURCHASING",
          "READY_FOR_DELIVERY",
        ],
      },
    },
    include: {
      manager: {
        select: {
          fullName: true,
          mobile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return campaigns;
};

export const getAllCampaigns = async () => {
  return await prisma.campaign.findMany({
    include: {
      building: {
        select: {
          buildingName: true,
        },
      },
      manager: {
        select: {
          fullName: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCampaignById = async (campaignId, user) => {
  const campaign = await prisma.campaign.findUnique({
    where: {
      campaignId,
    },

    include: {
      building: true,

      manager: {
        select: {
          fullName: true,
          mobile: true,
        },
      },
    },
  });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد");
  }

  // بررسی دسترسی
  if (campaign.buildingId !== user.buildingId) {
    throw new Error("دسترسی ندارید");
  }

  return campaign;
};
export const getMyCampaigns = async (user) => {
  return await prisma.campaign.findMany({
    where: {
      buildingId: user.buildingId,
    },

    include: {
      manager: {
        select: {
          fullName: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
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

export const requestPayment = async (
  user,
  campaignId,
  data
) => {

  const { paymentDeadline } = data;

  if (!paymentDeadline) {

    throw new Error(
      "مهلت پرداخت را وارد کنید."
    );

  }

  const manager =
    await prisma.user.findUnique({

      where: {

        userId: user.userId,

      },

      select: {

        paymentCardNumber: true,

        paymentCardHolder: true,

      },

    });

  if (!manager) {

    throw new Error("کاربر پیدا نشد.");

  }

  if (
    !manager.paymentCardNumber ||
    !manager.paymentCardHolder
  ) {

    throw new Error(
      "ابتدا اطلاعات کارت خود را در پروفایل تکمیل کنید."
    );

  }

  const campaign =
    await prisma.campaign.findUnique({

      where: {

        campaignId: Number(campaignId),

      },

      include: {

        campaignProducts: {

          include: {

            product: true,

          },

        },

      },

    });

  if (!campaign) {

    throw new Error("کمپین پیدا نشد.");

  }

  if (
    campaign.managerUserId !==
    user.userId
  ) {

    throw new Error("دسترسی ندارید.");

  }

  if (
    campaign.status !== "ACTIVE"
  ) {

    throw new Error(
      "کمپین در وضعیت قابل ارسال درخواست پرداخت نیست."
    );

  }

  const readyProducts =
    campaign.campaignProducts.filter(

      item =>
        item.status ===
        "THRESHOLD_REACHED"

    );

  if (readyProducts.length === 0) {

    throw new Error(
      "هیچ محصولی به حد نصاب نرسیده است."
    );

  }

  const users = new Map();

  for (const campaignProduct of readyProducts) {

    const orderItems =
      await prisma.orderItem.findMany({

        where: {

          campaignProductId:
            campaignProduct.campaignProductId,

          userOrder: {

            status: "SUBMITTED",

          },

        },

        include: {

          userOrder: {

            include: {

              user: true,

            },

          },

        },

      });

    for (const item of orderItems) {

      const userId =
        item.userOrder.user.userId;

      if (!users.has(userId)) {

        users.set(userId, []);

      }

      users
        .get(userId)
        .push(
          campaignProduct.product.productName
        );

    }

  }

  for (const [userId, products] of users) {

    const productList =
      products
        .map(
          product => `• ${product}`
        )
        .join("\n");

    const notificationMessage = `

محصولات زیر آماده پرداخت هستند:

${productList}

----------------------------

پیش‌فاکتور شما آماده شده است.

لطفاً وارد بخش سفارش‌های من شوید،
پیش‌فاکتور را مشاهده کنید،
پرداخت را انجام دهید
و تصویر فیش واریزی را بارگذاری نمایید.

مهلت پرداخت:
${new Date(paymentDeadline).toLocaleString("fa-IR")}

`;

    await createNotification({

      userId,

      title: "درخواست پرداخت",

      message:
        notificationMessage.trim(),

      type: "PAYMENT_REQUEST",

    });

  }

  await prisma.campaignProduct.updateMany({

    where: {

      campaignId:
        campaign.campaignId,

      status:
        "THRESHOLD_REACHED",

    },

    data: {

      status:
        "AWAITING_PAYMENT",

    },

  });

  await prisma.campaign.update({

    where: {

      campaignId:
        campaign.campaignId,

    },

    data: {

      status:
        "AWAITING_PAYMENT",

      paymentDeadline:
        new Date(paymentDeadline),

      paymentCardNumber:
        manager.paymentCardNumber,

      paymentCardHolder:
        manager.paymentCardHolder,

    },

  });

  return {

    success: true,

    message:
      `درخواست پرداخت برای ${users.size} ساکن ارسال شد.`,

  };

};

/*export const updatePaymentInfo = async (
  campaignId,
  user,
  data
) => {

  const {

    paymentCardNumber,

    paymentCardHolder,

    paymentDeadline,

    paymentMessage,

  } = data;

  const campaign =
    await prisma.campaign.findUnique({

      where: {

        campaignId: Number(campaignId),

      },

    });

  if (!campaign) {

    throw new Error("کمپین پیدا نشد.");

  }

  if (

    campaign.managerUserId !==

    user.userId

  ) {

    throw new Error("دسترسی ندارید.");

  }

  const updatedCampaign =
    await prisma.campaign.update({

      where: {

        campaignId: Number(campaignId),

      },

      data: {

        paymentCardNumber,

        paymentCardHolder,

        paymentDeadline: paymentDeadline
          ? new Date(paymentDeadline)
          : null,

        paymentMessage,

      },

    });

  return updatedCampaign;

};*/





export const cancelUnpaidOrders = async (
  user,
  campaignId
) => {

  const campaign = await prisma.campaign.findUnique({

    where: {
      campaignId: Number(campaignId),
    },

    include: {

      orders: {

        include: {

          payment: true,

          orderItems: true,

        },

      },

      campaignProducts: {

        include: {

          product: true,

        },

      },

    },

  });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }

  if (campaign.managerUserId !== user.userId) {
    throw new Error("شما دسترسی ندارید.");
  }

  if (campaign.status !== "AWAITING_PAYMENT") {
    throw new Error("کمپین در مرحله پرداخت نیست.");
  }

  const unpaidOrders = campaign.orders.filter((order) => {

    if (order.status !== "SUBMITTED")
      return false;

    if (!order.payment)
      return true;

    return (
      order.payment.paymentStatus === "PENDING" ||
      order.payment.paymentStatus === "REJECTED"
    );

  });

  if (unpaidOrders.length > 0) {

    await prisma.$transaction(async (tx) => {

      for (const order of unpaidOrders) {

        await tx.userOrder.update({

          where: {
            userOrderId: order.userOrderId,
          },

          data: {
            status: "CANCELLED",
          },

        });

        if (
          order.payment &&
          order.payment.paymentStatus === "PENDING"
        ) {

          await tx.payment.update({

            where: {
              paymentId: order.payment.paymentId,
            },

            data: {

              paymentStatus: "REJECTED",

              rejectReason:
                "مهلت پرداخت به پایان رسید.",

              reviewedAt: new Date(),

            },

          });

        }

        for (const item of order.orderItems) {

          await tx.campaignProduct.update({

            where: {
              campaignProductId:
                item.campaignProductId,
            },

            data: {

              currentQuantity: {

                decrement: item.quantity,

              },

            },

          });

        }

      }

    });

  }

  const products =
    await prisma.campaignProduct.findMany({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        product: true,

      },

    });

  const thresholdLostProducts =
    products
      .filter(
        (product) =>
          product.currentQuantity <
          product.thresholdQuantity
      )
      .map((product) => ({

        campaignProductId:
          product.campaignProductId,

        productName:
          product.product.productName,

        currentQuantity:
          product.currentQuantity,

        thresholdQuantity:
          product.thresholdQuantity,

        missingQuantity:
          product.thresholdQuantity -
          product.currentQuantity,

      }));

  return {

    success: true,

    cancelledOrders:
      unpaidOrders.length,

    thresholdLost:
      thresholdLostProducts.length > 0,

    products:
      thresholdLostProducts,

  };

};

export const reopenCampaign = async (
  user,
  campaignId,
  paymentDeadline,
  message
) => {

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        campaignProducts: true,

        building: {

          include: {

            users: true,

          },

        },

      },

    });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }

  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error("دسترسی ندارید.");
  }

  if (
    campaign.status !== "AWAITING_PAYMENT"
  ) {
    throw new Error(
      "کمپین قابل بازگشایی نیست."
    );
  }
  await prisma.$transaction(async (tx) => {

    // فعال شدن دوباره کمپین
    await tx.campaign.update({

      where: {
        campaignId: campaign.campaignId,
      },

      data: {

        status: "ACTIVE",

        paymentDeadline: new Date(paymentDeadline),

        reopenedCount: {
          increment: 1,
        },

      },

    });

    // فقط محصولاتی که حد نصابشان از بین رفته
    // دوباره OPEN می‌شوند.
    // بقیه چون هنوز AWAITING_PAYMENT هستند
    // اصلاً آپدیت نمی‌شوند.

    for (const product of campaign.campaignProducts) {

      if (
        product.currentQuantity <
        product.thresholdQuantity
      ) {

        await tx.campaignProduct.update({

          where: {
            campaignProductId:
              product.campaignProductId,
          },

          data: {

            status: "OPEN",

          },

        });

      }

    }

  });
  for (const resident of campaign.building.users) {

    await createNotification({

      userId: resident.userId,

      title: "بازگشایی کمپین",

      message,

      type: "REOPEN_THRESHOLD",

    });

  }

  return {

    success: true,

    message: "کمپین با موفقیت دوباره فعال شد.",

  };
};
export const checkPurchasing = async (
  user,
  campaignId
) => {

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        campaignProducts: {

          include: {

            product: true,

          },

        },

        orders: true,

      },

    });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }

  if (campaign.managerUserId !== user.userId) {
    throw new Error("دسترسی ندارید.");
  }

  if (campaign.status !== "AWAITING_PAYMENT") {
    throw new Error(
      "کمپین در مرحله پرداخت نیست."
    );
  }

  const invalidOrders =
    campaign.orders.filter(

      (order) =>

        order.status !== "CART" &&
        order.status !== "PAID" &&
        order.status !== "CANCELLED"

    );

  if (invalidOrders.length > 0) {

    throw new Error(
      "هنوز همه سفارش‌ها تعیین تکلیف نشده‌اند."
    );

  }

  const missingProducts =
    campaign.campaignProducts

      .filter(
        (product) =>
          product.currentQuantity <
          product.thresholdQuantity
      )

      .map((product) => ({

        campaignProductId:
          product.campaignProductId,

        productName:
          product.product.productName,

        currentQuantity:
          product.currentQuantity,

        thresholdQuantity:
          product.thresholdQuantity,

        missingQuantity:
          product.thresholdQuantity -
          product.currentQuantity,

      }));

  return {

    needConfirmation:
      missingProducts.length > 0,

    products:
      missingProducts,

  };

};
export const startPurchasing = async (
  user,
  campaignId,
  managerMessage
) => {

  // بررسی اینکه آیا نیاز به تایید وجود دارد یا خیر
  const check = await checkPurchasing(
    user,
    campaignId
  );

  if (
    check.needConfirmation &&
    (!managerMessage ||
      managerMessage.trim() === "")
  ) {

    throw new Error(
      "لطفاً توضیح جبران کمبود حد نصاب را وارد کنید."
    );

  }

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        orders: {

          include: {

            user: true,

            invoice: true,

          },

        },

        campaignProducts: true,

      },

    });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }

  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error("شما دسترسی ندارید.");
  }

  if (campaign.orders.length === 0) {
    throw new Error("این کمپین هیچ سفارشی ندارد.");
  }

  if (
    campaign.status !== "AWAITING_PAYMENT"
  ) {
    throw new Error(
      "کمپین در مرحله پرداخت نیست."
    );
  }

  // فقط سفارش‌های SUBMITTED مانع شروع خرید هستند
  const invalidOrders =
    campaign.orders.filter(

      (order) =>

        order.status !== "CART" &&
        order.status !== "PAID" &&
        order.status !== "CANCELLED"

    );

  if (invalidOrders.length > 0) {

    throw new Error(

      "هنوز همه سفارش‌ها تعیین تکلیف نشده‌اند."

    );

  }

  // ثبت یادداشت مدیر (فقط برای خودش)
  if (
    managerMessage &&
    managerMessage.trim() !== ""
  ) {

    await createNotification({

      userId: user.userId,

      title: "یادداشت مسئول خرید",

      message: managerMessage,

      type: "GENERAL",

    });

  }

  await prisma.$transaction(async (tx) => {

    // تغییر وضعیت کمپین
    await tx.campaign.update({

      where: {
        campaignId: campaign.campaignId,
      },

      data: {
        status: "PURCHASING",
      },

    });

    // تغییر وضعیت محصولات
    await tx.campaignProduct.updateMany({

      where: {
        campaignId: campaign.campaignId,
      },

      data: {
        status: "PURCHASING",
      },

    });

    // نهایی شدن فاکتور سفارش‌های پرداخت‌شده
    for (const order of campaign.orders) {

      if (order.status !== "PAID")
        continue;

      await tx.invoice.update({

        where: {
          userOrderId:
            order.userOrderId,
        },

        data: {

          invoiceType: "FINAL",

        },

      });

    }

  });

  // اطلاع‌رسانی به کاربران پرداخت‌شده
  const paidOrders =
    campaign.orders.filter(

      (order) =>
        order.status === "PAID"

    );

  for (const order of paidOrders) {

    await createNotification({

      userId: order.userId,

      title: "شروع خرید عمده",

      message:
        "خرید عمده محصولات آغاز شد. پس از آماده شدن سفارش، اطلاع‌رسانی خواهد شد.",

      type: "GENERAL",

    });

  }

  return {

    success: true,

    message:
      "کمپین وارد مرحله خرید عمده شد.",

  };

};

export const readyForDelivery = async (
  user,
  campaignId,
  message
) => {

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        orders: true,

      },

    });

  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }

  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error("شما دسترسی ندارید.");
  }

  if (
    campaign.status !== "PURCHASING"
  ) {
    throw new Error(
      "کمپین در مرحله خرید عمده نیست."
    );
  }

  await prisma.$transaction(async (tx) => {

    // تغییر وضعیت کمپین
    await tx.campaign.update({

      where: {
        campaignId: campaign.campaignId,
      },

      data: {
        status: "READY_FOR_DELIVERY",
      },

    });

    // تغییر وضعیت سفارش‌های پرداخت‌شده
    await tx.userOrder.updateMany({

      where: {

        campaignId: campaign.campaignId,

        status: "PAID",

      },

      data: {

        status: "READY_FOR_DELIVERY",

      },

    });

  });

  // ارسال نوتیفیکیشن
  const paidOrders =
    campaign.orders.filter(
      order => order.status === "PAID"
    );

  for (const order of paidOrders) {

    await createNotification({

      userId: order.userId,

      title: "سفارش آماده تحویل است",

      message,

      type: "DELIVERY_READY",

    });

  }

  return {

    success: true,

    message:
      "کمپین وارد مرحله آماده تحویل شد.",

  };

}; export const completeCampaign = async (
  user,
  campaignId
) => {

  const campaign =
    await prisma.campaign.findUnique({

      where: {
        campaignId: Number(campaignId),
      },

      include: {

        orders: true,

      },

    });


  if (!campaign) {
    throw new Error("کمپین پیدا نشد.");
  }


  if (
    campaign.managerUserId !== user.userId
  ) {
    throw new Error("شما دسترسی ندارید.");
  }


  if (
    campaign.status !== "READY_FOR_DELIVERY"
  ) {
    throw new Error(
      "کمپین هنوز آماده تحویل نیست."
    );
  }



  await prisma.$transaction(async (tx) => {


    // تغییر وضعیت کمپین

    await tx.campaign.update({

      where: {
        campaignId: campaign.campaignId,
      },

      data: {

        status: "COMPLETED",

        completedAt: new Date(),

      },

    });



    // تحویل شدن سفارش‌ها

    await tx.userOrder.updateMany({

      where: {

        campaignId: campaign.campaignId,

        status: "READY_FOR_DELIVERY",

      },

      data: {

        status: "DELIVERED",

      },

    });


  });



  const users =
    [
      ...new Set(
        campaign.orders.map(
          order => order.userId
        )
      )
    ];



  for (const userId of users) {


    await createNotification({

      userId,

      title:
        "پایان کمپین خرید گروهی",

      message:
        "کمپین خرید گروهی با موفقیت به پایان رسید. از همراهی شما سپاسگزاریم.",

      type:
        "CAMPAIGN_COMPLETED",

    });


  }



  return {

    success: true,

    message:
      "کمپین با موفقیت تکمیل شد.",

  };

};