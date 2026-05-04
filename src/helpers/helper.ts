export const toString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};
