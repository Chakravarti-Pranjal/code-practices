import { model, Schema } from "mongoose";

const addressSchema = new Schema({
  line1: String,
  city: String,
  country: String,
});

export const address = model("address", addressSchema);
