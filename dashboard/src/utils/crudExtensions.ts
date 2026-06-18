export type {};

declare global {
  type WithId<T> = T & { id?: string };
}