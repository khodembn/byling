import prisma from "../prisma/prisma.js";
import { createNotification } from "./notification.service.js";

export const transferManager = async (
  user,
  newManagerUserId
) => {

  // مدیر فعلی
  const currentManager =
    await prisma.user.findUnique({

      where: {
        userId: user.userId,
      },

    });

  if (!currentManager) {
    throw new Error("کاربر پیدا نشد.");
  }

  if (
    currentManager.role !==
    "PURCHASE_MANAGER"
  ) {

    throw new Error(
      "شما مسئول خرید نیستید."
    );

  }

  // بررسی کمپین فعال
  const activeCampaign =
    await prisma.campaign.findFirst({

      where: {

        managerUserId:
          currentManager.userId,

        status: {

          in: [

            "ACTIVE",

            "AWAITING_PAYMENT",

            "PURCHASING",

            "READY_FOR_DELIVERY",

          ],

        },

      },

    });

  if (activeCampaign) {

    throw new Error(

      "ابتدا کمپین‌های فعال خود را تعیین تکلیف کنید."

    );

  }

  // مدیر جدید
  const newManager =
    await prisma.user.findUnique({

      where: {

        userId:
          Number(newManagerUserId),

      },

    });

  if (!newManager) {

    throw new Error(
      "کاربر موردنظر پیدا نشد."
    );

  }

  if (
    newManager.role !==
    "RESIDENT"
  ) {

    throw new Error(
      "این کاربر قبلاً مسئول خرید است."
    );

  }

  if (
    newManager.buildingId !==
    currentManager.buildingId
  ) {

    throw new Error(
      "کاربر باید عضو همین ساختمان باشد."
    );

  }

  await prisma.$transaction(

    async (tx) => {

      // مدیر فعلی
      await tx.user.update({

        where: {

          userId:
            currentManager.userId,

        },

        data: {

          role:
            "RESIDENT",

        },

      });

      // مدیر جدید
      await tx.user.update({

        where: {

          userId:
            newManager.userId,

        },

        data: {

          role:
            "PURCHASE_MANAGER",

        },

      });

    }

  );

  // نوتیف مدیر قبلی
  await createNotification({

    userId:
      currentManager.userId,

    title:
      "انتقال مسئول خرید",

    message:
      "مسئول خرید ساختمان با موفقیت به کاربر دیگری منتقل شد.",

    type:
      "GENERAL",

  });

  // نوتیف مدیر جدید
  await createNotification({

    userId:
      newManager.userId,

    title:
      "مسئول خرید جدید",

    message:
      "شما به عنوان مسئول خرید ساختمان انتخاب شدید.",

    type:
      "GENERAL",

  });

  return {

    success: true,

    message:
      "مسئول خرید با موفقیت منتقل شد.",

  };

};

export const getResidents = async (user) => {

  const currentUser =
    await prisma.user.findUnique({

      where: {
        userId: user.userId,
      },

    });

  if (!currentUser) {
    throw new Error("کاربر پیدا نشد.");
  }

  if (
    currentUser.role !==
    "PURCHASE_MANAGER"
  ) {

    throw new Error(
      "دسترسی ندارید."
    );

  }

  return await prisma.user.findMany({

    where: {

      buildingId:
        currentUser.buildingId,

      role: "RESIDENT",

    },

    select: {

      userId: true,

      fullName: true,

      floorNumber: true,

      unitNumber: true,

      mobile: true,

    },

    orderBy: {

      fullName: "asc",

    },

  });

};


export const deleteAccount = async (
  user
) => {

  const dbUser =
    await prisma.user.findUnique({

      where: {

        userId:user.userId

      }

    });

  if(!dbUser){

    throw new Error(
      "کاربر پیدا نشد."
    );

  }

  if(
    dbUser.role==="PURCHASE_MANAGER"
  ){

    throw new Error(

      "ابتدا مسئول خرید ساختمان را به کاربر دیگری منتقل کنید."

    );

  }

  const activeOrders =
    await prisma.userOrder.findFirst({

      where:{

        userId:dbUser.userId,

        status:{

          in:[
            "CART",
            "SUBMITTED",
            "PAID"
          ]

        }

      }

    });

  if(activeOrders){

    throw new Error(

      "ابتدا سفارش‌های فعال خود را تعیین تکلیف کنید."

    );

  }

  await prisma.user.update({

    where:{

      userId:dbUser.userId

    },

    data:{

      isDeleted:true,

      deletedAt:new Date()

    }

  });

  return{

    success:true,

    message:"حساب کاربری با موفقیت حذف شد."

  };

};