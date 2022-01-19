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

    // Process Label Type
    switch(type) {
      case "FreeText":
        var finalContent = content;
        break;
      case "b64Full":
        var data = content;
        var buff = Buffer.from(data, 'base64');
        var text = buff.toString('ascii');
        var finalContent = text;
        break;
    };

    // Create Print Command
    var prntCmnd = 'printf "' + finalContent + '" | nc -w 1 ' + ip + ' 9100';
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

};

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
    printLabel(req.body.printerIP, req.body.labelType, req.body.content);
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

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
