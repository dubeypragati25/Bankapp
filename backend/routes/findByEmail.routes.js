const express = require("express")
const router = express.Router();
const controller =  require("../controller/controller")
const customersSchema = require("../model/customers.model")

router.get("/", (req,res) =>{
    controller.findByEmail(req,res,customersSchema)
})
module.exports = router