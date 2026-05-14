const express = require('express')
const {createInvestor, getInvestor, getInvestorHoldings, getInvestorNetworth} = require('../controller/investorController')
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()


router.post('/', authMiddleware, createInvestor);

router.get('/me', authMiddleware, getInvestor);
router.get('/holdings', authMiddleware, getInvestorHoldings);
router.get('/networth', authMiddleware, getInvestorNetworth);


module.exports = router