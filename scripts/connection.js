var net = require("net");

const HOST = "192.168.0.31";
const PORT = 7777;


var connectButton;
var infoText;
var messageInput;
var sendButton;
var client;

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
        client.write("PRINT:"+message)
        messageInput.value = "";
    }
}

function connectToServer(ip, port){
    showConnectingState();
    client = new Client();
    client.connect(ip, port, showConnectedState);
}

function showConnectingState() {
    connectButton.style.display = "none"
    infoText.innerHTML = "Łączenie";
}

function showConnectedState(){
    infoText.innerHTML = "Połączono"
}
