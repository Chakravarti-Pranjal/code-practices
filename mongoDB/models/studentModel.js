import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  name: String,
  age: Number,
  address: { type: Schema.Types.ObjectId, ref: "address" },
});

export const student = model("student", studentSchema);
