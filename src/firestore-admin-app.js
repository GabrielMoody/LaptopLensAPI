const admin = require("firebase-admin");
const serviceAccount = require("../laptoplens-firebase-adminsdk-5s93b-1d0087b01e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin