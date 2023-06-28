export function replaceWith(str: string | any, replaceWith: string): any {
  return str
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, replaceWith);
}

export function hexStringToBuffer(str: string): Buffer {
  return Buffer.from(str.substring(2), 'hex');
}
