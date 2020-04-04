// var net = require("net");
import * as net from "net"
// const net = require("net")

export class Client{

    socket;

    constructor(){
        this.socket;
    }

    connect(host, port, on_connected){
        this.socket = net.createConnection({host: host, port:port}, on_connected);
    }

    write(message){
        this.socket.write(message + "\r\n");
    }
}