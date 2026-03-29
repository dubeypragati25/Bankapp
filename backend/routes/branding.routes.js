const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const brandingSchema = require("../model/branding.model");

//const multer = require("multer");

// storage config (optional but better)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

//const upload = multer({ storage: storage });

router.get("/",(req, res) => {
  controller.getData(req, res, brandingSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, brandingSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, brandingSchema);
});

module.exports = router;