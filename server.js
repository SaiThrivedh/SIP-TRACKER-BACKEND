const express = require('express')
const app = express();

app.use(express.json());


app.get('/', (req,res) => {
    res.send("SIP-Tracker and Portfolio-Valuation-System")
})

app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/sips', require('./routes/sipRoute'))
app.use('/api/investors', require('./routes/investorRoute'))
app.use('/api/funds', require('./routes/fundRoute'))

app.listen(5000, ()=>{
    console.log("Server is running on port 5000")
})