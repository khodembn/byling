import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
export const getManagerDashboard = async (user) => {

  // اطلاعات مدیر
  const manager = await prisma.user.findUnique({
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

    activeCampaign, residentCount, campaignCount, totalOrders, latestOrders, latestPayments, notifications, pendingPayments, readyForDelivery,

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

    // تعداد اعضای ساختمان
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

    // تعداد کل سفارش‌ها
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
            fullName: true,
          },
        },

        campaign: {
          select: {
            title: true,
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
            managerUserId: user.userId,
          },
        },
      },

      include: {
        userOrder: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    }),

    // سه اعلان آخر مدیر
    prisma.notification.findMany({
      where: {
        userId: user.userId,
      },

      take: 3,

      orderBy: {
        createdAt: "desc",
      },
    }),

    // تعداد پرداخت‌های منتظر تایید
    prisma.payment.count({
      where: {
        paymentStatus: "PENDING",

        userOrder: {
          campaign: {
            managerUserId: user.userId,
          },
        },
      },
    }),

    // تعداد سفارش‌های آماده تحویل
    prisma.userOrder.count({
      where: {
        status: "READY_FOR_DELIVERY",

        campaign: {
          managerUserId: user.userId,
        },
      },
    }),
  ]);

  const needAttention = pendingPayments > 0 ||
    readyForDelivery > 0 ||
    (
      activeCampaign &&
      activeCampaign.status ===
      "AWAITING_PAYMENT"
    );

  return {
    profile: {
      fullName: manager.fullName,

      buildingName: manager.building.buildingName,
    },

    statistics: {
      residentCount,

      campaignCount,

      totalOrders,
    },

    pendingActions: {
      pendingPayments,

      readyForDelivery,

      needStartPurchasing: activeCampaign?.status ===
        "AWAITING_PAYMENT",

      needAttention,
    },

    activeCampaign: activeCampaign
      ? {
        campaignId: activeCampaign.campaignId,

        title: activeCampaign.title,

        status: activeCampaign.status,

        paymentDeadline: activeCampaign.paymentDeadline,
      }
      : null,

    latestOrders,

    latestPayments,

    notifications,
  };

};
