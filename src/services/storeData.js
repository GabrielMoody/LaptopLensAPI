const {Firestore} = require('@google-cloud/firestore');

async function storeData(predictions) {
  const db = new Firestore();

  const predictCollection = db.collection('predictions');
  const dataToStore = {
    result: predictions,
    date: new Date().toISOString()
  };
  
  return predictCollection.add(dataToStore);
}

module.exports = storeData;
