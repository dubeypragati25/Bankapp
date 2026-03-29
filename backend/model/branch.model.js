const mongo = require("mongoose");

const {Schema} = mongo;

const branchSchema = new Schema({
    branchName: {
        type: String,
        unique: true
    },
    
    key: String,
    branchAddress: String,
    
},{timestamps:true});

//mongoose ka middleware

module.exports = mongo.model("branch", branchSchema);