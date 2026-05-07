const express = require('express')
const {createInvestor, getInvestor, getInvestorHoldings, getInvestorNetworth} = require('../controller/investorController')

const router = express.Router()


router.post('/', createInvestor)
router.get('/:investorId', getInvestor)
router.get('/:investorId/holdings', getInvestorHoldings)
router.get('/:investorId/networth', getInvestorNetworth)



module.exports = router