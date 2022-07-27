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
// Const
import { emailRegex } from "../../../const/const";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Form validation
        if (!req.body.email) return res.json({ code: 0, message: 'Please add an email' });
        if (!emailRegex.test(req.body.email)) return res.json({ code: 0, message: 'Please enter a valid email' });

        if (!req.body.password) return res.json({ code: 0, message: 'Please add a password' });
        if (req.body.password.length < 6) return res.json({ code: 0, message: 'Password too short' });
        if (req.body.password.length > 20) return res.json({ code: 0, message: 'Password too long' });

        // Check existing email
        const email: UserType | null = await User.findOne({ email: req.body.email });
        if (email) return res.json({ code: 0, message: 'Email already registered' });

        const newUser: UserType = new User({
            email: req.body.email,
            password: req.body.password,
            cities: []
        });

        // Hash password
        const salt: string = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);

        // Insert user in db
        const users: UserType[] = await User.insertMany(newUser) as any;
        
        // Generate jwt
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