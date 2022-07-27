export default function validatePassword(password: string){
    if (!password) return { code: 0, message: 'Please add a password' };
    if (password.length < 6) return { code: 0, message: 'Password too short' };
    if (password.length > 20) return { code: 0, message: 'Password too long' };

    return { code: 1, message: 'Valid' };
}