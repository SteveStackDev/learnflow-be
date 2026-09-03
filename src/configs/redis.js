import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ||
  (process.env.REDIS_PASSWORD
    ? `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT || "localhost"}:${process.env.REDIS_PORT || 6379}`
    : `redis://${process.env.REDIS_ENDPOINT || "localhost"}:${process.env.REDIS_PORT || 6379}`);

export const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Kết nối Redis thành công!");
  } catch (error) {
    console.error("Kết nối Redis thất bại. Lỗi: ", error.message);
  }
};

export default connectRedis;
