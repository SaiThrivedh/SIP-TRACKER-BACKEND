const express = require('express')
const {createSIP, getSIP, getSIPTransactions, monthlySIPTransaction} = require('../controller/sipController')

const router = express.Router()


router.post('/', createSIP)
router.get('/:sipId', getSIP)
router.get('/:sipId/transactions', getSIPTransactions)
router.post('/:sipId/process', monthlySIPTransaction)







module.exports = router