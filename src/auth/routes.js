const express = require("express");
const { getUsers, postSignUp, postLogIn, refreshToken, postLogOut } = require("./handler");

const router = express.Router();

router.post('/signUp', postSignUp);
router.post('/login', postLogIn);
router.get('/token', refreshToken);
router.post('/logout', postLogOut);

module.exports = router;