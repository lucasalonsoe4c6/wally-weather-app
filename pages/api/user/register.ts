// Middleware
import connectDB from "../../../middlewares/mongo";
// Model
import User from "../../../models/User";
// Utils
import { generateToken, validateEmail, validatePassword } from "../../../utils";
import bcrypt from 'bcryptjs';
// Types
import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "../../../types";
// Const
import { emailRegex } from "../../../const/const";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Form validation
        const emailValidation = validateEmail(req.body.email);
        if (emailValidation.code === 0) return res.json(emailValidation);

        const passwordValidation = validatePassword(req.body.password);
        if (passwordValidation.code === 0) return res.json(passwordValidation);

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