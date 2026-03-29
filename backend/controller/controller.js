const dbService = require("../services/db.service");

const getData = async (req,res,schema) =>{
  try{
    const dbRes = await dbService.findAllRecord(schema)
    return res.status(200).json({
      message : "Record found !",
      data : dbRes
    })
  }catch(error) {
    res.status(500).json({
      message: "Internal server error",
      error
    })
  }
}

const createData = async (req, res, schema) => {
  try{
    const data=req.body;
    const dbRes=await dbService.createNewRecord(data,schema);
    res.status(200).json({
        message: "Data inserted successfully",
        success:true,
        data:dbRes
    })
  } catch(error) {
    if(error.code===11000){
        res.status(422).json({
        message: "Email already exists !",
        success: false,
        error
    })
    }
    else{
        res.status(500).json({
        message: "Internal server error",
        success: false,
        error
    })
    }
  }
}

const updateData = async (req,res,schema) =>{
  try{
    const {id} = req.params;
    const data= req.body;
    const dbRes = await dbService.updateRecord(id,data,schema);
    return res.status(200).json({
      message : "Record updated !",
      data : dbRes
    })
  }catch(error) {
    return res.status(500).json({
      message : "Internal server error !"
    })
  }
}

const deleteData = async (req,res,schema) =>{
  try{
    const {id} = req.params;
    const dbRes = await dbService.deleteRecord(id,schema);
    return res.status(200).json({
      message : "Record deleted !",
      data : dbRes
    });
  }catch(error) {
    return res.status(500).json({
      message : "Internal server error"
    });
  }
}




module.exports = {
  createData,
  getData,
  updateData,
  deleteData
};