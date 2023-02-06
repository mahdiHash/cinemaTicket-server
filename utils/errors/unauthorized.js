class UnauthorizedErr extends Error {
  constructor(msg) {
    super();
    this.name = "UnauthorizedErr";
    this.message = msg ?? "The credentials you provided are not valid.";
    this.code = 401;
  }
}

module.exports = UnauthorizedErr;
