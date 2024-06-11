const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes');
const loadModel = require('../services/loadModel');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

(async () => {
  try {
      const model = await loadModel();
      app.set('model', model);

      app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      });
  } catch (error) {
      console.error('Failed to load model:', error);
  }
})();
