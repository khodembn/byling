import * as dashboardService from "../services/dashboard.service.js";

export const getResidentDashboardController =
async (req, res) => {

  try {

    const result =
      await dashboardService.getResidentDashboard(
        req.user
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



export const getManagerDashboardController =
async (req, res) => {

  try {

    const result =
      await dashboardService.getManagerDashboard(
        req.user
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