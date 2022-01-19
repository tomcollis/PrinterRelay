'use strict';

const express = require('express');
var app = module.exports = express();
app.use(express.json());
var path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Error Message
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// a simple help guide
app.get('/', function(req, res){
  res.status(200);
  // res.set('Cache-control', `no-store`)
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.send({ error: "Hello World" });
});

app.post('/', function(req, res){
  res.status(404);
  res.set('Cache-control', `no-store`)
  res.send({ error: "data shouldn't be posted here" });
  console.log('received: data posted to wrong endpoint');
});

// the following, accepts any http posts that contains data

app.post('/p/', function(req, res){
  if (req.body.length < 1) {
    // post is empty
    res.status(404);
    res.set('Cache-control', `no-store`)
    res.send({ error: "no data" });
    console.log('received: empty request');
  } else {
    // post is not empty
    console.log('receiving data from');
    res.status(200);
    res.set('Cache-control', `no-store`)
    res.send({ success: "data received", body: req.body});
    console.log('data received and processed');
  }
});

// Add ERROR and 404

// Future Command
// 
// cat you_file.prn | nc -w 1 printer_ip 9100

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
