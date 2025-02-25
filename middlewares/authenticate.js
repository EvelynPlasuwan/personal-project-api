const jwt = require("jsonwebtoken");
const prisma = require("../models");
const createError = require("../utils/createError");

module.exports = async(req,res,next) => {
    try {
        
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith('Bearer ')){
            createError(401, "Unauthorized 1")
        }

        const token = authorization.split(' ')[1]
        console.log(token)
        if(!token) {
            createError(401, "Unauthorized 2")
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = await prisma.users.findUnique({
            where: { id : payload.id}
        })
        if(!foundUser) {
            createError(401, "Unauthorized 3")
        }

        const {password, createdAt, ...userData} = foundUser
        console.log(userData)

        res.users = userData



    } catch (error) {
        next(error)
    }
}