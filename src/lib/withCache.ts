import { setCache, getCache } from "./cache";

export async function withCache<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
) {
  const cached = await getCache<T>(key);
  if (cached) {
    return cached;
  }
  const freshData = await fetchFn();
  await setCache<T>(key, freshData, ttl);
  return freshData;
}
