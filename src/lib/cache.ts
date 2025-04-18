import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

let redisAvailable = true;

redis.connect().catch((err) => {
  redisAvailable = false;
  console.error("Redis connection error: ", err);
});

const DEFAULT_TTL = 300; // in seconds

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisAvailable) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Redis GET failed for key ${key} `, err);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL
) {
  if (!redisAvailable) return null;
  try {
    await redis.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  } catch (err) {
    console.error(`Redis SET failed for key ${key} `, err);
  }
}

export { redis };
