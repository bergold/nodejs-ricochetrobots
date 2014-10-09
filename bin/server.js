var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require('express');

var app = express();
var port = process.env.PORT || 5000;

// app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.send('under construction...');
});

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({ server: server, path: "/api" });
console.log("websocket server created");

wss.on("connection", function(ws) {
  // [Todo] handle new websocket connection.
});
