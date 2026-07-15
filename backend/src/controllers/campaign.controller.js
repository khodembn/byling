import * as campaignService from "../services/campaign.service.js";







export const createCampaign = async (req, res) => {




  try {
    const result = await campaignService.createCampaign(
      req.user,
      req.body
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCampaignController = async (
  req,
  res
) => {

  try {

    const result =
      await campaignService.updateCampaign(
        req.user,
        req.params.campaignId,
        req.body
      );


    res.json({

      success: true,

      data: result

    });


  }
  catch (err) {

    res.status(400).json({

      success: false,

      message: err.message

    });

  }

};


export const deleteCampaignController = async (
  req,
  res
) => {

  try {

    const result =
      await campaignService.deleteCampaign(
        req.user,
        req.params.campaignId
      );


    res.json({

      success: true,

      data: result

    });


  }
  catch (err) {

    res.status(400).json({

      success: false,

      message: err.message

    });

  }

};

export const getAllCampaigns = async (req, res) => {
  try {
    const result = await campaignService.getAllCampaigns();

    res.json({
      success: true,
      campaigns: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const result = await campaignService.getCampaignById(
      Number(req.params.id),
      req.user
    );

    res.json({
      success: true,
      campaign: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResidentCampaigns = async (req, res) => {
  try {
    const result = await campaignService.getResidentCampaigns(req.user.userId);

    res.json({
      success: true,
      campaigns: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyCampaigns = async (req, res) => {
  try {
    const result =
      await campaignService.getMyCampaigns(
        req.user
      );

    res.json({
      success: true,
      campaigns: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestPayment = async (
  req,
  res
) => {

  try {

    const result =
      await campaignService.requestPayment(

        req.user,

        Number(req.params.campaignId),

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

/*export const updatePaymentInfo =
  async (req, res, next) => {

    try {

      const campaign =
        await campaignService.updatePaymentInfo(

          req.params.campaignId,

          req.user,

          req.body

        );

      res.status(200).json({

        success: true,

        message:
          "اطلاعات پرداخت ذخیره شد.",

        data: campaign,

      });

    }

    catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }

  };*/





export const cancelUnpaidOrders = async (
  req,
  res
) => {

  try {

    const result =
      await campaignService.cancelUnpaidOrders(

        req.user,

        req.params.campaignId

      );

    res.json(result);

  } catch (err) {

    res.status(400).json({

      success: false,

      message: err.message,

    });

  }

};

export const reopenCampaign = async (
  req,
  res
) => {

  try {

    const { paymentDeadline, message } = req.body;

    const result =
      await campaignService.reopenCampaign(

        req.user,

        req.params.campaignId,

        paymentDeadline,

        message

      );

    res.json(result);

  } catch (err) {

    res.status(400).json({

      success: false,

      message: err.message,

    });

  }

};
export const checkPurchasingController =
  async (req, res) => {

    try {

      const result =
        await campaignService.checkPurchasing(

          req.user,

          req.params.campaignId

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

export const startPurchasing = async (
  req,
  res,
  next
) => {
  try {

    const result =
      await campaignService.startPurchasing(

        req.user,

        req.params.campaignId,

        req.body.message

      );

    res.json(result);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
export const readyForDelivery = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await campaignService.readyForDelivery(

        req.user,

        req.params.campaignId,

        req.body.message

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


export const completeCampaign = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await campaignService.completeCampaign(

        req.user,

        req.params.campaignId,

        req.body.message

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



