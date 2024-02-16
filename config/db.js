import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let url = process.env.DB_URL;

export const dbConnect = () => {
    mongoose.connect(url);
    console.log("connected to database");
}