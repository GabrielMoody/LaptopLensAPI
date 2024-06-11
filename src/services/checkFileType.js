const checkFileType = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }
  
    const file = req.file;
    const mimeType = file.mimetype;
  
    if (mimeType !== 'text/csv') {
      return res.status(400).json({ status: 'fail', message: 'Only CSV files are allowed' });
    }
  
    next();
  };
  
  module.exports = checkFileType;
  