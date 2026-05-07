const express = require('express')
const {createNewMutualFund, getAllMutualFunds, updateMutualFundNav} = require('../controller/fundController')

const router = express.Router()

router.post('/', createNewMutualFund)
router.get('/', getAllMutualFunds)
router.put('/:fundId/nav', updateMutualFundNav)






module.exports = router