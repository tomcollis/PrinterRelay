'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Future Command
// 
// cat you_file.prn | nc -w 1 printer_ip 9100

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
