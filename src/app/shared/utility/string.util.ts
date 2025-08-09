export function isStr(str: string) {
  const oneOf = (...arr: string[]) => arr.includes(str);
  const oneOfIgnoreCase = (...arr: string[]) => arr.some((a) => a.toLowerCase() === str.toLowerCase());

  return { oneOf, oneOfIgnoreCase };
}
