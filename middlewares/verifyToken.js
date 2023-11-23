const jwt = require('jsonwebtoken');

  // verify the token whether it is valid or not
const verifyToken = async (req, res, next) => {
    const {authorization} = req.body;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.decoded = decoded;
        next();
    }
    catch {
      // when we will give inside next('somthing')
      // express will consider it as an error
      // this error will goes to our custom error handler
       console.log('token problem please see verifyToken catch block')
    }
}

module.exports = verifyToken;