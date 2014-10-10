var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');

var app = express();
var port = process.env.PORT || 5000;
var wsPath = process.env.WS_PATH || '/api';

app.get('/', function(req, res, next) {
  if (req.query.dev === undefined) return res.send("under construction...");
  next();
});
app.use(express.static('web'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({ server: server, path: wsPath });
console.log('websocket server created on %s', wsPath);

wss.on('connection', function(ws) {
  // [Todo] handle new websocket connection.
  console.log('new websocket connection');
  
  ws.on('message', function(msg) {
    ws.send(msg);
  });
  ws.on('close', function() {
    console.log('websocket connection closed');
  });
});
