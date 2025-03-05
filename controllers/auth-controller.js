const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body

    const checkEmail = await prisma.users.findFirst({
      where: {
        email,
      },
    })
    if (checkEmail) {
      return createError(400, "Email is already exits")
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    console.log(hashedPassword)

    const users = await prisma.users.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    })


    res.json({ message: "Register Success" });
  } catch (error) {
    console.log("Step 2 Catch");
    next(error)
  }
};

exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body
 
    const users = await prisma.users.findFirst({
      where: {
        email: email,
      },
    })
    if (!users) {
      return createError(400, "Email, Password is invalid!!")
    }

    const isMatch = bcrypt.compareSync(password, users.password)
    if(!isMatch) {
      return createError(400, "Email, Password is invalid")
    }

    const payload = {
      id: users.id,
      email: users.email,
      username: users.username,
      isAdmin: users.is_admin,
      role: users.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    console.log(token)

    res.json({ 
      message: "Login successful",
      payload: payload,
      token: token,
     })
  } catch (error) {
    next(error)
  }
}

module.exports.getMe = async(req, res) => {
  try {
    res.json({ 
      users: req.users,
      result: { role: req.users.role }
    });
  } catch (error) {
    next(error)
  }
};