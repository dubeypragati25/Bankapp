const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const usersSchema = require("../model/users.model");

const multer = require("multer");

// storage config (optional but better)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get("/",(req, res) => {
  controller.getData(req, res, usersSchema);
});

router.post("/", upload.single("xyz"), (req, res) => {
  controller.createData(req, res, usersSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, usersSchema);
});

router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, usersSchema);
});

module.exports = router;