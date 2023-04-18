class ForbiddenErr extends Error {
  constructor(msg) {
    super();
    this.name = 'ForbiddenErr';
    this.message = msg ?? 'شما برای دسترسی به این مسیر یا انجام این اقدام هویت‌سنجی معتبری ندارید.';
    this.code = 403;
  }
}

module.exports = ForbiddenErr;
