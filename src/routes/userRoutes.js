const express = require("express")
const {getUsers, Register, Login, forgotPassword, Logout} = require("../controller/authController")
const verifyToken = require("../../middleware/verifyToken.js")
const refreshToken = require("../../middleware/refreshToken.js")
const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.delete('/logout', Logout);

module.exports = router;
