const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const {
    validateWithZod,
    registerSchema,
    loginSchema
} = require("../middlewares/validators");
const { authCheck } = require("../middlewares/authenticate");

router.post("/register", validateWithZod(registerSchema), authControllers.register);
router.post("/login", validateWithZod(loginSchema),authControllers.login);
router.get("/me", authCheck, authControllers.getMe);

module.exports = router;