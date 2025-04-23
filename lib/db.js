import mongoose from 'mongoose';


const MONGO_URI = 'mongodb+srv://MIKE:MIKE199414@cluster0.23l02.mongodb.net/Virtual-Health?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI not found in .env');
}

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
