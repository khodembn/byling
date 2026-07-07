import prisma from "../prisma/prisma.js";
import { calculateInvoice } from "./invoice-calculator.service.js";

export const createInitialInvoice = async (order) => {

  // اگر قبلاً Invoice ساخته شده بود
  const existingInvoice = await prisma.invoice.findUnique({
    where: {
      userOrderId: order.userOrderId,
    },
  });

  if (existingInvoice) {
    return existingInvoice;
  }

  const invoice = calculateInvoice(order);

  return await prisma.invoice.create({

    data: {

      productCost: invoice.bulkSubtotal,

      shippingCost: invoice.totalShipping,

      commissionCost:
        invoice.managerCommission +
        invoice.platformCommission,

      savingAmount:
        invoice.finalDiscount,

      finalAmount:
        invoice.payableAmount,

      invoiceType: "INITIAL",

      userOrderId:
        order.userOrderId,

    },

  });

};