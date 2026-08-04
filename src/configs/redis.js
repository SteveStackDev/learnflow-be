import { createClient } from "redis";

export const redisClient = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`,
});

const connectRedis = async () => {
  try {
    await redisClient
      .connect()
      .then(() => console.log("Kết nối Redis thành công!"));
  } catch (error) {
    console.error("Kết nối Redis thất bại. Lỗi: ", error.message);
    process.exit(1);
  }
};

export default connectRedis;
