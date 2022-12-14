import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

const connectDB = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
    // Use current db connection
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    // Use new db connection
    mongoose.connect(process.env.MONGO_URI as string, () => {
        return handler(req, res);
    });

};

export default connectDB;