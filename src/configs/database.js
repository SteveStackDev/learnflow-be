import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      dbName: "LearnFlow",
    });
    console.log("Kết nối database thành công!");
  } catch (error) {
    console.error("Kết nối database thất bại. Lỗi: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
