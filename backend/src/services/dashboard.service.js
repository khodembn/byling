import prisma from "../prisma/prisma.js";

export const getResidentDashboard = async (user) => {

  // اطلاعات کاربر
  const profile = await prisma.user.findUnique({

    where: {

      userId: user.userId,

    },

    include: {

      building: true,

    },

  });

  if (!profile) {
    throw new Error("کاربر پیدا نشد.");
  }

  // تعداد سفارش‌ها
  const orders = await prisma.userOrder.groupBy({

    by: ["status"],

    where: {

      userId: user.userId,

    },

    _count: true,

  });

  const orderSummary = {

    cart: 0,

    submitted: 0,

    paid: 0,

    ready: 0,

    delivered: 0,

  };

  orders.forEach((o) => {

    switch (o.status) {

      case "CART":
        orderSummary.cart = o._count;
        break;

      case "SUBMITTED":
        orderSummary.submitted = o._count;
        break;

      case "PAID":
        orderSummary.paid = o._count;
        break;

      case "READY_FOR_DELIVERY":
        orderSummary.ready = o._count;
        break;

      case "DELIVERED":
        orderSummary.delivered = o._count;
        break;

    }

  });

  // کمپین فعال
  const activeCampaign =
    await prisma.campaign.findFirst({

      where: {

        buildingId: profile.buildingId,

        status: {

          in: [
            "ACTIVE",
            "AWAITING_PAYMENT",
            "PURCHASING",
          ],

        },

      },

      select: {

        campaignId: true,

        title: true,

        status: true,

        paymentDeadline: true,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  // آخرین پیش‌فاکتور پرداخت‌نشده
  const pendingInvoice =
    await prisma.invoice.findFirst({

      where: {

        invoiceType: "INITIAL",

        userOrder: {

          userId: user.userId,

          status: "SUBMITTED",

        },

      },

      select: {

        invoiceId: true,

        finalAmount: true,

      },

      orderBy: {

        invoiceId: "desc",

      },

    });

  // سه اعلان آخر
  const notifications =
    await prisma.notification.findMany({

      where: {

        userId: user.userId,

      },

      take: 3,

      orderBy: {

        createdAt: "desc",

      },

      select: {

        notificationId: true,

        title: true,

        message: true,

        isRead: true,

        createdAt: true,

      },

    });



  return {

    profile: {

      fullName: profile.fullName,

      buildingName:
        profile.building.buildingName,

      floorNumber:
        profile.floorNumber,

      unitNumber:
        profile.unitNumber,

    },

    orders: orderSummary,

    activeCampaign,

    pendingInvoice,

    notifications,

  };

};


export const getManagerDashboard = async (user) => {

  const manager =
    await prisma.user.findUnique({

      where: {

        userId: user.userId,

      },

      include: {

        building: true,

      },

    });

  if (!manager) {
    throw new Error("کاربر پیدا نشد.");
  }

  const [

    activeCampaign,

    residentCount,

    campaignCount,

    totalOrders,

    latestOrders,

    latestPayments,

    notifications,

    pendingPayments,

    readyForDelivery,

    completedCampaigns,

    purchasingCampaigns,

    activeCampaigns,

  ] = await Promise.all([
      // کمپین فعال
prisma.campaign.findFirst({

  where: {

    buildingId: manager.buildingId,

    status: {

      in: [

        "ACTIVE",

        "AWAITING_PAYMENT",

        "PURCHASING",

      ],

    },

  },

  orderBy: {

    createdAt: "desc",

  },

}),

// تعداد اعضا
prisma.user.count({

  where: {

    buildingId: manager.buildingId,

    role: "RESIDENT",

  },

}),

// تعداد کمپین‌ها
prisma.campaign.count({

  where: {

    buildingId: manager.buildingId,

  },

}),


// تعداد سفارش‌ها
prisma.userOrder.count({

  where: {

    campaign: {

      buildingId: manager.buildingId,

    },

  },

}),

// آخرین سفارش‌ها
prisma.userOrder.findMany({

  take: 5,

  orderBy: {

    createdAt: "desc",

  },

  where: {

    campaign: {

      buildingId: manager.buildingId,

    },

  },

  include: {

    user: {

      select: {

        userId: true,

        fullName: true,

      },

    },

    campaign: {

      select: {

        title: true,

      },

    },

    invoice: {

      select: {

        finalAmount: true,

      },

    },

  },

}),

// آخرین پرداخت‌ها
prisma.payment.findMany({

  take: 5,

  orderBy: {

    createdAt: "desc",

  },

  where: {

    userOrder: {

      campaign: {

        buildingId: manager.buildingId,

      },

    },

  },

  include: {

    userOrder: {

      include: {

        user: {

          select: {

            userId: true,

            fullName: true,

          },

        },

        campaign: {

          select: {

            title: true,

          },

        },

      },

    },

  },

}),

// اعلان‌ها
prisma.notification.findMany({

  where: {

    userId: manager.userId,

  },

  take: 3,

  orderBy: {

    createdAt: "desc",

  },

}),

// پرداخت‌های منتظر تایید
prisma.payment.count({

  where: {

    paymentStatus: "PENDING",

    userOrder: {

      campaign: {

        managerUserId: manager.userId,

      },

    },

  },

}),


// آماده تحویل
prisma.userOrder.count({

  where: {

    status: "READY_FOR_DELIVERY",

    campaign: {

      managerUserId: manager.userId,

    },

  },

}),

// کمپین‌های تکمیل شده
prisma.campaign.count({

  where: {

    buildingId: manager.buildingId,

    status: "COMPLETED",

  },

}),

// کمپین‌های در حال خرید
prisma.campaign.count({

  where: {

    buildingId: manager.buildingId,

    status: "PURCHASING",

  },

}),

// کمپین‌های فعال
prisma.campaign.count({

  where: {

    buildingId: manager.buildingId,

    status: {

      in: [

        "ACTIVE",

        "AWAITING_PAYMENT",

      ],

    },

  },

}),



   ]
 )


const formattedOrders =
  latestOrders.map((order) => ({

    userId:
      order.user.userId,

    fullName:
      order.user.fullName,

    campaignTitle:
      order.campaign.title,

    finalAmount:
      order.invoice?.finalAmount,

    status:
      order.status,

  }));

  const formattedPayments =
  latestPayments.map((payment) => ({

    userId:
      payment.userOrder.user.userId,

    fullName:
      payment.userOrder.user.fullName,

    campaignTitle:
      payment.userOrder.campaign.title,

    amount:
      payment.amount,

    paymentStatus:
      payment.paymentStatus,

  }));

  const buildingStatus = {

  activeResidents:
    residentCount,

  activeCampaigns,

  completedCampaigns,

  waitingPayments:
    pendingPayments,

  purchasingCampaigns,

  readyDeliveries:
    readyForDelivery,

};

const pendingActions = {

  pendingPayments,

  readyForDelivery,

  needStartPurchasing:
    activeCampaign?.status ===
    "AWAITING_PAYMENT",

};

const needAttention =

  pendingPayments > 0 ||

  readyForDelivery > 0 ||

  pendingActions.needStartPurchasing;

  

  const quickActions = {

  createCampaign: true, // همیشه برای مدیر فعاله

  checkPayments: pendingPayments > 0,

  startPurchasing: activeCampaign?.status === "AWAITING_PAYMENT",

  readyForDelivery: readyForDelivery > 0,

  deliverOrders: readyForDelivery > 0,

};

return {

  profile: {

    fullName: manager.fullName,

    buildingName: manager.building.buildingName,

  },

  buildingStatus,

  statistics: {

    residentCount,

    campaignCount,

    totalOrders,

  },

  pendingActions: {

    pendingPayments:

      pendingActions.pendingPayments,

    readyForDelivery:

      pendingActions.readyForDelivery,

    needStartPurchasing:

      pendingActions.needStartPurchasing,

    needAttention,

  },

  activeCampaign:

    activeCampaign

      ? {

          campaignId:

            activeCampaign.campaignId,

          title:

            activeCampaign.title,

          status:

            activeCampaign.status,

          paymentDeadline:

            activeCampaign.paymentDeadline,

        }

      : null,

  latestOrders:

    formattedOrders,

  latestPayments:

    formattedPayments,

  notifications:

    notifications.map(

      (notification) => ({

        notificationId:

          notification.notificationId,

        title:

          notification.title,

        message:

          notification.message,

        isRead:

          notification.isRead,

        createdAt:

          notification.createdAt,

      })

    ),

};

};

