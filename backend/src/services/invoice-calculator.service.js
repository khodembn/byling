


export const calculateInvoice = (order) => {

  let marketSubtotal = 0;
  let bulkSubtotal = 0;
  let totalShipping = 0;
  let totalSaving = 0;

  const items = order.orderItems.map((item) => {

    const marketUnitPrice = Number(
      item.campaignProduct.marketPriceSnapshot
    );

    const bulkUnitPrice = Number(
      item.unitPriceSnapshot
    );

    const marketTotal =
      marketUnitPrice * item.quantity;

    const bulkTotal =
      bulkUnitPrice * item.quantity;

    const saving =
      marketTotal - bulkTotal;

    const shippingPerUnit =
      item.campaignProduct.thresholdQuantity > 0
        ? Number(item.campaignProduct.shippingCost ?? 0) /
          item.campaignProduct.thresholdQuantity
        : 0;

    const shipping =
      Math.round(
        (shippingPerUnit * item.quantity) / 1000
      ) * 1000;

    marketSubtotal += marketTotal;
    bulkSubtotal += bulkTotal;
    totalShipping += shipping;
    totalSaving += saving;

    return {

      campaignProductId:
        item.campaignProductId,

      productName:
        item.campaignProduct.product.productName,

      quantity:
        item.quantity,

      marketUnitPrice,

      bulkUnitPrice,

      marketTotal,

      bulkTotal,

      shipping,

      saving,

    };

  });

  const managerCommission =
    bulkSubtotal * 0.02;

  const platformCommission =
    bulkSubtotal * 0.01;

  const payableAmount =
    bulkSubtotal +
    totalShipping +
    managerCommission +
    platformCommission;

  const finalDiscount =
    marketSubtotal -
    payableAmount;

  return {

    items,

    marketSubtotal,

    bulkSubtotal,

    totalShipping,

    totalSaving,

    managerCommission,

    platformCommission,

    payableAmount,

    finalDiscount,

  };

};