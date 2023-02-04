const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
  console.log(`server is running at 127.0.0.1:${port}`);
});
server.on('error', (err) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  switch (err.code) {
    case 'EACCESS':
      console.error(`Port ${port} requires elavated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default:
      throw err;
  }
});
