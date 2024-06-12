const tf = require('@tensorflow/tfjs-node');
// const dotenv = require('dotenv');

// dotenv.config();

async function loadModel() {
   try { 
    const modelUrls = [
        process.env.MODEL_URL_LOW,
        process.env.MODEL_URL_MID,
        process.env.MODEL_URL_HIGH
    ];
    const models = await Promise.all(modelUrls.map(url => tf.loadLayersModel(url)));
    return models;
} catch (error) {
    console.error('Failed to load model:', error);
    throw error; 
    }
}
module.exports = loadModel;
