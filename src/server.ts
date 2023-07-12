import http = require('http');
import app from './app.js';
import { NodeSystemError } from './types/interfaces/node';
import { envVariables } from './config';

app.set('port', envVariables.port);

const server = http.createServer(app);

server.listen(envVariables.port);

server.on('listening', () => {
  console.log(`server is running at 127.0.0.1:${envVariables.port}`);
});

server.on('error', (err: NodeSystemError) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  switch (err.code) {
    case 'EACCESS':
      console.error(`Port ${envVariables.port} requires elavated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${envVariables.port} is already in use`);
      process.exit(1);
    default:
      throw err;
  }
});
