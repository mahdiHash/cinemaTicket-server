class UnauthorizedErr extends Error {
  code: number;

  constructor(msg = 'موارد هویت‌سنجی شما معتبر نیست.') {
    super();
    this.name = 'UnauthorizedErr';
    this.message = msg;
    this.code = 401;
  }
}

export { UnauthorizedErr };
