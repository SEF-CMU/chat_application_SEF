import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectDb;
