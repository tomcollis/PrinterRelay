'use strict';

const express = require('express');
var app = module.exports = express();
app.use(express.json());
var path = require('path');
const { exec } = require("child_process");

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// Error Message
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// Print Label
function printLabel(ip, type, content) {
    console.log('Received and printed a ' + type + ' label to ' + ip);
    var prntCmnd = 'printf "' + content + '" | nc -w 1 ' + ip + ' 9100';
    console.log(prntCmnd);
    // Send Label to Printer
    exec( prntCmnd , (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

}

// a simple help guide
app.get('/', function(req, res){
  res.status(200);
  res.set('Cache-control', `no-store`)
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.send({ error: "Hello World"});
});

// the following, accepts any http posts that contains data

app.post('/p/', function(req, res){
  if (req.body.length <= 0) {
    // post is empty
    res.status(404);
    res.set('Cache-control', `no-store`)
    res.send({ error: "no data" });
    console.log('received: empty request');
  } else {
    // post is not empty
    res.status(200);
    res.set('Cache-control', `no-store`)
    res.send({ success: "data received", body: req.body});
    printLabel(req.body.printerIP, req.body.labelType, req.body.content)
    // console.log('Received and printed a ' + req.body.labelType + ' label to ' + req.body.printerIP);
    // var prntCmnd = 'printf "' + req.body.content + '" | nc -w 1 ' + req.body.printerIP + ' 9100';
    // console.log(prntCmnd);
  }
});

// middleware for error handling. 
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.set('Cache-control', `no-store`)
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. 
app.use(function(req, res){
  res.status(404);
  res.set('Cache-control', `no-store`)
  res.send({ error: "can't find that" });
});

// Future Command
// 
// printf "^xa^cfa,50^fo100,100^fdHello World^fs^xz" | nc -w 1 printer_ip 9100

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
