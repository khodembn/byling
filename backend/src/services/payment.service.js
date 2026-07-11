import prisma from "../prisma/prisma.js";
import { createNotification } from "./notification.service.js";
import { calculateInvoice } from "./invoice-calculator.service.js";

export const uploadReceipt = async (
  orderId,
  user,
  data,
  file
) => {

  const order = await prisma.userOrder.findFirst({

    where: {

      userOrderId: Number(orderId),

      userId: user.userId,

      status: "SUBMITTED",

    },

    include: {

      campaign: true,

      payment: true,

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

    throw new Error("سفارش پیدا نشد.");

  }

  if (order.campaign.status !== "AWAITING_PAYMENT") {

    throw new Error(
      "کمپین در وضعیت پرداخت نیست."
    );

  }

  if (!file) {

    throw new Error(
      "لطفاً تصویر فیش را بارگذاری کنید."
    );

  }

  if (!data.transactionRef) {

    throw new Error(
      "کد پیگیری الزامی است."
    );

  }

  const invoice = calculateInvoice(order);

  // اگر قبلاً پرداخت تایید شده باشد
  if (
    order.payment?.paymentStatus === "APPROVED"
  ) {

    throw new Error(
      "این پرداخت قبلاً تایید شده است."
    );

  }

  // اگر هنوز در انتظار بررسی باشد
  if (
    order.payment?.paymentStatus === "PENDING"
  ) {

    throw new Error(
      "این پرداخت هنوز در حال بررسی است."
    );

  }

  // اگر قبلاً پرداختی ثبت شده و رد شده باشد، بروزرسانی می‌شود
  if (order.payment) {

    const payment =
      await prisma.payment.update({

        where: {

          paymentId:
            order.payment.paymentId,

        },

        data: {

          amount:
            invoice.payableAmount,

          paymentStatus:
            "PENDING",

          transactionRef:
            data.transactionRef,

          receiptImage:
            file.path.replace(/\\/g, "/"),

          rejectReason: null,

          reviewedAt: null,

          paidAt: null,

        },

      });

    return {

      success: true,

      message:
        "فیش پرداخت مجدداً ثبت شد و در انتظار تایید مسئول خرید است.",

      payment,

    };

  }

  const payment =
    await prisma.payment.create({

      data: {

        amount:
          invoice.payableAmount,

        paymentStatus:
          "PENDING",

        transactionRef:
          data.transactionRef,

        receiptImage:
          file.path.replace(/\\/g, "/"),

        userOrderId:
          order.userOrderId,

      },

    });

  return {

    success: true,

    message:
      "پرداخت با موفقیت ثبت شد و در انتظار تایید مسئول خرید است.",

    payment,

  };


};


export const getPaymentPreview = async (
  user,
  campaignId
) => {

  const order = await prisma.userOrder.findFirst({

    where: {

      userId: user.userId,

      campaignId: Number(campaignId),

      status: "SUBMITTED",

    },

    include: {

      campaign: true,

      payment: true,

      invoice: true,

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

    throw new Error("سفارش پیدا نشد.");

  }

  if (!order.invoice) {

    throw new Error("پیش فاکتور پیدا نشد.");

  }

  if (
    order.campaign.status !== "AWAITING_PAYMENT"
  ) {

    throw new Error(
      "در حال حاضر امکان پرداخت وجود ندارد."
    );

  }

  return {

    campaign: {

      campaignId: order.campaign.campaignId,

      title: order.campaign.title,

      status: order.campaign.status,

    },

    payment: {

      payableAmount: Number(
        order.invoice.finalAmount
      ),

      paymentDeadline:
        order.campaign.paymentDeadline,

      paymentCardNumber:
        order.campaign.paymentCardNumber,

      paymentCardHolder:
        order.campaign.paymentCardHolder,

      paymentMessage:
        order.campaign.paymentMessage,

      paymentStatus:
        order.payment?.paymentStatus ??
        null,

    },

    invoice: {

      invoiceId:
        order.invoice.invoiceId,

      invoiceType:
        order.invoice.invoiceType,

      items: order.orderItems.map(item => ({

        campaignProductId:
          item.campaignProductId,

        productName:
          item.campaignProduct.product.productName,

        quantity:
          item.quantity,

        unitPrice:
          Number(item.unitPriceSnapshot),

        totalPrice:
          Number(item.unitPriceSnapshot) *
          item.quantity,

      })),

      productCost:
        Number(order.invoice.productCost),

      shippingCost:
        Number(order.invoice.shippingCost),

      commissionCost:
        Number(order.invoice.commissionCost),

      savingAmount:
        Number(order.invoice.savingAmount),

      finalAmount:
        Number(order.invoice.finalAmount),

    },

  };

};

export const getMyPayments = async (user) => {

  const payments = await prisma.payment.findMany({

    where: {

      userOrder: {

        userId: user.userId,

      },

    },

    include: {

      userOrder: {

        include: {

          campaign: {

            select: {

              title: true,

            },

          },

        },

      },

    },

    orderBy: {

      createdAt: "desc",

    },

  });

  return payments.map((payment) => ({

    paymentId: payment.paymentId,

    orderId: payment.userOrderId,

    campaignTitle: payment.userOrder.campaign.title,

    amount: Number(payment.amount),

    paymentStatus: payment.paymentStatus,

    rejectReason: payment.rejectReason,

    createdAt: payment.createdAt,

    receiptImage: payment.receiptImage,

  }));

};

export const getPendingPayments = async (user) => {

  const payments = await prisma.payment.findMany({

    where: {

      paymentStatus: "PENDING",

      userOrder: {

        campaign: {

          managerUserId: user.userId

        }

      }

    },

    include: {

      userOrder: {

        include: {

          user: true,

          campaign: true

        }

      }

    },

    orderBy: {

      createdAt: "desc"

    }

  });
  const count = payments.length;

  const result = payments.map(payment => ({

    paymentId: payment.paymentId,

    residentName:
      payment.userOrder.user.fullName,

    residentId:
      payment.userOrder.user.userId,

    campaignId:
      payment.userOrder.campaign.campaignId,

    campaignTitle:
      payment.userOrder.campaign.title,

    amount: Number(payment.amount),

    createdAt: payment.createdAt,

    paymentStatus:
      payment.paymentStatus

  }));

  return {

    count,

    payments: result

  };


}

export const approvePayment = async (
  paymentId,
  user
) => {
  const payment =
    await prisma.payment.findUnique({

      where: {
        paymentId: Number(paymentId)
      },

      include: {

        userOrder: {

          include: {

            user: true,

            campaign: true

          }

        }

      }

    });

  if (!payment) {

    throw new Error("پرداخت پیدا نشد.");

  }
  if (
    payment.userOrder.campaign.managerUserId
    !== user.userId
  ) {

    throw new Error(
      "دسترسی ندارید."
    );

  }

  if (
    payment.paymentStatus !== "PENDING"
  ) {

    throw new Error(
      "این پرداخت قبلاً بررسی شده است."
    );

  }

  await prisma.$transaction(
    async (tx) => {

      await tx.payment.update({

        where: {
          paymentId: payment.paymentId
        },

        data: {

          paymentStatus: "APPROVED",

          reviewedAt: new Date(),

          paidAt: new Date()

        }

      });

      await tx.userOrder.update({

        where: {
          userOrderId:
            payment.userOrder.userOrderId
        },

        data: {

          status: "PAID"

        }

      });

      await tx.notification.create({

        data: {

          userId:
            payment.userOrder.userId,

          title:
            "پرداخت تایید شد",

          message:
            "پرداخت شما تایید شد و سفارش وارد مرحله خرید شد.",

          type:
            "PAYMENT_APPROVED"

        }

      });
    });

  return {

    success: true,

    message:
      "پرداخت با موفقیت تایید شد."

  };
}

export const rejectPayment = async (
  paymentId,
  user,
  rejectReason
) => {

  if (!rejectReason?.trim()) {
    throw new Error("دلیل رد پرداخت الزامی است.");
  }

  const payment =
    await prisma.payment.findUnique({

      where: {
        paymentId: Number(paymentId),
      },

      include: {
        userOrder: {
          include: {
            user: true,
            campaign: true,
          },
        },
      },
    });

  if (!payment) {
    throw new Error("پرداخت پیدا نشد.");
  }

  if (
    payment.userOrder.campaign.managerUserId !==
    user.userId
  ) {
    throw new Error("دسترسی ندارید.");
  }

  if (
    payment.paymentStatus !== "PENDING"
  ) {
    throw new Error(
      "این پرداخت قبلاً بررسی شده است."
    );
  }

  await prisma.$transaction(async (tx) => {

    await tx.payment.update({

      where: {
        paymentId: payment.paymentId,
      },

      data: {

        paymentStatus: "REJECTED",

        reviewedAt: new Date(),

        rejectReason,

      },

    });

  });

  await createNotification({

    userId: payment.userOrder.userId,

    title: "پرداخت رد شد",

    message: `

پرداخت شما تایید نشد.

دلیل:

${rejectReason}

لطفاً پس از اصلاح، مجدداً فیش پرداخت را ارسال کنید.

`.trim(),

    type: "PAYMENT_REJECTED",

  });

  return {

    success: true,

    message: "پرداخت رد شد.",

  };

};
