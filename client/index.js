var express = require('express');
var path = require('path');
 var app = express();
 app.use(express.static(path.join(__dirname, '/../build/contracts')));
 app.use(express.static(path.join(__dirname, '/')));
 app.get('/', function(req, res) {
     res.sendFile('index.html', { root: __dirname + '/'});
 });
 app.listen(3000);