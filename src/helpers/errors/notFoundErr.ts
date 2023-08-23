class NotFoundErr extends Error {
  code: number;

  constructor(msg = 'منبعی که به دنبال آن هستید پیدا نشد.') {
    super();
    this.name = 'NotFoundErr';
    this.message = msg;
    this.code = 404;
  }
}

export { NotFoundErr };
