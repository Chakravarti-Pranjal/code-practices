import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password at least have 6 chars"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
