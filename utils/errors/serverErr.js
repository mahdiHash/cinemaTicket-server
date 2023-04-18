class ServerErr extends Error {
  constructor(msg) {
    super();
    this.name = ServerErr;
    this.message = msg ?? "خطایی در سوی سرور رخ داده است.";
    this.code = 500;
  }
}

module.exports = ServerErr;
