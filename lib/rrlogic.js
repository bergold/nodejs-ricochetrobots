function Game(admin) {
  if (!(admin instanceof Client)) throw new TypeError("`admin` must be an instance of type `Client`");
  this.participants = [admin];
  this.admin = admin.id;
  this.status = Game.WAITING;
}
(function() {
  
}).call(Game.prototype);

Game.WAITING = 0;
Game.STARTED = 1;
Game.FINISHED = 2;


function Client(id, ws) {
  this._id = id;
  this._ws = ws;
  this._name = "";
};
(function() {
  /// Returns the connection state of the client.
  Object.defineProperty(this, "readyState", { get: function() { return this._ws.readyState } });
  
  /// Gets or sets the name of the client.
  Object.defineProperty(this, "name", { get: function() { return this._name; },
                                        set: function(val) {
                                          // findName() == true => abort
                                          this._name = val;
                                          // notify $nameChanged
                                        } });
  
  /// Reconnects a client if it's not connected.
  this.reconnect = function(ws) {
    if (this._ws !== undefined && this._ws.readyState === this._ws.OPEN) return false;
    this._ws = ws;
    // notify $readyStateChanged
    return true;
  };
  
}).call(Client.prototype);


// define API
module.exports.Game = Game;
module.exports.Client = Client;

