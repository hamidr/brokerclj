// Generated by CoffeeScript 1.7.1
var WebSocket, connectionCount, connectionLimit, connections, createConnection, i, interval, log, messageInterval, messagesReceived, messagesSent, _i, _ref;

WebSocket = require('ws');

log = console.log.bind(console);

connectionCount = 0;

messagesReceived = 0;

messagesSent = 0;

connectionLimit = process.argv[2] || 100;

messageInterval = 5000;

connections = [];

log("This test connect " + connectionLimit + " concurent websocket connections and send message in random sequence");

log("Total number of recieved messages must be total number of sent messages plus number of connections");

log("");

log("Connecting to " + connectionLimit + " concurent connections");

createConnection = function() {
  var __ws;
  __ws = new WebSocket('ws://localhost:9090/ws', {
      origin: 'https://localhost:9090'
  });
  __ws.sendTest = function(data) {
    messagesSent++;
    return this.send(JSON.stringify(data));
  };
  __ws.on('open', function() {
    connectionCount++;
    return this.sendTest({
      command:  "authenticate",
      username: Math.random(),
      version: 1,
      password: "password",
      user_id: Math.random(),
      app_key: Math.random()
    });
  });
  __ws.on('message', function(message) {
    messagesReceived++;
    return this.sendTest({
      command: "hello",
      value: "world!" + Math.random()
    });
  });
  __ws.on('close', function() {
    return connectionCount--;
  });
  return connections.push(__ws);
};

for (i = _i = 0, _ref = connectionLimit / 10; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
  setTimeout(function() {
    var j, _j, _results;
    _results = [];
    for (j = _j = 0; _j < 10; j = ++_j) {
      _results.push(createConnection());
    }
    return _results;
  }, Math.floor(Math.random() * 45 + i * 30));
}

interval = setInterval(function() {
  return log("" + connectionCount + " connections are active, " + messagesReceived + " messages recieved, " + messagesSent + " messages sent");
}, 1000);