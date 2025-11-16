import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected Successfylly!");
  } catch (error) {
    console.log("Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
