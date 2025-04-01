// const jwt = require("jsonwebtoken");
// const prisma = require("../models");
// const createError = require("../utils/createError");

// module.exports = async(req,res,next) => {
//     try {
        
//         const authorization = req.headers.authorization
//         if(!authorization || !authorization.startsWith('Bearer ')){
//             createError(401, "Unauthorized 1")
//         }

//         const token = authorization.split(' ')[1]
//         console.log(token)
//         if(!token) {
//             createError(401, "Unauthorized 2")
//         }

//         const payload = jwt.verify(token, process.env.JWT_SECRET)

//         const foundUser = await prisma.users.findUnique({
//             where: { id : payload.id}
//         })
//         if(!foundUser) {
//             createError(401, "Unauthorized 3")
//         }

//         const {password, createdAt, ...userData} = foundUser
//         console.log(userData)

//         res.users = userData



//     } catch (error) {
//         next(error)
//     }
// }

const jwt = require("jsonwebtoken");
const prisma = require("../models");
const createError = require("../utils/createError");

exports.authCheck = async (req, res, next) => {
  try {
    // รับ header จาก client
    const authorization = req.headers.authorization;
    
    // ตรวจสอบ format ของ authorization
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError(401, "Unauthorized: Invalid token format"));
    }
    
    // แยก token
    const token = authorization.split(" ")[1];
    if (!token) {
      return next(createError(401, "Unauthorized: Token is required"));
    }
    
    // ตรวจสอบ token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // ตรวจสอบว่าผู้ใช้ยังมีอยู่ในระบบ
    const foundUser = await prisma.users.findUnique({
      where: { id: payload.id }
    });
    
    if (!foundUser) {
      return next(createError(401, "Unauthorized: User not found"));
    }
    
    // กรองข้อมูลที่สำคัญออก
    const { password, ...userData } = foundUser;
    
    // เก็บข้อมูลผู้ใช้ใน req เพื่อใช้ใน middleware ถัดไป
    req.users = userData;
    
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Unauthorized: Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Unauthorized: Token expired"));
    }
    next(error);
  }
};

// Middleware ตรวจสอบ Token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    console.log('ข้อมูลผู้ใช้ที่ยืนยันตัวตน:', decoded);
    
    next();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์:', error);
    return res.status(403).json({ 
      message: 'token ไม่ถูกต้องหรือหมดอายุ' 
    });
  }
};


exports.isAdmin = (req, res, next) => {
  // ตรวจสอบว่า req.user มีค่าหรือไม่
  if (!req.user) {
    return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อน' });
  }
  
  // ตรวจสอบว่าเป็น ADMIN หรือไม่
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึง' });
  }
  
  next();
};