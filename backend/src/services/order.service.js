import prisma from "../prisma/prisma.js";
import { createNotification } from "./notification.service.js";
import { calculateInvoice } from "./invoice-calculator.service.js";
import { createInitialInvoice } from "./invoice.service.js";


export const createOrUpdateOrder = async (user, data) => {
const { campaignId, items } = data;

if (!items || items.length === 0) {
throw new Error("حداقل یک محصول باید انتخاب شود");
}

const campaign = await prisma.campaign.findUnique({
where: { campaignId },
});

if (!campaign) {
throw new Error("کمپین پیدا نشد");
}
/*if (campaign.status !== "OPEN") {
  throw new Error(
    "کمپین در حال حاضر بسته است و امکان ثبت یا ویرایش سفارش وجود ندارد."
  );
}*/

if (campaign.buildingId !== user.buildingId) {
throw new Error("دسترسی ندارید");
}

let order = await prisma.userOrder.findFirst({
where: {
userId: user.userId,
campaignId,
status: "CART",
},
});

if (!order) {
order = await prisma.userOrder.create({
data: {
userId: user.userId,
campaignId,
status: "CART",
},
});
}

for (const item of items) {
const { campaignProductId, quantity } = item;


const campaignProduct =
  await prisma.campaignProduct.findUnique({
    where: { campaignProductId },
  });

if (!campaignProduct) {
  throw new Error(
    `محصول ${campaignProductId} پیدا نشد`
  );
}

if (
  campaignProduct.campaignId !== campaignId
) {
  throw new Error(
    `محصول ${campaignProductId} متعلق به این کمپین نیست`
  );

}

if (campaign.status !== "ACTIVE") {
  throw new Error(
    "امکان ثبت سفارش در این کمپین وجود ندارد."
  );
}
if (campaignProduct.status !== "OPEN") {
  throw new Error(
    `محصول ${campaignProduct.productName ?? campaignProductId} در حال حاضر قابل سفارش نیست.`
  );
}
const existingItem =
  await prisma.orderItem.findFirst({
    where: {
      userOrderId: order.userOrderId,
      campaignProductId,
    },
  });

if (quantity === 0) {
  if (existingItem) {
    await prisma.orderItem.delete({
      where: {
        orderItemId:
          existingItem.orderItemId,
      },
    });
  }

  continue;
}

if (existingItem) {
  await prisma.orderItem.update({
    where: {
      orderItemId:
        existingItem.orderItemId,
    },
    data: {
      quantity,
      unitPriceSnapshot:
        campaignProduct.bulkPrice,
    },
  });
} else {
  await prisma.orderItem.create({
    data: {
      userOrderId:
        order.userOrderId,
      campaignProductId,
      quantity,
      unitPriceSnapshot:
        campaignProduct.bulkPrice,
    },
  });
}


}

const remainingItems =
await prisma.orderItem.count({
where: {
userOrderId:
order.userOrderId,
},
});

if (remainingItems === 0) {
await prisma.userOrder.delete({
where: {
userOrderId:
order.userOrderId,
},
});


return {
  orderDeleted: true,
};


}

return {
orderId: order.userOrderId,
};
};






