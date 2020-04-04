"use strict";
exports.__esModule = true;
// var net = require("net");
var net = require("net");
// const net = require("net")
var Client = /** @class */ (function () {
    function Client() {
        this.socket;
    }
    Client.prototype.connect = function (host, port, on_connected) {
        this.socket = net.createConnection({ host: host, port: port }, on_connected);
    };
    Client.prototype.write = function (message) {
        this.socket.write(message + "\r\n");
    };
    return Client;
}());
exports.Client = Client;
