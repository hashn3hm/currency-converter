import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        code: {
            type: Number,
            trim: true,
        },
        image: {
            type: String,
            required: false,
        },
        dob: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        phone: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        zip: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        state: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        country: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        gender: {
            type: String,
            default: "",
            required: false,
        },
        userType: {
            type: String,
            enum: ["admin", "family", "caretaker"],
            default: "family",
            required: true,
        },
        soicalType: {
            type: String,
            enum: ["facebook", "google", "ukinnect"],
            default: "ukinnect",
            required: true,
        },
        otp: {
            type: String,
            trim: true,
            required: false,
            default: "",
        },
        deleted_email: {
            type: String,
            required: false,
            trim: true,
            default: null,
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        switch_notify: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure virtual fields are included in JSON and object responses
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.model("users", UserSchema);
export default User;
