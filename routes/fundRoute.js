const express = require("express");
const {
  createNewMutualFund,
  getAllMutualFunds,
  updateMutualFundNav,
} = require("../controller/fundController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, createNewMutualFund);


router.get("/", getAllMutualFunds);


router.put("/:fundId/nav", authMiddleware, updateMutualFundNav);

module.exports = router;