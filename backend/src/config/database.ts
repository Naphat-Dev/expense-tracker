import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log('MongoDB connected');
    console.log("DB:", mongoose.connection.name);
};  
