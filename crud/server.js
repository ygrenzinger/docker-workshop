'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const esCrud = require('./es-crud');

// Constants
const PORT = 9090;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res, next) {  
  esCrud.getStuffs().then(function (result) { res.json(result) });
});

app.post('/', function (req, res, next) {  
  console.log(JSON.stringify(req.body));
  esCrud.addStuff(req.body).then(function (result) { res.json(result) });
});

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log('pid is ' + process.pid);

process.on('SIGTERM', function () {
  server.close();
  console.log('stopping application after SIGTERM');
  process.exit(0);
});
