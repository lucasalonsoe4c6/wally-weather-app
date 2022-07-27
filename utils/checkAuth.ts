import jwt from 'jsonwebtoken';

export default function checkAuth(token: string | null) {
    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
            return user
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
    throw new Error("Auth token not provided")
};