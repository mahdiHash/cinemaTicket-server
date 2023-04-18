class NotFoundErr extends Error {
  constructor(msg) {
    super();
    this.name = "NotFoundErr";
    this.message = msg ?? "منبعی که به دنبال آن هستید پیدا نشد.";
    this.code = 404;
  }
}

module.exports = NotFoundErr;
