export function withTruthy<T>(input: T | undefined | (T | undefined)[]): T[] {
  const arr = Array.isArray(input) ? input : [input];
  return arr.filter((v): v is T => v !== undefined);
}
