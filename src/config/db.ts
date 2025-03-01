import mongoose from "mongoose";
import { MONGO_URI } from "../constants/environment";

export const ConnectDB = async () => {
    const mongoURI = MONGO_URI || 'mongodb://localhost:27017/ukinnect';

    // Connect to MongoDB
    mongoose.connect(mongoURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB Connection Error:', err));
};

export default ConnectDB;