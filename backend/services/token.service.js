require("dotenv").config();
const jwt = require("jsonwebtoken")

const verifyToken = async(req,res) =>{
    const token = req.headers.authorization.split(" ")[1]
    if(!token) {
        return {
            message : "There is no token !",
            isVerified : false
        }
    }
    try{
        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        return {
            message : "Token verified",
            isVerified : true,
            data : decoded
        }
    }catch(error) {
        return {
            message : "There is no token !",
            isVerified : false,
            error
        }
    }
}

module.exports = {verifyToken}