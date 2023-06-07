class ApiKeyErr extends Error {
  code: number;

  constructor(msg = "کلید api معتبر نیست یا ارسال نشده است.") {
    super();
    this.name = "ApiKeyErr";
    this.message = msg;
    this.code = 401;
  }
}

export { ApiKeyErr };
