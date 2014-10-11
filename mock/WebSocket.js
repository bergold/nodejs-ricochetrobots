function WebSocket(url) {
  this.url = url;
  this.readyState = 0;
}
WebSocket.CONNECTING = WebSocket.prototype.CONNECTING = 0;
WebSocket.OPEN = WebSocket.prototype.OPEN = 1;
WebSocket.CLOSING = WebSocket.prototype.CLOSING = 2;
WebSocket.CLOSED = WebSocket.prototype.CLOSED = 3;

module.exports = WebSocket;
