class ConflictError extends Error {
  constructor(err) {
    super(err);
    this.message = 'User with this email already exists';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
