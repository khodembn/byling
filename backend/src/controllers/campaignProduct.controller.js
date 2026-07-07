import * as service from "../services/campaignProduct.service.js";

export const addProductToCampaign = async (req, res) => {
  try {
    const result = await service.addProductToCampaign(
      req.params.campaignId,
      req.body
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/*export const updateShippingCost = async (
  req,
  res
) => {
  try {
    const result =
      await service.updateShippingCost(
        Number(req.params.id),
        req.body.shippingCost,
        req.user
      );

    res.json({
      success: true,
      message: "هزینه ارسال ثبت شد",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};*/




/*export const requestPayment = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await service.requestPayment(
        req.params.campaignProductId,
        req.user,
        req.body.message
      );

    res.json(result);

  }catch (err) {

  res.status(400).json({
    success: false,
    message: err.message,
  });

}

};*/
