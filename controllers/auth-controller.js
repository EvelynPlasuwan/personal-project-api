const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
    try {
      // code
      res.json({ message: "hello register " });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error!!" });
    }
  };

  exports.login = (req, res, next) => {
    try {
      res.json({ message: "hello login"})
    } catch (error) {
      next(error)
    }
  }