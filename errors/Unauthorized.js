class Unauthorized extends Error {
  constructor(err) {
    super(err);
    this.message = 'Authorisation error';
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
