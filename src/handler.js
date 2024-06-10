const admin = require("firebase-admin");
const axios = require("axios");
require('dotenv').config();

const serviceAccount = require("../secretAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getUsers = async (req, res) => {
  try {
    const userList = [];
    let listUsers = await admin.auth().listUsers();
    for (let userRecord of listUsers.users) {
      const user = await admin.auth().getUser(userRecord.uid);
      const userData = {
        id: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      userList.push(userData);
    }
    res.json(userList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const postSignUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
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
      res.status(400).json({ error: "Email already used" });
    } else {
      res.status(400).json({ error: error.message });
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
    res.json({ status: "success", message: "Login successful", refreshToken: refreshToken });
  } catch (error) {
    res.status(401).json({ error: "Email or Password Incorrect" });
  }
};

const refreshToken = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
  
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }
  
    const bearerToken = authorizationHeader.split(' ')[1];
  
    if (!bearerToken) {
      return res.status(401).json({ error: 'Bearer token is missing' });
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
      res.status(401).json({ error: "Invalid refresh token" });
    }
  };


const postLogOut = (req, res) => {
  res.clearCookie("session");
  res.json({ status: "success", message: "Logout successful" });
};

module.exports = { getUsers, postSignUp, postLogIn, refreshToken, postLogOut };
