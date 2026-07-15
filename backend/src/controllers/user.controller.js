import * as userService from "../services/user.service.js";




export const updateProfile = async (
  req,
  res
) => {


  try {


    const data =
      await userService.updateUserProfile(
        req.user,
        req.body
      );



    res.json({

      success: true,

      message:
        "اطلاعات با موفقیت بروزرسانی شد.",

      data

    });



  } catch (error) {


    res.status(400).json({

      success: false,

      message: error.message

    });


  }

};


export const transferManagerController =
  async (req, res) => {

    try {

      const result =
        await transferManager(

          req.user,

          req.body.newManagerUserId

        );

      res.json(result);

    } catch (err) {

      res.status(400).json({

        success: false,

        message: err.message

      });

    }

  }





export const getProfile = async (req, res) => {

  try {


    const data =
      await userService.getUserProfile(
        req.user
      );



    res.json({

      success: true,

      data

    });



  } catch (error) {


    res.status(400).json({

      success: false,

      message: error.message

    });


  }

};

export const getResidentsController =
  async (req, res) => {

    try {

      const result =
        await userService.getResidents(
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

export const deleteAccountController =
  async (req, res) => {

    try {

      const result =
        await userService.deleteAccount(
          req.user
        );

      res.json(result);

    } catch (err) {

      res.status(400).json({

        success: false,

        message: err.message

      });

    }

  }



export const getManagerPaymentInfo = async (
  req, res
) => {

  try {


    const data =
      await userService.getManagerPaymentInfo(
        req.user
      );


    res.json({

      success: true,

      data

    });


  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }


};


export const updateManagerPaymentInfo = async (
  req, res
) => {

  try {


    const data =
      await userService.updateManagerPaymentInfo(
        req.user,
        req.body
      );


    res.json({

      success: true,

      data

    });


  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }


};