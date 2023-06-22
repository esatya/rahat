export function replaceWith(str: string | any, replaceWith: string): any {
  return str
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, replaceWith);
}
