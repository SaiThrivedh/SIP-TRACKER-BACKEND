const jwt = require('jsonwebtoken');


const secret = "kgjnelkjg4wjfmwajtrpolmfrtl34kbthoi;35ng"


function signJWT(payload){
    try{
        const token = jwt.sign(payload,secret,{
            expiresIn : '15m'
        })
        return token
    }
    
    catch(exception){
       console.log(exception)
       return undefined
    }

    
}


function verifyJWT(token){
    try {
        const payload = jwt.verify(token,secret)
        return payload   
    } 
    catch(exception){
       console.log(exception)
       return undefined
    }
    
}


module.exports ={
    signJWT,
    verifyJWT
}