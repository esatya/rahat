class UnknownFormatException extends Error {
  constructor() {
    super();
    this.message = 'Unknown format';
    this.code = 400;
  }
}

module.exports = UnknownFormatException;
