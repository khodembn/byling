import * as userService from "../services/user.service.js";

export const transferManagerController =
async (req,res)=>{

    try{

        const result=
        await transferManager(

            req.user,

            req.body.newManagerUserId

        );

        res.json(result);

    }catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

}

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
async(req,res)=>{

  try{

    const result=
      await userService.deleteAccount(
        req.user
      );

    res.json(result);

  }catch(err){

    res.status(400).json({

      success:false,

      message:err.message

    });

  }

}