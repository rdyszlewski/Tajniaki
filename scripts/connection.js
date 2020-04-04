var net = require("net");

const HOST = "192.168.0.31";
const PORT = 7777;

class Connection {
    
    connect(ip, port, on_connected){
        var client = net.createConnection({host: ip, port:port}, on_connected);
        return client;
    }

}

var connectButton;
var infoText;
var messageInput;
var sendButton;
var socket;

window.onload = function(e){
   initElements();
   initListeners();
}

function initElements(){
    this.connectButton = document.getElementById("connect_button");
    this.infoText = document.getElementById("info_text");
    this.messageInput = document.getElementById("message_input");
    this.sendButton = document.getElementById("send_button");
}

function initListeners(){
    this.connectButton.onclick = function(){
        connectToServer(HOST, PORT);
    }

    this.sendButton.onclick = function(){
        var message = messageInput.value;
        socket.write("PRINT:"+message+"\r\n");
        messageInput.value = "";
    }
}

function connectToServer(ip, port){
    showConnectingState();
    var connection = new Connection();
    socket = connection.connect(ip, port, showConnectedState);
    
}

function showConnectingState() {
    connectButton.style.display = "none"
    infoText.innerHTML = "Łączenie";
}

function showConnectedState(){
    infoText.innerHTML = "Połączono"
}
