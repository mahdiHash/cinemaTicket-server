class BadRequestErr extends Error {
  constructor(msg) {
    super();
    this.name = "BadRequestErr";
    this.message = msg ?? "دادۀ ارسالی معتبر نیست.";
    this.code = 400;
  }
}

module.exports = BadRequestErr;
