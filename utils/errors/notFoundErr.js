class NotFoundErr extends Error {
  constructor(msg) {
    super();
    this.name = "NotFoundErr";
    this.message = msg ?? "The resource you requested was not found.";
    this.code = 404;
  }
}

module.exports = NotFoundErr;
