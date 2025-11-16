import mongoose from "mongoose";
import { config } from "dotenv";
import { student } from "./models/studentModel.js";
import { address } from "./models/addressModel.js";
config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected!");
    await student.deleteMany({});

    const students = await student.insertMany([
      { name: "Ram", age: 25 },
      { name: "Vishnu", age: "24" },
    ]);

    console.log(students);

    // const add = await address.create({
    //   line1: "Banda",
    //   city: "Banda",
    //   country: "India",
    // });

    // console.log(add);
  } catch (error) {
    console.log("Mongo Error : ", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
})();
