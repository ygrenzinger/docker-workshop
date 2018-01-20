'use strict';

const express = require('express');

// Constants
const PORT = 9090;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log('pid is ' + process.pid);

process.on('SIGTERM', function () {
  server.close();
  console.log('stopping application after SIGTERM');
  process.exit(0);
});
