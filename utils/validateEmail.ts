import { emailRegex } from "../const/const";

export default function validateEmail(email: string) {
    if (!email) return { code: 0, message: 'Please add an email' };
    if (!emailRegex.test(email)) return { code: 0, message: 'Please enter a valid email' };
    
    return { code: 1, message: 'Valid' };
}