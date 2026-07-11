import * as service from "../services/order.service.js";


export const createOrUpdateOrder = async (req, res) => {
  try {
    const result = await service.createOrUpdateOrder(
      req.user,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "سفارش ثبت/آپدیت شد",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





export const getCart = async (req, res) => {
  try {

    const cart = await service.getCart(
      req.user.userId
    );


    res.json({
      success: true,
      data: cart,
    });


  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

export const getMyOrder = async (
  req,
  res
) => {
  try {
    const result =
      await service.getMyOrder(
        req.user,
        Number(req.params.campaignId)
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitOrder = async (
  req,
  res
) => {
  try {

    const result =
      await service.submitOrder(
        req.user,
        Number(req.params.orderId)
      );

    res.json(result);

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};
export const getMyOrdersController = async (
  req,
  res,
  next
) => {

  try {

    const orders =
      await service.getMyOrders(req.user);

    res.json({

      success: true,

      data: orders,

    });

  } catch (err) {

    res.status(400).json({

      success: false,

      message: err.message,

    });

  }

};


export const cancelSubmittedOrderController =
  async (req, res) => {

    try {

      const result =
        await service.cancelSubmittedOrder(

          req.user,

          req.params.orderId

        );

      res.json(result);

    } catch (err) {

      res.status(400).json({

        success: false,

        message: err.message,

      });

    }

  };


export const getOrderPreview = async (
  req,
  res
) => {
  try {
    const result =
      await service.getOrderPreview(
        req.user,
        Number(req.params.campaignId)
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};