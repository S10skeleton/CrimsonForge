const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB!');
    await client.close();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

run();