import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String,

        },

        role: {
            type: String,
            enum: ["admin", "super-admin"],
            default: "admin"
        }
    },

    { timestamps: true }
)
export const Admin = mongoose.model('admin', adminSchema)