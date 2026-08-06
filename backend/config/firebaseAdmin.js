const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

function initializeFirebase() {
  // load serviceAccountKey.json from project root
  // const serviceAccountPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');
  // const serviceAccount = require(serviceAccountPath);

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('Initialized Firebase Admin');
}

function getFirestore() {
  return admin.firestore();
}
module.exports = {
  initializeFirebase,
  getFirestore,
  admin,
};
