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

const filterData = async (req, res, schema) => {
  try{
    const {fromDate, toDate, accountNo, branch}=req.body;
    const startDate = new Date(fromDate)
    const endDate = new Date(toDate)
    startDate.setHours(0,0,0,0)
    endDate.setHours(23,59,59,999)
    
    const query = {
      branch,
      createdAt :{
        $gte : startDate,
        $lte : endDate
      },
    } 

    if(accountNo && accountNo !== "") {
      query.accountNo = Number(accountNo)
    }

    const result = await schema.find(query)
    res.json(result)

  } catch(error) {
    res.status(500).json({
        message: "Internal server error",
        success: false,
        error
  })
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

const findByAccountNo = async(req,res,schema) =>{
  try{
    const query = req.body;
    const dbRes = await dbService.findOneRecord(query,schema)
    return res.status(200).json({
      message : "Record found !",
      data : dbRes
    })
  }catch(err) {
    return res.status(500).json({
      message : "Internal Server Error !"
    })
  }
}

const getTransactionSummary= async (req,res,schema) =>{
  const {branch, accountNo} = req.query
  let matchStage = {}
  if(branch) matchStage.branch = branch
  if(accountNo) matchStage.accountNo = Number(accountNo)
  try{
    const summary = await schema.aggregate([
      {
        $match : matchStage
      },
      {
        $group : {
          _id : null,
          totalCredit : {
            $sum : {
              $cond : [{$eq:["$transactionType","cr"]},"$transactionAmount",0]
            }
          },
          totalDebit : {
            $sum : {
              $cond : [{$eq:["$transactionType","dr"]},"$transactionAmount",0]
            }
          },
          creditCount : {
            $sum : {
              $cond : [{$eq:["$transactionType","cr"]},1,0]
            }
          },
          debitCount : {
            $sum : {
              $cond : [{$eq:["$transactionType","dr"]},1,0]
            }
          },
          totalTransactions : {$sum : 1}
        }
      },
      {
        $project : {
          _id : 0,
          totalCredit : 1,
          totalDebit : 1,
          totalTransactions : 1,
          creditCount : 1,
          debitCount : 1,
          balance : {$subtract : ["$totalCredit","$totalDebit"]}
        }
      }
    ])
    if(summary.length === 0) {
      return res.status(404).json({
      message : "No matching transactions found"
    })
    }
    res.status(200).json(summary[0])
  }catch(error) {
    res.status(500).json({
      message : "Error calculating summary", error
    })
  }
}

const getPaginatedTransactions = async (req,res,schema) => {
  try {
    const { accountNo, branch, page = 1, pageSize = 10 } = req.query;

    const filter = {};
    if (accountNo) filter.accountNo = Number(accountNo);
    if (branch) filter.branch = branch;

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [transactions, total] = await Promise.all([
      schema.find(filter)
        .sort({ createdAt: -1 }) // Optional: newest first
        .skip(skip)
        .limit(limit),
      schema.countDocuments(filter)
    ]);

    res.status(200).json({
      data: transactions,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};



module.exports = {
  createData,
  getData,
  updateData,
  deleteData,
  findByAccountNo,
  getTransactionSummary,
  getPaginatedTransactions,
  filterData
};