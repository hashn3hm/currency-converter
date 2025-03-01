import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        section_name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["family", "caretaker"],
            default: "family",
            required: true,
        },
        questionText: {
            type: String,
            required: true
        },
        questionType: {
            type: String,
            enum: ["text", "mcq", "boolean"],
            required: true
        },
        options: [
            { type: String }
        ],
        isActive: {
            type: Boolean,
            default: true
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("questions", QuestionSchema);

export default Question;
