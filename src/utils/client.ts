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
        // let that = this;
        // this.socket.connect({}, function(frame) {
        //     console.log("Connected: " + frame);
        //     that.socket.subscribe('/chat', function (message) {
        //         console.log("Odebrano wiadomość");
        //         console.log(message.body);
                
        //     });
        //     // that.socket.subscribe("/boss/words", function(message){
        //     //     console.log("Rozpoczynanie gry - jestem bossem");
        //     //     console.log(JSON.parse(message.body)['words']);
        //     // });

        //     // that.socket.subscribe("/player/words", function(message){
        //     //     console.log("Rozpoczynanie gry - jestem graczem");
        //     //     console.log(JSON.parse(message.body));
        //     // });

        //     that.socket.subscribe("/user/queue/message", function(message){
        //         console.log("Otrzymano wiadomość od serwera");
        //         console.log(message);
        //         // console.log(JSON.parse(message));
        //     });
        // })
        this.socket.connect({}, on_connected);

    }


    write(message, path){
        this.socket.send(path, {}, message);
    }

    public getSocket(){
        return this.socket;
    }
}