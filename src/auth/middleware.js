const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {  
  if(req.headers.authorization == null || req.headers.authorization.split(' ')[0] != "Bearer") {
    return res.status(403).json({
      status: 'Failed', 
      message: 'Unauthorized'
    })
  }

  const token = req.headers.authorization.split(' ')[1]

  try {
    const decodedClaims = await admin.auth().verifyIdToken(token, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    res.status(403).json({ status: 'Failed', message: 'Unauthorized' });
  }
};

module.exports = { verifyToken};

  