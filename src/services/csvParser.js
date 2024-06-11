const fs = require('fs');
const csv = require('csv-parser');

function categorizePrice(price) {
  if (price <= 8000000) {
      return 'low';
  } else if (price > 8000000 && price <= 16000000) {
      return 'mid';
  } else if (price > 16000000) {
      return 'high';
  }
}

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        data.date = new Date(data.date)
        data.price = parseInt(data.price)
        data.sales = parseInt(data.sales)
        data.category = categorizePrice(data.price) 
        results.push(data)
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

module.exports = parseCSV;

