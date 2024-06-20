const express = require("express");
const { getUser, postSignUp, postLogIn, refreshToken, postLogOut } = require("./handler");
const {verifyToken} = require("./middleware")

const router = express.Router();

router.post('/signUp', postSignUp);
router.post('/login', postLogIn);
router.get('/token', refreshToken);
router.post('/logout', postLogOut);
router.get('/user', verifyToken, getUser);

module.exports = router;