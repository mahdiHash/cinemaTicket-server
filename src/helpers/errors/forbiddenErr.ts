class ForbiddenErr extends Error {
  code: number;

  constructor(
    msg = 'شما برای دسترسی به این مسیر یا انجام این اقدام هویت‌سنجی معتبری ندارید.'
  ) {
    super();
    this.name = 'ForbiddenErr';
    this.message = msg;
    this.code = 403;
  }
}

export { ForbiddenErr };
