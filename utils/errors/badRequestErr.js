class BadRequestErr extends Error {
  constructor(msg) {
    super();
    this.name = "BadRequestErr";
    this.message = msg ?? "The data you provided is not valid.";
    this.code = 400;
  }
}

module.exports = BadRequestErr;
