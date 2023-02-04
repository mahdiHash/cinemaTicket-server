class ApiKeyErr extends Error {
  constructor(msg) {
    super();
    this.name = "ApiKeyErr";
    this.message = msg ?? "The api key is not provided or not valid.";
    this.code = 401;
  }
}

module.exports = ApiKeyErr;
