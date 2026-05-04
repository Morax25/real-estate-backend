import * as IORedis from "ioredis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./env.js";

type RedisClient = IORedis.Redis;

let redisClient: RedisClient | null = null;

export const getRedis = (): RedisClient => {
  if (!redisClient) {
    redisClient = new IORedis.Redis({
      host: REDIS_HOST || "127.0.0.1",
      port: Number(REDIS_PORT || 6379),
      password:REDIS_PASSWORD || undefined,

      retryStrategy: (times: number) =>
        Math.min(times * 50, 2000),

      maxRetriesPerRequest: 3,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err: Error) => {
      console.error("❌ Redis error:", err.message);
    });
  }

  return redisClient;
};
