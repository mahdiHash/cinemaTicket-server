class ServerErr extends Error {
  code: number;

  constructor(msg = "خطایی در سمت سرور رخ داده است.") {
    super();
    this.name = "ServerErr";
    this.message = msg;
    this.code = 500;
  }
}

export { ServerErr };
