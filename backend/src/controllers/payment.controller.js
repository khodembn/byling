import * as paymentService from "../services/payment.service.js";

export const uploadReceipt = async (
  req,
  res
) => {

  try {

    const result =
      await paymentService.uploadReceipt(
        Number(req.params.orderId),
        req.user,
        req.body,
        req.file

      );

    res.json(result);

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};



export const getMyPayments = async (req, res, next) => {

  try {

    const payments = await paymentService.getMyPayments(req.user);

    res.status(200).json({

      success: true,

      data: payments,

    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }

};

export const getPaymentPreview =
  async (req, res, next) => {

    try {

      const data =
        await paymentService.getPaymentPreview(

          req.user,

          req.params.campaignId

        );

      res.status(200).json({

        success: true,

        data,

      });

    }

    catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }

  };

export const getPendingPayments = async (req, res, next) => {

  try {

    const result =
      await paymentService.getPendingPayments(req.user);

    res.json({

      success: true,

      ...result

    });

  }

  catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }

};


export const approvePayment =
  async (req, res, next) => {

    try {

      const result =
        await paymentService.approvePayment(

          req.params.paymentId,

          req.user

        );

      res.json(result);

    }

    catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }


  };

export const rejectPayment = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await paymentService.rejectPayment(

        req.params.paymentId,

        req.user,

        req.body.rejectReason

      );

    res.json(result);

  }
  catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }

};