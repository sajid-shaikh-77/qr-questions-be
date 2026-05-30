import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
    {
        name: String,

        slug: {
            type: String,
            unique: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);
export const Room = mongoose.model('model',roomSchema)