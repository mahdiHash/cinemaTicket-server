class BadRequestErr extends Error {
  code: number;

  constructor(msg = "دادۀ ارسالی معتبر نیست.") {
    super();
    this.name = "BadRequestErr";
    this.message = msg;
    this.code = 400;
  }
}

export { BadRequestErr };
