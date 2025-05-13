
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

export { connectDB };

