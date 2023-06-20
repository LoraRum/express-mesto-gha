class NotFound extends Error {
  constructor(err) {
    super(err);
    this.message = 'Data not found';
    this.statusCode = 404;
  }
}

module.exports = NotFound;
