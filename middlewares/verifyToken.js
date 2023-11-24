const jwt = require('jsonwebtoken');

  // verify the token whether it is valid or not
const verifyToken = async (req, res, next) => {
    const {authorization} = req.body;
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
         if(err){
           next(err)
         }else {
          req.decoded = decoded;
          next();
         }
        });
}

module.exports = verifyToken;