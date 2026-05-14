const express = require('express')
const {createSIP, getSIP, getSIPTransactions, monthlySIPTransaction,getAllSIPTransactions} = require('../controller/sipController')
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router()


router.post('/', authMiddleware, createSIP);

router.get('/transactions', authMiddleware, getAllSIPTransactions);

router.get('/:sipId', authMiddleware, getSIP);

router.get('/:sipId/transactions', authMiddleware, getSIPTransactions);

router.post('/:sipId/process', authMiddleware, monthlySIPTransaction);






module.exports = router