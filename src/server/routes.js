const express = require('express');
const multer = require('multer');
const checkFileType = require('../services/checkFileType');
const { handlePrediction, handleGetLastPrediction } = require('./handler');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/predict', upload.single('file'), checkFileType, handlePrediction);
router.get('/last-prediction', handleGetLastPrediction);
    

module.exports = router;

