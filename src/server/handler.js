const fs = require('fs');
const parseCSV = require('../services/csvParser');
const tf = require ('@tensorflow/tfjs-node')
const loadModel = require('../services/loadModel');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
// const admin = require("firebase-admin");
const admin = require("../firestore-admin-app")

// const serviceAccount = require("../../laptoplens-firebase-adminsdk-5s93b-1d0087b01e.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

async function handlePrediction(req, res) {
    try {
        const models = await loadModel();
        const data = await parseCSV(req.file.path);
        const predictions = await predictSales(data, models);
        
        await storeData(predictions);

        res.json(predictions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        fs.unlinkSync(req.file.path);
    }
}

async function predictSales(data, models) {
    const [modelLow, modelMid, modelHigh] = models;

    const newDataLow = data.filter(item => item.category === 'low');
    const newDataMid = data.filter(item => item.category === 'mid');
    const newDataHigh = data.filter(item => item.category === 'high');

    const predictedSalesLow = await predictNextWeekSales(newDataLow, modelLow);
    const predictedSalesMid = await predictNextWeekSales(newDataMid, modelMid);
    const predictedSalesHigh = await predictNextWeekSales(newDataHigh, modelHigh);

    const plotDataLow = preparePlotDataLast6Months(newDataLow, predictedSalesLow);
    const plotDataMid = preparePlotDataLast6Months(newDataMid, predictedSalesMid);
    const plotDataHigh = preparePlotDataLast6Months(newDataHigh, predictedSalesHigh);

    return {
        low: plotDataLow,
        mid: plotDataMid,
        high: plotDataHigh
    };
}

function preparePlotDataLast6Months(data, predictedSales) {
    data.forEach(item => item.date = new Date(item.date));
    const weeklySales = {};
    data.forEach(item => {
        const week = new Date(item.date);
        week.setDate(week.getDate() - week.getDay());
        const weekKey = week.toISOString().slice(0, 10);
        if (!weeklySales[weekKey]) {
            weeklySales[weekKey] = 0;
        }
        weeklySales[weekKey] += item.sales;
    });

    const sortedWeeks = Object.keys(weeklySales).sort();
    const last6MonthsWeeks = sortedWeeks.slice(-24);
    const last6MonthsSales = last6MonthsWeeks.map(week => ({
        date: new Date(week),
        sales: weeklySales[week]
    }));

    // Sum of predicted sales for the next week
    const predictedSum = predictedSales.reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const lastDate = last6MonthsSales[last6MonthsSales.length - 1].date;

    const nextWeekDate = new Date(lastDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    last6MonthsSales.push({
        date: nextWeekDate,
        sales: predictedSum
    });

    return last6MonthsSales;
}

async function predictNextWeekSales(data, model, windowSize = 12) {
    const weeklySalesData = [];
    let currentWeek = [];
    for (const item of data) {
        if (currentWeek.length < 7) {
            currentWeek.push(item.sales);
        } else {
            weeklySalesData.push(currentWeek.reduce((a, b) => a + b, 0));
            currentWeek = [item.sales];
        }
    }
    if (currentWeek.length > 0) {
        weeklySalesData.push(currentWeek.reduce((a, b) => a + b, 0));
    }

    let inputData;
    if (weeklySalesData.length < windowSize) {
        inputData = new Array(windowSize - weeklySalesData.length).fill(0).concat(weeklySalesData);
    } else {
        inputData = weeklySalesData.slice(-windowSize);
    }

    let inputTensor = tf.tensor(inputData, [1, windowSize, 1]);

    const inputMin = inputTensor.min();
    const inputMax = inputTensor.max();
    let scaledInput = inputTensor.sub(inputMin).div(inputMax.sub(inputMin)).mul(2).sub(1);

    const dailyPredictions = [];
    for (let i = 0; i < 7; i++) {
        const predictedSalesScaled = model.predict(scaledInput);
        const predictedSalesActual = predictedSalesScaled.add(1).div(2).mul(inputMax.sub(inputMin)).add(inputMin).arraySync()[0][0];
        dailyPredictions.push(predictedSalesActual);

        inputData = inputData.slice(1).concat(predictedSalesActual);
        const newInputTensor = tf.tensor(inputData, [1, windowSize, 1]);
        scaledInput.dispose();
        inputTensor.dispose();
        inputTensor = newInputTensor;
        scaledInput = inputTensor.sub(inputMin).div(inputMax.sub(inputMin)).mul(2).sub(1);
    }

    return dailyPredictions;
}

function convertTimestampToDate(timestamp) {
    if (timestamp && timestamp._seconds) {
        return new Date(timestamp._seconds * 1000);
    }
    return null;
}

async function getLastPrediction() {
    // const db = new Firestore();
    const db = admin.firestore();
    
    const snapshot = await db.collection('predictions').orderBy('date', 'desc').limit(1).get();
    if (snapshot.empty) {
      throw new Error('No predictions found');
    }
  
    let lastPrediction;
    snapshot.forEach(doc => {
      lastPrediction = doc.data();

      if (lastPrediction.result) {
        ['low', 'mid', 'high'].forEach(category => {
            if (lastPrediction.result[category]) {
                lastPrediction.result[category] = lastPrediction.result[category].map(entry => ({
                    ...entry,
                    date: convertTimestampToDate(entry.date)  // Konversi timestamp ke Date
                }));
            }
        });
    }
    });
  
    return lastPrediction;
  }
  
async function handleGetLastPrediction(req, res) {
    try {
      const lastPrediction = await getLastPrediction();
      res.status(200).json(lastPrediction);
    } catch (error) {
      res.status(500).json({ error: 'Error getting last prediction: ' + error.message });
    }
  }


module.exports = { handlePrediction, handleGetLastPrediction };
