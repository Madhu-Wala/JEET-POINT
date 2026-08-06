const { admin ,getFirestore} = require('../config/firebaseAdmin');

// verifyToken middleware: sets req.user = decoded token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const firestore = getFirestore();

    const userDoc=await firestore.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }


    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: userDoc.data().role,
    };

    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

function verifyRole(...allowedRoles) {
  return (req,res,next)=>{
    if(!allowedRoles.includes(req.user.role)){
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  verifyRole,
};
