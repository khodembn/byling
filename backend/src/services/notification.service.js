import prisma from "../prisma/prisma.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      isRead: false,
    },
  });
};

export const getMyNotifications = async (user) => {
  return await prisma.notification.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markNotificationAsRead = async (
  notificationId,
  user
) => {

  const notification =
    await prisma.notification.findUnique({
      where: {
        notificationId: Number(notificationId),
      },
    });

  if (!notification) {
    throw new Error("نوتیفیکیشن پیدا نشد");
  }

  if (notification.userId !== user.userId) {
    throw new Error("دسترسی ندارید");
  }

  return await prisma.notification.update({
    where: {
      notificationId: Number(notificationId),
    },
    data: {
      isRead: true,
    },
  });
};