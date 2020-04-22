import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs"

export class Client{

    private serverUrl = 'http://localhost:8080/tajniaki'

    private socket;

    constructor(){
    }

    connect(host, port, on_connected){
        var socket = new SockJS(this.serverUrl);
        this.socket = Stomp.over(socket);
        this.socket.connect({}, on_connected);

    }


    write(message, path){
        this.socket.send(path, {}, message);
    }

    public getSocket(){
        return this.socket;
    }
}