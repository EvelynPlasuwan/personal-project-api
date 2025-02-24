const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET
module.exports = {
  sign: (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' }),
  verify: (token) => jwt.verify(token, SECRET_KEY)
}