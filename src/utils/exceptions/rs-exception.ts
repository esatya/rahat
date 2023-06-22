export class RsException extends Error {
  public code: string;
  public name: string;
  public httpCode: number;
  public group: string;
  constructor(message: string, name = 'unknown', httpCode = 500, group = '') {
    super(message);
    this.name = name || 'UNKNOWN';
    this.httpCode = httpCode || 500;
    this.group = group || '';
  }
}

export const ERRORS = {
  NOT_JSON: new RsException(
    'Invalid JSON string',
    'NOT_JSON',
    400,
    'VALIDATION',
  ),
};
