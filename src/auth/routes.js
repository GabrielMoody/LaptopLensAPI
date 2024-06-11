const express = require("express");
const { getUsers, postSignUp, postLogIn, refreshToken, postLogOut } = require("./handler");
const { verifyToken } = require ("./middleware")

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/signUp', postSignUp);
router.post('/login', postLogIn);
router.get('/token', refreshToken);
router.post('/logout', postLogOut);

module.exports = router;