// import * as net from "net"

export class Client{

    socket;

    constructor(){
        this.socket;
    }

    connect(host, port, on_connected){
        // this.socket = net.createConnection({host: host, port:port}, on_connected);
    }

    write(message){
        // this.socket.write(message + "\r\n");
    }
}