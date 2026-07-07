import * as notificationService from "../services/notification.service.js";

export const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {

    const notifications =
      await notificationService.getMyNotifications(
        req.user
      );

    res.json({
      success: true,
      data: notifications,
    });

  }  catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const markNotificationAsRead = async (
  req,
  res,
  next
) => {
  try {

    const notification =
      await notificationService.markNotificationAsRead(
        req.params.notificationId,
        req.user
      );

    res.json({
      success: true,
      data: notification,
    });

  }  catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};