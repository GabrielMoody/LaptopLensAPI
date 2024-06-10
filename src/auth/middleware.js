const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {  
  if(req.headers.authorization == null) {
    return res.status(403).json({
      error: "Unauthorized"
    })
  }

  const token = req.headers.authorization.split(' ')[1]

  try {
    const decodedClaims = await admin.auth().verifyIdToken(token, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized', msg: sessionCookie });
  }
};

module.exports = { verifyToken};

  