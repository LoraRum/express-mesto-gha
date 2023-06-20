class ServerError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Server error';
    this.statusCode = 500;
  }
}

module.exports = ServerError;
