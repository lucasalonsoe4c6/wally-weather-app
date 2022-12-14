import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cities: {
        type: [String],
        required: false
    }
});

const UserModel = models.User || model('User', UserSchema);
export default UserModel;