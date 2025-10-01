import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
    fullname: string,
    email: string,
    password: string,
    accessToken: string,
    userRole: string,
    passwordResetToken?: string,
    passwordResetExpires?: Date,
    emailVerified?: boolean,
    verificationCode?: string,
    verificationExpires?: Date
}

const userSchema = new Schema<IUser>({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    accessToken: {type: String},
    userRole:{ enum: ['user', 'admin'], default: 'user', type: String},
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpires: { type: Date }

}, {timestamps:true});

export const User = model<IUser>('User', userSchema);