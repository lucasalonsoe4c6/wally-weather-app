import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}`;

    try {
        const data = await (await axios.get(`${url}&q=${req.body.city}`)).data;
        res.json({
            code: 1,
            message: '',
            ...data
        })
    }
    catch (err){
        res.json({
            code: 0,
            message: JSON.stringify(err)
        })
    }
}