// Middleware
import connectDB from "../../../middlewares/mongo";
// Model
import User from "../../../models/User";
// Utils
import { checkAuth } from "../../../utils";
// Types
import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "../../../types";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    checkAuth(req.body.token);
    
    // Get user favorite cities
    if (req.method === "GET") {
        try {
            const user: UserType | null = await User.findOne({ email: req.query.email });
            if (!user) return res.json({ code: 0, cities: [] });
            return res.json({
                code: 1,
                cities: user.cities
            });
        }
        catch (err: any) {
            throw new Error(err)
        }
    };

    // Add city to favorites
    if (req.method === "POST") {
        try {
            const user: UserType | null = await User.findOne({ email: req.body.email });
            if (!user) return res.json({ code: 0, message: "User not found" });
            if (user.cities.find(city => city === req.body.city)) return res.json({ code: 0, message: "City already saved" });
            await User.updateOne({ _id: user._id }, { cities: [...user.cities, req.body.city] })
            return res.json({
                code: 1,
                cities: [...user.cities, req.body.city]
            })
        }
        catch (err: any) {
            throw new Error(err)
        }
    };

    // Delete city from favorites
    if (req.method === "DELETE") {
        try {
            const user: UserType | null = await User.findOne({ email: req.body.email });
            if (!user) return res.json({ code: 0, message: "User not found" });
            if (!user.cities.find(city => city === req.body.city)) return res.json({ code: 0, message: "City not saved" });
            await User.updateOne({ _id: user._id }, { cities: user.cities.filter(city => city !== req.body.city) });

            return res.json({
                code: 1,
                cities: user.cities.filter(city => city !== req.body.city)
            })
        }
        catch (err: any) {
            throw new Error(err)
        }
    };
};

export default connectDB(handler);