class BadRequest extends Error {
  constructor(err) {
    super(err);
    this.message = 'Bed request';
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
