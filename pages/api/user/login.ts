// Middleware
import connectDB from "../../../middlewares/mongo";
// Model
import User from "../../../models/User";
// Utils
import { generateToken } from "../../../utils";
import bcrypt from 'bcryptjs';
// Types
import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "../../../types";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user: UserType | null = await User.findOne({ email: req.body.email });
        if (!user) return res.json({ code: 0, message: 'User not found' });

        const match: boolean = await bcrypt.compare(req.body.password, user.password as string);
        if (!match) return res.json({ code: 0, message: 'Wrong username or password' });

        const token = generateToken(user);
        res.json({
            _id: user._id,
            token,
            code: 1,
            message: ''
        });
    }
    catch (err: any) {
        throw new Error(err)
    }
};

export default connectDB(handler);