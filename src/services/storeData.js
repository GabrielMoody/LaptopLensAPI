// const {Firestore} = require('@google-cloud/firestore');
const admin = require("../firestore-admin-app")
// const serviceAccount = require("../../laptoplens-firebase-adminsdk-5s93b-1d0087b01e.json");
// const admin = require("firebase-admin");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

async function storeData(predictions) {
  const db = admin.firestore();
  const predictCollection = db.collection('predictions');
  const dataToStore = {
    result: predictions,
    date: new Date().toISOString()
  };
  
  return predictCollection.add(dataToStore);
}

module.exports = storeData;
