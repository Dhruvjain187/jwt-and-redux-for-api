const express = require("express")
const router = express.Router();
const userController = require("../controller/userController")
const { protect } = require("../middleware/authMiddleware")

router.post("/", userController.registerUser)

router.post("/auth", userController.authUser)

router.post("/logout", userController.logoutUser)

router.route("/profile").get(protect, userController.getUserProfile)
    .put(protect, userController.updateUserProfile)


module.exports = router;