import http = require('http');
import app from './app.js';
import { NodeSystemError } from './types/interfaces/node';

app.set('port', process.env.PORT);

const server = http.createServer(app);

server.listen(process.env.PORT);

server.on('listening', () => {
  console.log(`server is running at 127.0.0.1:${process.env.PORT}`);
});

server.on('error', (err: NodeSystemError) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  switch (err.code) {
    case 'EACCESS':
      console.error(`Port ${process.env.PORT} requires elavated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${process.env.PORT} is already in use`);
      process.exit(1);
    default:
      throw err;
  }
});
