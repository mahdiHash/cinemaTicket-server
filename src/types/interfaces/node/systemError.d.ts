// source: https://gist.github.com/reporter123/7c10e565fb849635787321766b7f8ad8

interface NodeSystemError extends Error {
  address?: string;
  code: string;
  dest: string;
  errno: number;
  info?: {};
  message: string;
  path?: string;
  port?: number;
  syscall: string;
}

export { NodeSystemError };
