class ApiKeyErr extends Error {
  constructor(msg) {
    super();
    this.name = "ApiKeyErr";
    this.message = msg ?? "کلید api معتبر نیست یا ارسال نشده است.";
    this.code = 401;
  }
}

module.exports = ApiKeyErr;
