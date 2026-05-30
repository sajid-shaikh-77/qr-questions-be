import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        type: {
            type: String,
            enum: ["text", "audio", "mixed"],
            required: true
        },

        text: {
            type: String,
            default: null
        },

        audioUrl: {
            type: String,
            default: null
        },

        language: {
            type: String,
            default: "unknown"
        },

        status: {
            type: String,
            enum: [
                "pending",
                "reviewing",
                "answered",
                "rejected"
            ],
            default: "pending"
        },

        answeredAt: Date,

        deletedAt: Date
    },
    {
        timestamps: true
    }
);
export const Question = mongoose.model("question", QuestionSchema);