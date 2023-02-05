class ServerErr extends Error {
  constructor(msg) {
    super();
    this.name = ServerErr;
    this.message = msg ?? "Something went wrong in server.";
    this.code = 500;
  }
}

module.exports = ServerErr;
