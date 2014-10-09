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
