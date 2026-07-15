import * as service from "../services/campaignProduct.service.js";


// افزودن محصول به کمپین
export const addProductToCampaign = async (req, res) => {
  try {
    const result = await service.addProductToCampaign(
      req.params.campaignId,
      req.user,
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



// دریافت محصولات کمپین
export const getCampaignProducts = async (req, res) => {
  try {
    const result = await service.getCampaignProducts(
      Number(req.params.campaignId),
      req.user
    );

    res.json({
      success: true,
      products: result,
    });

  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};



// ویرایش محصول کمپین
export const updateCampaignProduct = async (req, res) => {
  try {

    const result = await service.updateCampaignProduct(
      req.params.campaignId,
      req.params.campaignProductId,
      req.user,
      req.body
    );


    res.json(result);


  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};



// حذف محصول کمپین
export const deleteCampaignProduct = async (req, res) => {
  try {

    const result = await service.deleteCampaignProduct(
      req.params.campaignId,
      req.params.campaignProductId,
      req.user
    );


    res.json(result);


  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};