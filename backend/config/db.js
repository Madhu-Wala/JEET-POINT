const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db = null;

async function connectDB() {
  try {
    if (!client.isConnected && !client.topology) {
      await client.connect();
    }
    db = client.db('JEETPoint');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
}

module.exports = {
  connectDB,
  getDB,
  client,
};
