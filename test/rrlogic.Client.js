var assert = require("assert");
var Client = require("../lib/rrlogic").Client;
var WebSocket = require("../mock/WebSocket");

describe("rrlogic.Client", function() {
  var ws;
  var client;
  
  beforeEach(function() {
    ws = new WebSocket("ws://echo.example.com/ws");
    client = new Client("12345", ws);
  });
  
  it("should return the correct status", function() {
    assert.equal(ws.readyState, client.readyState);
  });
  
  it("should not reconnect", function() {
    ws.readyState = WebSocket.OPEN;
    assert.equal(false, client.reconnect());
  });
  
});
