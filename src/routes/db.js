
import mongoose from 'mongoose';

const mongoURL = `mongodb+srv://sergiofourmi:UUm780lYhSiqA5Ph@cluster0.dp3e9.mongodb.net/Cloen0005?retryWrites=true&w=majority&appName=ClusterCloen`;

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

