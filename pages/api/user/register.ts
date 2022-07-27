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
        const email: UserType | null = await User.findOne({ email: req.body.email });
        if (email) return res.json({ code: 0, message: 'Email already registered' })

        const newUser: UserType = new User({
            email: req.body.email,
            password: req.body.password,
            cities: []
        });
        const salt: string = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);

        const users: UserType[] = await User.insertMany(newUser) as any;
        const token: string = generateToken(users[0]);

        res.json({
            _id: users[0]._id,
            token,
            code: 1,
            message: ''
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
};

export default connectDB(handler);