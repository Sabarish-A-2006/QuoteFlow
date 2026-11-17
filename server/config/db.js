import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri.trim() !== '') {
      console.log('🔄 Connecting to MongoDB via provided URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    }

    // Try connecting to default local MongoDB instance first
    try {
      console.log('🔄 Attempting connection to local MongoDB (mongodb://127.0.0.1:27017/quoteflow)...');
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/quoteflow', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.log('ℹ️ Local MongoDB not detected. Starting embedded MongoDB Memory Server for seamless dev...');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoMemoryServer started and connected: ${memUri}`);
      console.log('💡 Note: To use MongoDB Atlas, set MONGODB_URI in server/.env');
      return conn;
    }
  } catch (error) {
    console.error('❌ Critical MongoDB connection error:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('🔌 MongoDB disconnected cleanly');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
};
