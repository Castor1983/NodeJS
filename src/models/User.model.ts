import {model, Schema} from 'mongoose';
import { EGenders } from '../enums/gender.enum';


const userSchema = new Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
        min: [1, 'minimum age is 1'],
        max: [110, 'maximum age is 110']
    },
    genders: {
        type: String,
        enum: EGenders,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }

},
    {
        timestamps: true,
        versionKey: false,
    },);

export const User = model("user", userSchema);