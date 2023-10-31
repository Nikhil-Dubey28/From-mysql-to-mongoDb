const jwt = require('jsonwebtoken')
const secretKey = process.env.TOKEN_SECRET_KEY

const authenticate = (req,res,next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({error:'no token provided'})
    }

    jwt.verify(token,secretKey,(err,decoded) => {
        if(err){
            return res.status(401).json({error: 'Invalid token'})
        }
      console.log('Decoded Token:', decoded);
        req.userId = decoded.userId
        next()
    })
}

module.exports = authenticate