const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const { authenticateToken, isAdmin, authCheck } = require("../middlewares/authenticate");


router.get("/users",authCheck, userController.getAllUsers);
router.patch("/users/:id/role",authCheck, userController.updateRole);
router.delete("/users/:id",authCheck, userController.deleteUser)

router.get('/:id/events', authenticateToken, userController.getUserEvents);
// router.patch('/profile-image', authCheck, userController.updateProfileImage);
// router.get('/profile', authCheck, userController.getProfile);

module.exports = router;