export const getMyOrder = async (
  user,
  campaignId
) => {
  const order = await prisma.userOrder.findFirst({
    where: {
      userId: user.userId,
      campaignId,
    },
    include: {
      orderItems: {
        include: {
          campaignProduct: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return {
      items: [],
    };
  }

  return {
    orderId: order.userOrderId,

    items: order.orderItems.map((item) => ({
      orderItemId: item.orderItemId,

      campaignProductId:
        item.campaignProductId,

      productName:
        item.campaignProduct.product
          .productName,

      quantity: item.quantity,

      unitPrice: Number(
        item.unitPriceSnapshot
      ),

      totalPrice:
        Number(item.unitPriceSnapshot) *
        item.quantity,
    })),
  };
};

export const submitOrder = async (user, orderId) => {

  const order = await prisma.userOrder.findUnique({
    where: {
      userOrderId: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new Error("سفارش پیدا نشد");
  }

  if (order.userId !== user.userId) {
    throw new Error("دسترسی ندارید");
  }

  if (order.status !== "CART") {
    throw new Error("این سفارش قبلاً ثبت نهایی شده است");
  }

  // کمپین را می‌گیریم تا مدیر آن را پیدا کنیم
  const campaign = await prisma.campaign.findUnique({
    where: {
      campaignId: order.campaignId,
    },
  });
  const dbUser = await prisma.user.findUnique({
  where: {
    userId: user.userId,
  },
  select: {
    fullName: true,
  },
});

  for (const item of order.orderItems) {

    // وضعیت محصول قبل از افزایش تعداد
    const campaignProduct =
      await prisma.campaignProduct.findUnique({
        where: {
          campaignProductId: item.campaignProductId,
        },
        include: {
          product: true,
        },
      });

    // افزایش تعداد ثبت سفارش
    const updatedCampaignProduct =
      await prisma.campaignProduct.update({
        where: {
          campaignProductId: item.campaignProductId,
        },
        data: {
          currentQuantity: {
            increment: item.quantity,
          },
        },
      });

    const reachedThreshold =
      updatedCampaignProduct.currentQuantity >=
      updatedCampaignProduct.thresholdQuantity;

    // اگر تازه به حد نصاب رسیده باشد
    if (
      reachedThreshold &&
      campaignProduct.status !== "THRESHOLD_REACHED"
    ) {

      await prisma.campaignProduct.update({
        where: {
          campaignProductId: item.campaignProductId,
        },
        data: {
          status: "THRESHOLD_REACHED",
        },
      });

      await createNotification({
        userId: campaign.managerUserId,

        title: "حد نصاب تکمیل شد",

        message: `محصول "${campaignProduct.product.productName}" به حد نصاب رسید.`,

        type: "THRESHOLD_REACHED",
      });

    } else if (!reachedThreshold) {

      await prisma.campaignProduct.update({
        where: {
          campaignProductId: item.campaignProductId,
        },
        data: {
          status: "OPEN",
        },
      });

    }
  }

  // ثبت نهایی سفارش
  await prisma.userOrder.update({
    where: {
      userOrderId: orderId,
    },
    data: {
      status: "SUBMITTED",
    },
  });
  const orderForInvoice =
await prisma.userOrder.findUnique({

  where: {

    userOrderId: orderId,

  },

  include: {

    orderItems: {

      include: {

        campaignProduct: {

          include: {

            product: true,

          },

        },

      },

    },

  },

});

await createInitialInvoice(
  orderForInvoice
);
  // اطلاع به مسئول خرید
  await createNotification({
    userId: campaign.managerUserId,

    title: "سفارش جدید",

   message: `${dbUser.fullName} سفارش خود را ثبت نهایی کرد.`,
    
    
    type: "GENERAL",
  });

  return {
    success: true,
    message: "سفارش نهایی شد",
  };

};


export const cancelSubmittedOrder = async (
  user,
  orderId
) => {

  const order =
    await prisma.userOrder.findUnique({

      where: {
        userOrderId: Number(orderId),
      },

      include: {

        orderItems: true,

        campaign: true,

      },

    });

  if (!order) {
    throw new Error("سفارش پیدا نشد.");
  }

  if (order.userId !== user.userId) {
    throw new Error("دسترسی ندارید.");
  }

  if (order.status !== "SUBMITTED") {
    throw new Error(
      "فقط سفارش ثبت‌ نهایی‌ شده قابل لغو است."
    );
  }

  if (
    order.campaign.status !== "ACTIVE"
  ) {

    throw new Error(
      "امکان لغو سفارش در این مرحله وجود ندارد."
    );

  }

  await prisma.$transaction(async (tx) => {

    // برگرداندن تعداد محصولات
    for (const item of order.orderItems) {

      const updated =
        await tx.campaignProduct.update({

          where: {
            campaignProductId:
              item.campaignProductId,
          },

          data: {

            currentQuantity: {

              decrement:
                item.quantity,

            },

          },

        });

      await tx.campaignProduct.update({

        where: {
          campaignProductId:
            updated.campaignProductId,
        },

        data: {

          status:
            updated.currentQuantity >=
            updated.thresholdQuantity

              ? "THRESHOLD_REACHED"

              : "OPEN",

        },

      });

    }

    // حذف پیش فاکتور اولیه
    await tx.invoice.deleteMany({

      where: {

        userOrderId:
          order.userOrderId,

      },

    });

    // حذف آیتم‌های سفارش
    await tx.orderItem.deleteMany({

      where: {

        userOrderId:
          order.userOrderId,

      },

    });

    // حذف سفارش
    await tx.userOrder.delete({

      where: {

        userOrderId:
          order.userOrderId,

      },

    });

  });

  return {

    success: true,

    message:
      "سفارش با موفقیت لغو شد.",

  };

};

export const getOrderPreview = async (
  user,
  campaignId
) => {
  const order = await prisma.userOrder.findFirst({
    where: {
      userId: user.userId,
      campaignId: Number(campaignId),
      status: "CART",
    },
    include: {
      orderItems: {
        include: {
          campaignProduct: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("سبد خرید خالی است");
  }

const invoice =
calculateInvoice(order);

return invoice;



 
};