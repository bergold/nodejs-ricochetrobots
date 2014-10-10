var devconsole = angular.module("devconsole", ["ngRoute"]);

devconsole.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/dashboard", {
      templateUrl: "partials/dashboard.html"
    })
    .when("/websocket", {
      templateUrl: "partials/websocket.html"
    })
    .otherwise("/dashboard");
  $locationProvider.hashPrefix("!");
});


devconsole.service("websocket", function($q) {
  var websocket = function() {
    this.url = "";
    this.ws  = undefined;
    this.events = {
      "open": [],
      "error": [],
      "message": [],
      "close": []
    };
  };
  (function() {
    this.on = function(evt, fn) {
      if (this.events[evt]===undefined) return false;
      this.events[evt].push(fn);
    };
    this._trigger = function(evt, e) {
      if (this.events[evt]===undefined) return false;
      var fns = this.events[evt];
      for (var i=0; i<fns.length; i++) {
        fns[i].call(this, e);
      }
    };
    this.connect = function(url) {
      if (this.ws!==undefined && this.ws.readyState!==WebSocket.CLOSED) return false;
      this.url = url;
      this.ws = new WebSocket(this.url);
      this.ws.addEventListener("open", this._trigger.bind(this, "open"));
      this.ws.addEventListener("error", this._trigger.bind(this, "error"));
      this.ws.addEventListener("message", this._trigger.bind(this, "message"));
      this.ws.addEventListener("close", this._trigger.bind(this, "close"));
    };
    this.send = function(msg) {
      if (this.ws===undefined || this.ws.readyState!==WebSocket.OPEN) return false;
      this.ws.send(msg);
    };
    this.close = function() {
      if (this.ws===undefined || this.ws.readyState!==WebSocket.OPEN) return;
      this.ws.close();
    };
    this.state = function() {
      if (this.ws===undefined) return "undefined";
      if (this.ws.readyState===WebSocket.CONNECTING) return "CONNECTING";
      if (this.ws.readyState===WebSocket.OPEN) return "OPEN";
      if (this.ws.readyState===WebSocket.CLOSING) return "CLOSING";
      if (this.ws.readyState===WebSocket.CLOSED) return "CLOSED";
      return "undefined";
    };
  }).call(websocket.prototype);
  return websocket;
});

/// WebSocketCtrl
devconsole.controller("WebSocketCtrl", function($scope, websocket) {
  var ws = new websocket();
  
  var log = function() {
    var args = ["[ws]"].concat([].slice.call(arguments, 0));
    console.log.apply(console, args);
    $scope.msgs.push({
      type: "log",
      content: [].join.call(arguments, " ")
    });
  };
  var update = function() {
    $scope.$apply(function() {
      var s = ws.state();
      $scope.connected = (s == "OPEN");
      $scope.changing = (s == "CONNECTING" || s == "CLOSING");
    });
  };
  
  $scope.connected = false;
  $scope.changing = false;
  $scope.uri = "ws://" + location.host + "/api";
  $scope.msgs = [];
  
  ws.on("open", function() {
    log("connected");
    update();
  });
  ws.on("error", function(er) {
    log("an error occurred");
    update();
  });
  ws.on("message", function(msg) {
    $scope.$apply(function() {
      $scope.msgs.push({
        type: "message",
        sender: "remote",
        content: msg.data
      });
    });
  });
  ws.on("close", function() {
    log("connection closed");
    update();
  });
  
  $scope.open = function() {
    $scope.changing = true;
    log("connecting to", $scope.uri);
    ws.connect($scope.uri);
  };
  $scope.close = function() {
    $scope.changing = true;
    log("closing connection");
    ws.close();
  };
  $scope.send = function() {
    var msg = $scope.msg;
    ws.send(msg);
    $scope.msgs.push({
      type: "message",
      sender: "local",
      content: msg
    });
    $scope.msg = '';
  };
});
