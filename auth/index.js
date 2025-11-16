import express from "express";
import { config } from "dotenv";
import connectDB from "./src/config/connectDB.js";
config();

const app = express();
const PORT = 4040;

app.use((err, req, res, next) => {
  console.log("Error : ", err);
  next();
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port : ${PORT}`);
});
