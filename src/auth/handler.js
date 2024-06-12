// const admin = require("firebase-admin");
const axios = require("axios");
require('dotenv').config();

const admin = require("../firestore-admin-app")

// const serviceAccount = require("../../laptoplens-firebase-adminsdk-5s93b-1d0087b01e.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const db = admin.firestore();

const postSignUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ 
        status: "Failed",
        message: "Passwords do not match" 
      });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: false,
      disabled: false,
    });

    await db.collection('users').doc(userRecord.uid).set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "User created successfully", userRecord });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ 
        status: "Failed",
        message: "Email already used" });
    } else {
      res.status(400).json({ 
        status: "Failed",
        message: error.message });
    }
  }
};

const postLogIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(process.env.KEY_PASSWORD, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    const { idToken, refreshToken } = response.data;

    await admin.auth().verifyIdToken(idToken);

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const options = { maxAge: expiresIn, httpOnly: true, secure: true };
    res.cookie("session", sessionCookie, options);
    res.setHeader('Authorization', `Bearer ${idToken}`);
    res.json({ status: "success", message: "Login successful", refreshToken: refreshToken });
  } catch (error) {
    res.status(401).json({ 
      status: "Failed",
      message: "Email or Password Incorrect" });
  }
};

const refreshToken = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
  
    if (!authorizationHeader) {
      return res.status(401).json({ 
        status: "Failed",
        message: 'Authorization header is missing' });
    }
  
    const bearerToken = authorizationHeader.split(' ')[1];
  
    if (!bearerToken) {
      return res.status(401).json({ 
        status: "Failed",
        message: 'Bearer token is missing' });
    }
  
    try {
      const response = await axios.post(process.env.SECURE_TOKEN, {
        grant_type: "refresh_token",
        refresh_token: bearerToken
      });
  
      const { id_token, refresh_token } = response.data;
  
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await admin.auth().createSessionCookie(id_token, { expiresIn });
  
      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
      res.cookie("session", sessionCookie, options);
      res.json({ status: "success", idToken: id_token, refreshToken: refresh_token });
    } catch (error) {
      res.status(401).json({ 
        status: "Failed",
        message: "Invalid refresh token" });
    }
  };


const postLogOut = (req, res) => {
  res.clearCookie("session");
  res.removeHeader("Authorization");
  res.json({ status: "success", message: "Logout successful" });
};

module.exports = { postSignUp, postLogIn, refreshToken, postLogOut };
