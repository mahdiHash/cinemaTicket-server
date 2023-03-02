class ForbiddenErr extends Error {
  constructor(msg) {
    super();
    this.name = 'ForbiddenErr';
    this.message = msg ?? 'You are not authorized to access this resource.';
    this.code = 403;
  }
}

module.exports = ForbiddenErr;
