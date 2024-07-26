import mongoose from "mongoose";
import {Response} from 'express';


const connectToMongo = async (res: Response) => {
    const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vdt2mpk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        // Handle specific error types
        if (err instanceof Error) {
            console.error('Error connecting to MongoDB:', err.message);
           return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Handle non-Error type errors
            console.error('Unknown error occurred:', err);
           return res.status(500).json({ error: 'Unknown Error' });
          }
    }
};

export default connectToMongo;

