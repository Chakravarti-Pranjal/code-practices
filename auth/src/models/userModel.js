import { Model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

export const User = Model("user", userSchema);
