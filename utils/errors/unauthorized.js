class UnauthorizedErr extends Error {
  constructor(msg) {
    super();
    this.name = "UnauthorizedErr";
    this.message = msg ?? "موارد هویت‌سنجی شما معتبر نیست.";
    this.code = 401;
  }
}

module.exports = UnauthorizedErr;
